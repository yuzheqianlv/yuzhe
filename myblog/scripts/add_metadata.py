#!/usr/bin/env python3
import os
import re
import datetime
from pathlib import Path

def extract_title_from_content(content):
    """从文件内容中提取标题"""
    # 尝试从一级标题中提取
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if title_match:
        return title_match.group(1)
    # 如果没有一级标题，返回文件名作为标题
    return None

def has_frontmatter(content):
    """检查文件是否已经包含元数据头"""
    return content.startswith('+++')

def create_frontmatter(title, date=None):
    """创建TOML格式的元数据"""
    if date is None:
        date = datetime.date.today()
    
    return f"""+++
title = \"{title}\"
date = {date}
description = \"{title}的详细说明\"
+++

"""

def add_metadata_to_file(file_path):
    """为单个文件添加元数据"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if has_frontmatter(content):
        print(f"跳过 {file_path}: 已存在元数据")
        return
    
    # 提取标题
    title = extract_title_from_content(content)
    if not title:
        title = Path(file_path).stem
    
    # 创建元数据
    frontmatter = create_frontmatter(title)
    
    # 写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(frontmatter + content)
    print(f"已添加元数据到 {file_path}")

def process_directory(directory):
    """处理目录下的所有Markdown文件"""
    directory = Path(directory)
    if not directory.exists():
        print(f"错误: 目录 {directory} 不存在")
        return
    
    for file_path in directory.glob('*.md'):
        if file_path.is_file():
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