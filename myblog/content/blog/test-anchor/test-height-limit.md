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

```python
class LongExample:
    def __init__(self):
        self.data = []
    
    def add_item(self, item):
        # 添加一个新项目到列表
        self.data.append(item)
        return len(self.data)
    
    def process_items(self):
        # 处理所有项目
        result = []
        for item in self.data:
            # 对每个项目进行处理
            processed = item.upper() if isinstance(item, str) else str(item)
            result.append(processed)
        return result
    
    def clear_all(self):
        # 清空所有数据
        self.data = []
        return "已清空所有数据"
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