+++
title = "测试代码块高度限制"
date = 2024-01-02
description = "这是一个用于测试代码块高度限制功能的测试文章"
[taxonomies]
tags = ["测试"]
+++

# 测试代码块高度限制

## 短代码块测试

这是一个只有3行的短代码块：

```python
def short_function():
    return "这是一个短函数"
```

## 中等长度代码块测试

这是一个6行的中等长度代码块：

```python
def medium_function():
    # 这是一个中等长度的函数
    result = 0
    for i in range(3):
        result += i
    return result
```

## 长代码块测试

这是一个超过10行的长代码块，用于测试滚动条效果：

```rust
use axum::{Json, http::StatusCode};
use regex::RegexBuilder;
use serde::{Deserialize, Serialize};
use std::{fs, collections::HashMap};
use walkdir::WalkDir;

#[derive(Deserialize)]
pub struct SearchRequest {
    pub query: String,
    pub case_sensitive: Option<bool>,
    pub whole_word: Option<bool>,
    pub max_results: Option<usize>,  // 添加最大结果数限制
}

#[derive(Serialize, Clone)]
pub struct SearchResult {
    pub path: String,
    pub content: String,
    pub line_number: usize,
    pub context_before: Vec<String>,
    pub context_after: Vec<String>,
    pub score: f32,  // 改为必需字段
    pub highlights: Vec<(usize, usize)>,  // 改为必需字段
    pub metadata: Option<HashMap<String, String>>, // 添加元数据支持
}

// 计算相关性分数
fn calculate_score(content: &str, query: &str, matches: usize) -> f32 {
    let content_len = content.len() as f32;
    let query_len = query.len() as f32;
    let match_ratio = matches as f32 / content_len;
    
    // TF-IDF 启发式计算
    let tf = match_ratio * (1.0 + (content_len / 100.0).ln());
    let idf = 1.0 + (query_len / content_len).ln();
    
    tf * idf
}

pub async fn search(Json(req): Json<SearchRequest>) -> Result<Json<Vec<SearchResult>>, StatusCode> {
    let case_sensitive = req.case_sensitive.unwrap_or(false);
    let max_results = req.max_results.unwrap_or(100); // 默认最多返回100条结果
    
    // 构建正则表达式
    let pattern = if req.whole_word.unwrap_or(false) {
        format!(r"\b{}\b", &req.query)
    } else {
        req.query.clone()
    };
    
    let regex = RegexBuilder::new(&pattern)
        .case_insensitive(!case_sensitive)
        .build()
        .map_err(|_| StatusCode::BAD_REQUEST)?;
    
    let mut results = Vec::new();
    
    // 遍历 myblog/content 目录
    for entry in WalkDir::new("myblog/content")
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map_or(false, |ext| ext == "md")) {
            
        if let Ok(content) = fs::read_to_string(entry.path()) {
            // 处理文件路径
            let file_path = entry.path()
                .strip_prefix("myblog/content")
                .unwrap_or(entry.path())
                .with_extension(""); 
            
            // 构建相对URL路径
            let url_path = format!("/myblog{}", file_path.display())
                .replace("\\", "/")
                .replace("/_index", "");
            
            let lines: Vec<&str> = content.lines().collect();
            
            for (line_number, line) in lines.iter().enumerate() {
                if regex.is_match(line) {
                    // 获取上下文
                    let context_before: Vec<String> = lines
                        .iter()
                        .skip(line_number.saturating_sub(2))
                        .take(2)
                        .map(|s| s.to_string())
                        .collect();
                    
                    let context_after: Vec<String> = lines
                        .iter()
                        .skip(line_number + 1)
                        .take(2)
                        .map(|s| s.to_string())
                        .collect();
                    
                    // 高亮匹配文本
                    let mut highlights = Vec::new();
                    let mut matches_count = 0;
                    for mat in regex.find_iter(line) {
                        highlights.push((mat.start(), mat.end()));
                        matches_count += 1;
                    }
                    
                    // 计算相关性分数
                    let score = calculate_score(line, &req.query, matches_count);
                    
                    // 提取元数据
                    let mut metadata = HashMap::new();
                    if let Some(title) = extract_title(entry.path()) {
                        metadata.insert("title".to_string(), title);
                    }
                    
                    results.push(SearchResult {
                        path: url_path.clone(),
                        content: line.to_string(),
                        line_number: line_number + 1,
                        context_before,
                        context_after,
                        score,
                        highlights,
                        metadata: Some(metadata),
                    });
                }
            }
        }
    }
    
    // 按相关性分数排序
    results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap_or(std::cmp::Ordering::Equal));
    
    // 限制结果数量
    results.truncate(max_results);
    
    Ok(Json(results))
}

// 从文件中提取标题
fn extract_title(path: &std::path::Path) -> Option<String> {
    if let Ok(content) = fs::read_to_string(path) {
        for line in content.lines() {
            if line.starts_with("title = ") {
                return Some(line.trim_start_matches("title = ")
                    .trim_matches('"')
                    .to_string());
            }
        }
    }
    None
} 
```

## 超长代码块测试

这是一个非常长的代码块，包含详细的注释和多个方法：

```python
class ComplexExample:
    """这是一个复杂的示例类，用于测试代码块的滚动效果"""
    
    def __init__(self, name):
        """初始化方法"""
        self.name = name
        self.data = {}
        self.history = []
    
    def add_data(self, key, value):
        """添加数据到字典中"""
        if key in self.data:
            # 如果键已存在，保存旧值到历史记录
            self.history.append({
                'action': 'update',
                'key': key,
                'old_value': self.data[key],
                'new_value': value
            })
        else:
            # 如果是新键，记录添加操作
            self.history.append({
                'action': 'add',
                'key': key,
                'value': value
            })
        
        # 更新数据
        self.data[key] = value
        return True
    
    def get_data(self, key):
        """获取数据"""
        if key in self.data:
            return self.data[key]
        raise KeyError(f"键 '{key}' 不存在")
    
    def remove_data(self, key):
        """删除数据"""
        if key in self.data:
            # 记录删除操作
            self.history.append({
                'action': 'delete',
                'key': key,
                'value': self.data[key]
            })
            del self.data[key]
            return True
        return False
    
    def get_history(self):
        """获取操作历史"""
        return self.history
    
    def clear_history(self):
        """清空历史记录"""
        self.history = []
        return "历史记录已清空"
    
    def __str__(self):
        """字符串表示"""
        return f"ComplexExample(name='{self.name}', data_count={len(self.data)})"
```

## 不同语言的代码块测试

### JavaScript代码块

```javascript
class SimpleCalculator {
    constructor() {
        this.result = 0;
    }
    
    add(number) {
        this.result += number;
        return this;
    }
    
    subtract(number) {
        this.result -= number;
        return this;
    }
    
    getResult() {
        return this.result;
    }
}
```

### HTML代码块

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>测试页面</title>
    <style>
        .container {
            padding: 20px;
            margin: 10px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>测试标题</h1>
        <p>这是一个测试段落</p>
    </div>
</body>
</html>
```