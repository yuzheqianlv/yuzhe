mod search;

use axum::{
    routing::post,
    Router,
    http::{Method, HeaderName, HeaderValue},
};
use tower_http::{services::ServeDir, cors::CorsLayer, services::ServeFile};
use search::search;
use std::fs;

#[shuttle_runtime::main]
async fn main() -> shuttle_axum::ShuttleAxum {
    // 检查目录是否存在
    if let Ok(entries) = fs::read_dir("myblog/public") {
        println!("myblog/public 目录内容：");
        for entry in entries {
            if let Ok(entry) = entry {
                println!("- {:?}", entry.path());
            }
        }
    } else {
        println!("警告：myblog/public 目录不存在！");
    }

    let cors = CorsLayer::new()
        .allow_origin("*".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST])
        .allow_headers([HeaderName::from_static("content-type")])
        .allow_credentials(false);

    let blog_service = ServeDir::new("myblog/public")
        .append_index_html_on_directories(true);

    let assets_service = ServeDir::new("assets")
        .not_found_service(ServeFile::new("assets/index.html"));

    let router = Router::new()
        .route("/api/search", post(search))
        .nest_service("/", assets_service)
        .nest_service("/myblog", blog_service)
        .layer(cors);

    println!("服务器配置完成，等待请求...");

    Ok(router.into())
}
