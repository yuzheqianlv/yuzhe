// 主题切换功能
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// 初始化主题
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
});

// 绑定主题切换按钮
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// 侧边栏控制
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const body = document.body;

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('sidebar-open');
    }

    // 点击按钮切换侧边栏
    sidebarToggle.addEventListener('click', toggleSidebar);

    // 点击遮罩层关闭侧边栏
    overlay.addEventListener('click', toggleSidebar);

    // 监听 ESC 键关闭侧边栏
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // 监听滑动手势
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) < swipeThreshold) return;

        if (diff > 0 && !sidebar.classList.contains('active')) {
            // 向右滑动，打开侧边栏
            toggleSidebar();
        } else if (diff < 0 && sidebar.classList.contains('active')) {
            // 向左滑动，关闭侧边栏
            toggleSidebar();
        }
    }
}); 