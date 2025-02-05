# Zola 博客 + Shuttle 服务

这是一个基于 Rust Shuttle 和 Zola 静态站点生成器的个人博客项目。项目包含一个主页和一个完整的博客系统。主页展示个人信息，博客系统支持文章发布、图片管理、标签分类等功能。

## 在线预览

- 主页：[https://qianlvzhe-kdld.shuttle.app](https://qianlvzhe-kdld.shuttle.app)
- 博客：[https://qianlvzhe-kdld.shuttle.app/myblog](https://qianlvzhe-kdld.shuttle.app/myblog)

## 项目结构

```
.
├── assets/                 # Shuttle 主页静态资源
│   ├── index.html         # 主页 HTML
│   ├── style.css          # 主页样式
│   ├── script.js          # 主页脚本
│   └── favicon.ico        # 网站图标
├── myblog/                # Zola 博客项目
│   ├── config.toml        # Zola 配置文件
│   ├── content/           # 博客内容
│   ├── static/            # 静态资源
│   ├── templates/         # 模板文件
│   └── public/            # 构建输出目录
├── src/                   # Rust 源代码
│   ├── main.rs           # 主程序入口
│   └── search.rs         # 搜索功能模块
├── Cargo.toml            # Rust 项目配置
└── Shuttle.toml          # Shuttle 配置
```

## 功能特点

- 🌙 支持深色/浅色主题切换
- 🔍 全文搜索功能
- 📱 响应式设计
- 🚀 基于 Rust 的高性能服务
- 📝 Markdown 支持
- 🏷️ 标签分类系统
- 📊 SEO 优化
- 🖼️ 图片画廊功能
- 🔗 友情链接支持
- 📂 文章分类管理

## 开发环境设置

1. 安装必要工具：
```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 Zola
brew install zola  # macOS
# 或
sudo apt install zola  # Ubuntu

# 安装 Shuttle CLI
cargo install cargo-shuttle
```

2. 克隆项目：
```bash
git clone <repository-url>
cd <project-name>
```

3. 本地开发：
```bash
# 启动 Shuttle 服务
cargo shuttle run

# 在另一个终端构建 Zola 博客
cd myblog
zola build --base-url /myblog
```

## 写作新文章

1. 创建新文章：
```bash
cd myblog/content/blog
touch my-new-post.md
```

2. 文章格式：
```markdown
+++
title = "文章标题"
date = 2024-01-01
[taxonomies]
tags = ["标签1", "标签2"]
+++

文章内容...
```

## 部署

1. 部署到 Shuttle：
```bash
cargo shuttle deploy
```

2. 更新博客内容：
```bash
cd myblog
zola build --base-url /myblog
cd ..
cargo shuttle deploy
```

## 自定义主题

1. 修改颜色主题：
编辑 `assets/style.css` 中的 CSS 变量：
```css
:root[data-theme="light"] {
    --primary-color: #42b983;
    /* 其他颜色变量... */
}
```

2. 修改博客模板：
编辑 `myblog/templates/` 目录下的模板文件。

## 搜索功能

项目使用自定义的 Rust 搜索实现，支持：
- 全文搜索
- 实时搜索结果
- 搜索结果高亮
- 上下文显示

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- GitHub: [yuzheqianlv](https://github.com/yuzheqianlv)
- Email: yuzheqianlv@protonmail.com

## 致谢

- [Shuttle](https://shuttle.rs)
- [Zola](https://www.getzola.org)
- [Axum](https://github.com/tokio-rs/axum)

