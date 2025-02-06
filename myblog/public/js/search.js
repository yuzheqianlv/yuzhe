// 搜索服务配置 - 使用本地 Shuttle 服务
const SEARCH_API = '/api/search';  // 使用相对路径，指向本地 API

// 添加搜索缓存
const searchCache = new Map(); // 使用Map来存储搜索缓存
const CACHE_EXPIRE_TIME = 5 * 60 * 1000; // 缓存5分钟

// 防抖函数
const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// 执行搜索
async function performSearch() {
    const query = document.getElementById('search-input').value;
    const resultsDiv = document.getElementById('search-results');
    
    if (!query) {
        resultsDiv.innerHTML = '';
        return;
    }

    try {
        // 使用本地 API 端点
        const response = await fetch(SEARCH_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                case_sensitive: false,
                whole_word: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const results = await response.json();
        
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p class="no-results">没有找到相关结果</p>';
            return;
        }

        let html = '<div class="search-results-container">';
        results.forEach(result => {
            // 处理路径显示
            const displayPath = result.path
                .split('/')
                .pop()
                .replace('.md', '')
                .replace('myblog', ''); // 移除可能存在的 myblog 前缀

            // 构建正确的链接路径
            const linkPath = `/myblog/blog/${displayPath}/`.replace(/\/+/g, '/');
            
            html += `
                <div class="search-result-item">
                    <h3><a href="${linkPath}">${displayPath}</a></h3>
                    <div class="result-context">
                        ${result.context_before.map(line => `<div class="context-line">${line}</div>`).join('')}
                        <div class="matched-content">${highlightText(result.content, query)}</div>
                        ${result.context_after.map(line => `<div class="context-line">${line}</div>`).join('')}
                    </div>
                    <div class="result-meta">
                        <span class="line-number">第 ${result.line_number} 行</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        resultsDiv.innerHTML = html;
    } catch (error) {
        console.error('搜索出错:', error);
        resultsDiv.innerHTML = '<p class="search-error">搜索过程中出现错误</p>';
    }
}

// 高亮匹配文本
function highlightText(text, query) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(escapedQuery, 'gi'), match => `<mark>${match}</mark>`);
}

// 打开搜索对话框
function openSearch() {
    document.getElementById('search-dialog').style.display = 'block';
    document.getElementById('search-input').focus();
}

// 关闭搜索对话框
function closeSearch() {
    document.getElementById('search-dialog').style.display = 'none';
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // ESC 关闭搜索
    if (e.key === 'Escape') {
        closeSearch();
    }
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }
});

// 实时搜索
const debouncedSearch = debounce(performSearch, 300);
document.getElementById('search-input')?.addEventListener('input', debouncedSearch);

// 回车搜索
document.getElementById('search-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 添加搜索结果样式
const style = document.createElement('style');
style.textContent = `
.search-dialog {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    z-index: 1000;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.search-container {
    position: relative;
    max-width: 800px;
    width: 90%;
    margin: 5vh auto;
    background: var(--bg-color);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.search-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    align-items: center;
}

#search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    background: var(--bg-color);
    color: var(--text-color);
    transition: all 0.3s ease;
}

#search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.search-header button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    background: var(--primary-color);
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-header button:hover {
    background: var(--primary-color);
    opacity: 0.9;
    transform: translateY(-1px);
}

.search-header button:active {
    transform: translateY(0);
}

#search-results {
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 0.5rem;
}

#search-results::-webkit-scrollbar {
    width: 8px;
}

#search-results::-webkit-scrollbar-track {
    background: var(--bg-color);
    border-radius: 4px;
}

#search-results::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

.search-result-item {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-color);
    transition: all 0.3s ease;
}

.search-result-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.search-result-item h3 {
    margin: 0 0 0.75rem;
    font-size: 1.1rem;
}

.search-result-item a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
}

.search-result-item a:hover {
    text-decoration: underline;
}

.result-context {
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0.75rem 0;
}

.context-line {
    color: var(--secondary-color);
    padding: 0.25rem 0;
}

.matched-content {
    background: var(--hover-color);
    padding: 0.75rem;
    border-radius: 6px;
    margin: 0.5rem 0;
    border-left: 3px solid var(--primary-color);
}

mark {
    background: rgba(255, 235, 59, 0.4);
    color: inherit;
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-weight: 500;
}

.result-meta {
    font-size: 0.85rem;
    color: var(--secondary-color);
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.no-results, .search-error {
    text-align: center;
    padding: 3rem 2rem;
    color: var(--secondary-color);
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .search-container {
        width: 95%;
        margin: 2vh auto;
        padding: 1rem;
    }

    .search-header {
        flex-direction: column;
    }

    .search-header button {
        width: 100%;
    }

    #search-input {
        width: 100%;
        font-size: 16px; /* 防止 iOS 缩放 */
    }
}
`;

document.head.appendChild(style);

// 添加预加载功能
function preloadCommonSearches() {
    const commonQueries = ['rust', 'zola', 'blog']; // 常用搜索词
    commonQueries.forEach(async query => {
        try {
            const response = await fetch(SEARCH_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            });
            
            if (response.ok) {
                const results = await response.json();
                searchCache.set(query, {
                    data: results,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error('预加载搜索失败:', error);
        }
    });
}

// 页面加载完成后进行预加载
document.addEventListener('DOMContentLoaded', () => {
    // 延迟预加载，避免影响页面加载
    setTimeout(preloadCommonSearches, 2000);
}); 