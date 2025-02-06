// 引入highlight.js库
document.write('<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build/highlight.min.js"></script>');

// 在页面加载完成后初始化代码高亮
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有代码块的高亮
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightBlock(block);
    });

    // 为每个代码块添加行号
    document.querySelectorAll('pre code').forEach(block => {
        const lines = block.innerHTML.split('\n');
        const numberedLines = lines.map((line, index) => 
            `<span class="line">${line}</span>`
        ).join('\n');
        block.innerHTML = numberedLines;
    });
});