+++
title = "代码块展示测试"
description = "测试不同编程语言的代码块展示效果"
date = 2024-01-01

[taxonomies]
tags = ["测试", "代码"]
+++

# 代码块展示测试

这篇文章用于测试不同编程语言的代码块展示效果，包括语法高亮、行号显示等功能。

## 单行代码

这是一个简单的 Python 代码：`print("Hello, World!")`

## 多行代码块

### Python 示例

```python
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 测试函数
for i in range(10):
    print(f"fibonacci({i}) = {fibonacci(i)}")
```

### Rust 示例

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    // 使用迭代器和闭包
    let doubled: Vec<i32> = numbers
        .iter()
        .map(|x| x * 2)
        .collect();
    
    println!("原始数组: {:?}", numbers);
    println!("加倍后: {:?}", doubled);
}
```

### JavaScript 示例

```javascript
// 异步函数示例
async function fetchUserData(userId) {
    try {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取用户数据失败:', error);
        throw error;
    }
}

// 使用 Promise 链式调用
fetchUserData(123)
    .then(user => console.log('用户数据:', user))
    .catch(error => console.error('错误:', error));
```

### HTML/CSS 示例

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>样式测试</title>
    <style>
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
        }
        
        .card {
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Hello, World!</h1>
        </div>
    </div>
</body>
</html>
```

## 特殊语法

### 长行测试

```python
# 这是一个非常长的字符串，用于测试代码块的横向滚动效果
long_string = "这是一个非常长的字符串，包含了很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多字符"
```

### 注释和高亮

```rust
// 这是一个单行注释

/* 
这是一个
多行注释
*/

fn main() {
    // 高亮关键字
    let mut count = 0;
    const MAX_COUNT: i32 = 10;
    
    while count < MAX_COUNT {
        if count % 2 == 0 {
            println!("偶数: {}", count);
        }
        count += 1;
    }
}
```

## 总结

通过以上示例，我们测试了：

1. 不同编程语言的语法高亮
2. 行号显示功能
3. 长行的横向滚动
4. 注释的显示效果
5. 代码块的样式和间距