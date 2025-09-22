document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面路由
    initRouter();
    
    // 初始化菜单状态
    initMenu();
});

// 初始化路由系统
function initRouter() {
    // 处理哈希路由重定向
    if (window.location.hash && window.location.pathname === '/') {
        const cleanPath = window.location.hash.substring(1);
        history.replaceState(null, null, '/' + cleanPath);
    }
    
    // 初始化页面内容
    loadInitialPage();
}

// 初始化菜单功能
function initMenu() {
    // 菜单按钮点击事件
    document.getElementById('menu-btn').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('content');
        
        if(window.innerWidth <= 1023) {
            sidebar.classList.toggle('active');
            content.classList.toggle('shifted');
        }
    });

    // 折叠菜单功能
    document.querySelectorAll('.group-header').forEach(header => {
        header.addEventListener('click', function() {
            const group = this.parentElement;
            const submenu = this.nextElementSibling;
            const icon = this.querySelector('.toggle');
            
            group.classList.toggle('active');
            
            if (group.classList.contains('active')) {
                submenu.style.display = 'block';
                icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
            } else {
                submenu.style.display = 'none';
                icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
            }
        });
    });

    // 导航链接点击事件
    document.querySelectorAll('#sidebar a[href^="/"]').forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // 更新活动菜单项
            updateActiveMenuItem(this);
            
            const path = this.getAttribute('href');
            const pageId = path.substring(1); // 移除前导/
            
            // 更新URL
            history.pushState(null, null, path);
            await loadPageContent(pageId);
            
            // 移动端点击后自动关闭侧边栏
            if(window.innerWidth <= 1023) {
                document.getElementById('sidebar').classList.remove('active');
                document.getElementById('content').classList.remove('shifted');
            }
        });
    });

    // 处理浏览器前进/后退
    window.addEventListener('popstate', function() {
        const path = window.location.pathname;
        const pageId = path.substring(1);
        const menuItem = document.querySelector(`[data-page="${pageId}"]`);
        if(menuItem) {
            menuItem.click();
        } else {
            loadPageContent('aa'); // 默认首页
        }
    });
}

// 页面内容映射
const pageContentMap = {
    'aa': '/pages/aa.html',
    'ab': '/pages/ab.html',
    'ac': '/pages/ac.html',
    'cmds': '/pages/cmds.html',
    'ba': '/pages/ba.html',
    'bb': '/pages/bb.html',
    'ban': '/pages/ban.html',
    'g': '/pages/g.html',
    'mcp': '/mcp.html',
    'skin': '/skin.html',
    'api': '/pages/api.html',
    'sp': '/pages/sp.html',
    'ban-qwqwcllwww': '/pages/ban/qwqwcllwww.html',
    'ban-mam1145': '/pages/ban/mam1145.html',
    'ban-iuhiuhne': '/pages/ban/iuhiuhne.html',
    'ban-sudpkkkk': '/pages/ban/sudpkkkk.html'
};

// 加载初始页面
function loadInitialPage() {
    const path = window.location.pathname;
    const pageId = path.substring(1) || 'aa'; // 默认为首页
    
    const menuItem = document.querySelector(`[data-page="${pageId}"]`);
    if(menuItem) {
        menuItem.click();
    } else {
        // 处理404或回退到首页
        loadPageContent('aa');
    }
}

// 更新活动菜单项
function updateActiveMenuItem(clickedItem) {
    document.querySelectorAll('#sidebar li').forEach(item => {
        item.classList.remove('active');
    });
    clickedItem.parentElement.classList.add('active');
}

// 加载页面内容
async function loadPageContent(pageId) {
    // 隐藏所有卡片
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('active');
    });

    if(pageId === 'ba') {
        // 显示首页卡片
        document.getElementById('a-0').classList.add('active');
        document.getElementById('a-1').classList.add('active');
        document.getElementById('a-2').classList.add('active');
        document.getElementById('dynamic-content').innerHTML = '';
    } else {
        // 加载动态内容
        const container = document.getElementById('dynamic-content');
        try {
            const response = await fetch(pageContentMap[pageId]);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();
            container.innerHTML = html;

            // 激活所有卡片
            const cards = container.querySelectorAll('.card');
            if (cards.length > 0) {
                cards.forEach(card => card.classList.add('active'));
            }

            window.scrollTo(0, 0);
        } catch (err) {
            console.error('加载失败:', err);
            container.innerHTML = `
                <div class="card active error">
                    <h1>加载失败(＞﹏＜)</h1>
                    <p>${err.message}</p>
                </div>
            `;
        }
    }
}

// 响应式处理
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if(window.innerWidth > 1023) {
        sidebar.classList.remove('active');
        content.classList.remove('shifted');
    }
});
