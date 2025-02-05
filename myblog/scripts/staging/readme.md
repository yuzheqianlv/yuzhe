+++
title = "暂存区"
date = 2025-02-05
description = "暂存区的详细说明"
tags = []
+++

# 暂存区

这个目录用于临时存放需要添加元数据的新文件。将新文件放置在此目录中，然后运行脚本进行批量处理。

## 使用说明

1. 将需要添加元数据的新文件放入此目录
2. 在项目根目录（yuzhe）下执行以下命令运行处理脚本：
   ```bash
   python3 myblog/scripts/add_metadata.py myblog/content/staging
   ```
3. 脚本会自动为文件添加必要的元数据
4. 处理完成后，文件会被自动移动到 content/learning 目录中

## 注意事项

- 脚本默认将处理后的文件移动到 learning 目录
- 脚本会自动排除 learning 目录下的 _index.md 文件
- 确保文件名符合Markdown格式（以.md结尾）
- 建议在运行脚本前备份重要文件