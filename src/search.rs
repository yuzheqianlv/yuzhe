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