#!/usr/bin/env python3
import os
import re
import datetime
import jieba
import jieba.analyse
from pathlib import Path

def extract_title_from_content(content):
    """从文件内容中提取标题，优先从元数据中提取，其次从一级标题中提取"""
    # 尝试从现有元数据中提取
    title_meta_match = re.search(r'title\s*=\s*"([^"]+)"', content)
    if title_meta_match:
        return title_meta_match.group(1)
    
    # 尝试从一级标题中提取
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if title_match:
        return title_match.group(1)
    
    return None

def extract_tags_from_content(content):
    """从文件内容中提取标签，优先使用已有标签，其次智能分析内容生成标签"""
    # 首先尝试提取现有标签
    existing_tags = extract_existing_tags(content)
    if existing_tags:
        return existing_tags
    
    # 如果没有现有标签，使用智能分析生成标签
    return generate_smart_tags(content)

def validate_tags(tags):
    """验证标签格式是否正确"""
    if not isinstance(tags, list):
        return False
    
    for tag in tags:
        # 检查标签类型
        if not isinstance(tag, str):
            return False
        # 检查标签长度
        if len(tag.strip()) < 2:
            return False
        # 检查标签格式（只允许中文、英文、数字和常用标点）
        if not re.match(r'^[\u4e00-\u9fa5a-zA-Z0-9_\-\s]+$', tag.strip()):
            return False
    return True

def extract_existing_tags(content):
    """提取文件中已存在的标签"""
    # 尝试从taxonomies中提取标签
    taxonomies_match = re.search(r'\[taxonomies\][^\[]*tags\s*=\s*\[([^\]]+)\]', content, re.DOTALL)
    if taxonomies_match:
        # 提取标签并清理格式
        tags_str = taxonomies_match.group(1)
        tags = re.findall(r'"([^"]+)"', tags_str)
        tags = [tag.strip() for tag in tags if tag.strip()]
        return tags if validate_tags(tags) else ["未分类"]
    
    # 尝试匹配直接的tags定义
    tags_match = re.search(r'^tags\s*=\s*\[([^\]]+)\]', content, re.MULTILINE)
    if tags_match:
        tags_str = tags_match.group(1)
        tags = re.findall(r'"([^"]+)"', tags_str)
        tags = [tag.strip() for tag in tags if tag.strip()]
        return tags if validate_tags(tags) else ["未分类"]
    
    # 尝试匹配老格式 "tags: tag1, tag2, tag3"
    old_tags_match = re.search(r'^tags:\s*(.+)$', content, re.MULTILINE)
    if old_tags_match:
        tags = [tag.strip() for tag in old_tags_match.group(1).split(',')]
        tags = [tag for tag in tags if tag]
        return tags if validate_tags(tags) else ["未分类"]
    
    return ["未分类"]

def generate_smart_tags(content):
    """智能分析文章内容生成标签"""
    # 移除元数据部分
    if has_frontmatter(content):
        content = re.sub(r'\+\+\+[^+]*\+\+\+\n+', '', content, flags=re.DOTALL)
    
    # 移除Markdown语法
    content = re.sub(r'#.*?\n', '', content)  # 移除标题
    content = re.sub(r'\[.*?\]\(.*?\)', '', content)  # 移除链接
    content = re.sub(r'`.*?`', '', content)  # 移除代码
    content = re.sub(r'\*\*.*?\*\*', '', content)  # 移除加粗
    content = re.sub(r'\*.*?\*', '', content)  # 移除斜体
    
    # 使用jieba提取关键词
    tags = jieba.analyse.extract_tags(content, topK=5, withWeight=False)
    
    # 过滤太短的标签
    tags = [tag for tag in tags if len(tag) >= 2]
    
    # 如果没有提取到有效标签，返回默认标签
    if not tags:
        return ["未分类"]
    
    return tags

def has_frontmatter(content):
    """检查文件是否已经包含元数据头"""
    return content.startswith('+++')

def create_frontmatter(title, tags=None, date=None):
    """创建TOML格式的元数据，确保包含所有必要字段"""
    if date is None:
        date = datetime.date.today()
    if tags is None:
        tags = ["未分类"]
    elif len(tags) == 0:
        tags = ["未分类"]
    
    # 确保标题不为空
    if not title or title.strip() == "":
        title = "未命名文档"
    
    tags_str = '[' + ', '.join(f'"{tag}"' for tag in tags) + ']'
    return f"""+++
title = \"{title}\"
date = {date}
description = \"{title}的详细说明\"

[taxonomies]
tags = {tags_str}
+++

"""

def add_metadata_to_file(file_path):
    """为单个文件添加或更新元数据"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否需要更新现有元数据
        if has_frontmatter(content):
            # 检查现有元数据是否完整
            if all(field in content for field in ['title =', 'date =', 'description =', 'tags =']):
                print(f"跳过 {file_path}: 已存在完整元数据")
                return
            else:
                print(f"更新 {file_path}: 元数据不完整")
        
        # 提取标题
        title = extract_title_from_content(content)
        if not title:
            title = Path(file_path).stem
        
        # 提取标签
        tags = extract_tags_from_content(content)
        
        # 创建元数据
        frontmatter = create_frontmatter(title, tags)
        
        # 如果已存在元数据，移除它
        if has_frontmatter(content):
            content = re.sub(r'\+\+\+[^+]*\+\+\+\n+', '', content, flags=re.DOTALL)
        
        # 写入文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(frontmatter + content.lstrip())
        print(f"已{'更新' if has_frontmatter(content) else '添加'}元数据到 {file_path}")
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {str(e)}")

def process_directory(directory):
    """处理目录下的所有Markdown文件，排除README.md和_index.md"""
    directory = Path(directory)
    if not directory.exists():
        print(f"错误: 目录 {directory} 不存在")
        return
    
    for file_path in directory.glob('*.md'):
        if file_path.is_file():
            # 排除README.md和_index.md文件
            if file_path.name.lower() in ['readme.md', '_index.md']:
                print(f"跳过 {file_path}: 系统文件")
                continue
            add_metadata_to_file(str(file_path))

def main():
    import sys
    if len(sys.argv) != 2:
        print("使用方法: python add_metadata.py <directory>")
        sys.exit(1)
    
    directory = sys.argv[1]
    process_directory(directory)

if __name__ == '__main__':
    main()