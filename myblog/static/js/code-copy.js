document.addEventListener('DOMContentLoaded', () => {
    // 为所有代码块添加复制按钮
    document.querySelectorAll('pre').forEach(pre => {
        // 创建工具栏
        const toolbar = document.createElement('div');
        toolbar.className = 'code-toolbar';

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '复制代码';

        // 添加点击事件
        copyButton.addEventListener('click', async () => {
            const code = pre.querySelector('code').textContent;
            try {
                await navigator.clipboard.writeText(code);
                const originalText = copyButton.textContent;
                copyButton.textContent = '复制成功！';
                copyButton.style.backgroundColor = 'var(--primary-color)';
                copyButton.style.color = 'white';

                // 2秒后恢复原样
                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.style.backgroundColor = '';
                    copyButton.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                copyButton.textContent = '复制失败';
                setTimeout(() => {
                    copyButton.textContent = '复制代码';
                }, 2000);
            }
        });

        // 将按钮添加到工具栏
        toolbar.appendChild(copyButton);
        // 将工具栏添加到代码块
        pre.appendChild(toolbar);
    });
});