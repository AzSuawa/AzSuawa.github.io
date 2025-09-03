// 页面CSS映射
const pageCssMap = {
    'mcp': 'css/mcp.css',
    'skin': 'css/skin.css'
};

// 当前加载的CSS文件
let currentLoadedCss = null;

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面hash
    if (!window.location.hash) {
        window.location.hash = '#ba';
    }
    
    // 初始化菜单状态
    initMenu();
    
    // 初始化页面内容
    initPageContent();
});

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
}

// 页面内容映射
const pageContentMap = {
    'aa': 'pages/aa.html',
    'ab': 'pages/ab.html',
    'ac': 'pages/ac.html',
    'cmds': 'pages/cmds.html',
    'ba': 'pages/ba.html',
    'bb': 'pages/bb.html',
    'ban': 'pages/ban.html',
    'g': 'pages/g.html',
    'mcp': 'pages/mcp.html',
    'skin': 'pages/skin.html',
    'api': 'pages/api.html',
    'sp': 'pages/sp.html',
    'ban-qwqwcllwww': 'pages/ban/qwqwcllwww.html',
    'ban-mam1145': 'pages/ban/mam1145.html',
    'ban-iuhiuhne': 'pages/ban/iuhiuhne.html',
    'ban-sudpkkkk': 'pages/ban/sudpkkkk.html'
};

// 动态加载CSS文件
function loadCssForPage(pageId) {
    // 移除之前加载的CSS
    if (currentLoadedCss) {
        document.head.removeChild(currentLoadedCss);
        currentLoadedCss = null;
    }
    
    // 检查是否需要加载新的CSS
    if (pageCssMap[pageId]) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = pageCssMap[pageId];
        link.id = 'dynamic-css';
        document.head.appendChild(link);
        currentLoadedCss = link;
    }
}

// 初始化页面内容功能
function initPageContent() {
    // 侧边栏菜单项点击事件
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', async function(e) {
            // 处理外部链接
            if (this.getAttribute('href').startsWith('http') || 
                this.getAttribute('href').startsWith('./') || 
                this.getAttribute('href').startsWith('/')) {
                return;
            }
            
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // 更新活动菜单项
            updateActiveMenuItem(this);
            
            const pageId = this.getAttribute('data-page');
            await loadPageContent(pageId);
            
            // 移动端点击后自动关闭侧边栏
            if(window.innerWidth <= 1023) {
                document.getElementById('sidebar').classList.remove('active');
                document.getElementById('content').classList.remove('shifted');
            }
            
            // 更新URL
            history.replaceState(null, null, `#${pageId}`);
        });
    });

    // 处理浏览器前进/后退
    window.addEventListener('popstate', function() {
        if(window.location.hash) {
            const pageId = window.location.hash.substring(1);
            const menuItem = document.querySelector(`[data-page="${pageId}"]`);
            if(menuItem) menuItem.click();
        }
    });

    // 初始化显示正确页面
    if(window.location.hash) {
        const pageId = window.location.hash.substring(1);
        const menuItem = document.querySelector(`#sidebar a[data-page="${pageId}"]`);
        if(menuItem) {
            menuItem.click();
        } else {
            showHomePage();
        }
    } else {
        showHomePage();
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
    // 加载对应CSS
    loadCssForPage(pageId);
    
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

            // 特殊处理mcp页面的自动ping
            if (pageId === 'mcp') {
                const submitBtn = container.querySelector('#submit-btn');
                if (submitBtn) {
                    submitBtn.click();
                }
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

// 显示首页
function showHomePage() {
    document.getElementById('a-0').classList.add('active');
    document.getElementById('a-1').classList.add('active');
    document.getElementById('a-2').classList.add('active');
    document.querySelector('#sidebar ul li:first-child').classList.add('active');
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
