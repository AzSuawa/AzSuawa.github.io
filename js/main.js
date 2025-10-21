// 菜单HTML模板
const menuHTML = `
<div class="menu-group active">
    <div class="group-header">
        <i class="fas fa-star"></i>
        <span>素素の生存服</span>
        <i class="fas fa-chevron-down toggle"></i>
    </div>
    <ul class="submenu">
        <li><a href="/ba" data-page="ba"><i class="fas fa-home"></i> 首页</a></li>
        <li><a href="/bb" data-page="bb"><i class="fas fa-list-alt"></i> 机制修改</a></li>
        <li><a href="/sp" data-page="sp"><i class="fas fa-heart"></i> 赞助列表</a></li>
        <li><a href="/ban" data-page="ban"><i class="fas fa-ban"></i> 封禁列表</a></li>
        <li><a href="/skin" data-page="skin"><i class="fas fa-star"></i> 上传皮肤</a></li>
    </ul>
</div>

<div class="menu-group active">
    <div class="group-header">
        <i class="fas fa-star"></i>
        <span>小小素BOT</span>
        <i class="fas fa-chevron-down toggle"></i>
    </div>
    <ul class="submenu">
        <li><a href="/aa" data-page="aa"><i class="fas fa-home"></i> 首页</a></li>
        <li><a href="/api" data-page="api"><i class="fas fa-solid fa-code"></i> API</a></li>
        <li><a href="/ab" data-page="ab"><i class="fas fa-star"></i> 常见问题</a></li>
        <li><a href="/ac" data-page="ac"><i class="fas fa-heart"></i> 鸣谢和赞助</a></li>
        <li><a href="/cmds" data-page="cmds"><i class="fas fa-list-alt"></i> 指令列表</a></li>
        <li><a href="/bot-update" data-page="bot-update"><i class="fas fa-book"></i> 更新日志</a></li>
        <li><a href="/mcp" data-page="mcp"><i class="fas fa-star"></i> MCPing</a></li>
    </ul>
</div>

<div class="menu-group">
    <div class="group-header">
        <i class="fas fa-star"></i>
        <span>其他</span>
        <i class="fas fa-chevron-right toggle"></i>
    </div>
    <ul class="submenu" style="display: none;">
        <li><a href="../g" data-page="g"><i class="fas fa-book"></i> 小故事</a></li>
    </ul>
</div>
`;

// 特殊页面配置（需要完整HTML结构）
const specialPages = {
    'skin': true,
    'mcp': true
};

// 菜单状态管理
let menuState = {
    expandedGroups: ['素素の生存服', '小小素BOT'] // 默认展开的菜单组
};

// 全局路由对象
let router = {
    currentPage: null,
    isLoading: false
};

// 检查是否在子页面
function isSubPage() {
    const path = window.location.pathname;
    return path !== '/' && path !== '/index.html' && !path.endsWith('.html');
}

// 获取当前页面ID
function getCurrentPageId() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'home';
    
    // 处理子目录页面
    const parts = path.split('/').filter(part => part);
    if (parts.length > 1) {
        return parts[0]; // 返回子目录名
    }
    
    // 处理根目录HTML文件
    const pageId = path.split('/')[1];
    if (pageId && pageId.endsWith('.html')) {
        return pageId.replace('.html', '');
    }
    
    return pageId || 'home';
}

// 检查是否是特殊页面
function isSpecialPage(pageId) {
    return specialPages[pageId] || false;
}

// 保存菜单状态到sessionStorage
function saveMenuState() {
    const expandedGroups = [];
    document.querySelectorAll('.menu-group.active').forEach(group => {
        const groupName = group.querySelector('.group-header span').textContent;
        expandedGroups.push(groupName);
    });
    menuState.expandedGroups = expandedGroups;
    sessionStorage.setItem('menuState', JSON.stringify(menuState));
}

// 恢复菜单状态
function restoreMenuState() {
    const savedState = sessionStorage.getItem('menuState');
    if (savedState) {
        menuState = JSON.parse(savedState);
        
        document.querySelectorAll('.menu-group').forEach(group => {
            const groupName = group.querySelector('.group-header span').textContent;
            const submenu = group.querySelector('.submenu');
            const icon = group.querySelector('.toggle');
            
            if (menuState.expandedGroups.includes(groupName)) {
                group.classList.add('active');
                if (submenu) submenu.style.display = 'block';
                if (icon) {
                    icon.classList.remove('fa-chevron-right');
                    icon.classList.add('fa-chevron-down');
                }
            } else {
                group.classList.remove('active');
                if (submenu) submenu.style.display = 'none';
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-right');
                }
            }
        });
    }
}

// 初始化菜单按钮功能
function initMenuButton() {
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            toggleSidebar();
        });
    }
}

// 切换侧边栏显示/隐藏
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (sidebar && content) {
        sidebar.classList.toggle('active');
        content.classList.toggle('shifted');
    }
}

// 确保动态内容容器存在
function ensureDynamicContentContainer() {
    let container = document.getElementById('dynamic-content');
    if (!container) {
        console.log('创建dynamic-content容器');
        container = document.createElement('div');
        container.id = 'dynamic-content';
        const mainContent = document.querySelector('#content .container') || document.querySelector('#content') || document.body;
        mainContent.appendChild(container);
    }
    return container;
}

// 初始化所有页面
function initializePage() {
    const pageId = getCurrentPageId();
    
    console.log('初始化页面，当前页面ID:', pageId);
    
    // 初始化路由对象
    window.router = router;
    
    // 设置当前页面
    router.currentPage = pageId;
    
    // 确保动态内容容器存在
    ensureDynamicContentContainer();
    
    // 初始化菜单
    initMenu();
    
    // 初始化菜单按钮
    initMenuButton();
    
    // 设置活动菜单项
    setActiveMenuItem(pageId);
    
    // 恢复菜单状态
    restoreMenuState();
    
    // 特殊页面不需要SPA路由
    if (isSpecialPage(pageId)) {
        console.log('特殊页面:', pageId);
        return;
    }
    
    // 主页面初始化SPA路由
    if (!isSubPage()) {
        initRouter(router);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// 初始化菜单
function initMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.innerHTML = menuHTML;
        
        // 添加滚动支持
        sidebar.style.overflowY = 'auto';
        sidebar.style.maxHeight = 'calc(100vh - 60px)';

        // 折叠菜单功能
        document.querySelectorAll('.group-header').forEach(header => {
            header.addEventListener('click', function() {
                const group = this.parentElement;
                const submenu = this.nextElementSibling;
                const icon = this.querySelector('.toggle');
                
                group.classList.toggle('active');
                
                if (group.classList.contains('active')) {
                    if (submenu) submenu.style.display = 'block';
                    if (icon) {
                        icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
                    }
                } else {
                    if (submenu) submenu.style.display = 'none';
                    if (icon) {
                        icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
                    }
                }
                
                saveMenuState(); // 保存菜单状态
            });
        });

        // 菜单链接点击事件
        document.querySelectorAll('#sidebar a[href^="/"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const pageId = href === '/' ? 'home' : href.substring(1);
                
                console.log('菜单点击:', { href, pageId, currentPage: router.currentPage });
                
                // 特殊页面直接跳转
                if (isSpecialPage(pageId)) {
                    console.log('特殊页面，直接跳转');
                    return true; // 允许默认行为
                }
                
                // 主页面SPA导航
                if (!isSubPage()) {
                    e.preventDefault();
                    handleSPANavigation(pageId, href);
                }
                
                // 移动端点击后自动关闭侧边栏
                if (window.innerWidth <= 1023) {
                    toggleSidebar();
                }
            });
        });
    }
}

// 处理SPA导航
function handleSPANavigation(pageId, href) {
    // 使用全局路由对象
    const currentRouter = window.router || router;
    
    if (currentRouter.currentPage === pageId || currentRouter.isLoading) {
        console.log('重复导航或正在加载:', pageId);
        return;
    }
    
    console.log('SPA导航到页面:', pageId, '当前页面:', currentRouter.currentPage);
    
    if (pageId === 'home') {
        history.pushState({ pageId: 'home' }, null, '/');
        showHomeContent();
        currentRouter.currentPage = 'home';
    } else {
        history.pushState({ pageId }, null, href);
        loadPageContent(pageId, currentRouter);
        currentRouter.currentPage = pageId;
    }
    
    setActiveMenuItem(pageId);
    saveMenuState();
}

// 设置活动菜单项
function setActiveMenuItem(pageId) {
    const menuItem = document.querySelector(`[data-page="${pageId}"]`);
    if (menuItem) {
        document.querySelectorAll('#sidebar li').forEach(item => {
            item.classList.remove('active');
        });
        menuItem.parentElement.classList.add('active');
    }
}

// 初始化路由系统（仅主页面使用）
function initRouter(router) {
    window.router = router;
    
    // 确保当前页面状态正确
    const currentPageId = getCurrentPageId();
    router.currentPage = currentPageId;
    
    console.log('初始化路由，当前页面:', currentPageId);
    
    // 处理初始路由
    handleInitialRoute(router);
    
    // 设置导航事件监听器
    setupNavigation(router);
}

function handleInitialRoute(router) {
    const path = window.location.pathname;
    const pageId = getCurrentPageId();
    
    console.log('初始路由处理:', { path, pageId });
    
    // 处理根路径
    if (path === '/' || path === '' || path === '/index.html') {
        console.log('检测到首页，显示主页内容');
        showHomeContent();
        router.currentPage = 'home';
        return;
    }
    
    // 处理其他页面路由
    if (pageId !== 'home' && !isSpecialPage(pageId)) {
        console.log('加载初始页面内容:', pageId);
        loadPageContent(pageId, router);
        router.currentPage = pageId;
    }
}

function setupNavigation(router) {
    // 处理浏览器前进/后退
    window.addEventListener('popstate', function(event) {
        let pageId;
        
        if (event.state && event.state.pageId) {
            pageId = event.state.pageId;
        } else {
            const path = window.location.pathname;
            pageId = path === '/' ? 'home' : path.substring(1);
        }
        
        console.log('popstate 事件:', pageId, '当前页面:', router.currentPage);
        
        if (router.currentPage === pageId) return;
        
        // 特殊页面直接跳转
        if (isSpecialPage(pageId)) {
            window.location.href = `/${pageId}`;
            return;
        }
        
        if (pageId === 'home') {
            showHomeContent();
            router.currentPage = 'home';
        } else {
            loadPageContent(pageId, router);
            router.currentPage = pageId;
        }
        
        setActiveMenuItem(pageId);
        restoreMenuState();
    });
}

// 显示主页内容
function showHomeContent() {
    console.log('显示主页内容');
    
    const container = ensureDynamicContentContainer();
    container.innerHTML = '';
    
    // 显示主页的默认卡片
    const defaultCards = document.querySelectorAll('.card');
    if (defaultCards.length > 0) {
        defaultCards.forEach(card => {
            card.style.display = 'block';
        });
    } else {
        // 如果没有默认卡片，显示主页内容
        container.innerHTML = `
            <div class="card active">
                <h1>欢迎来到素素の生存服</h1>
                <p>请选择左侧菜单浏览内容</p>
            </div>
        `;
    }
    
    window.scrollTo(0, 0);
}

// 加载页面内容（SPA方式）
async function loadPageContent(pageId, router) {
    if (router.isLoading) {
        console.log('正在加载中，跳过重复请求:', pageId);
        return;
    }
    
    router.isLoading = true;
    
    console.log('开始加载页面内容:', pageId);
    
    // 确保容器存在
    const container = ensureDynamicContentContainer();
    
    // 显示加载状态
    container.innerHTML = '<div class="card active"><div class="loading"><p>加载中...</p></div></div>';
    
    // 隐藏所有默认卡片
    document.querySelectorAll('.card').forEach(card => {
        card.style.display = 'none';
    });

    try {
        let targetUrl;
        
        // 所有页面都是子目录结构
        targetUrl = `/${pageId}/index.html`;
        
        console.log('正在请求:', targetUrl);
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }
        
        const html = await response.text();
        
        if (!html || html.trim().length === 0) {
            throw new Error('获取到的内容为空');
        }
        
        console.log('成功获取内容，长度:', html.length);
        
        // 提取内容部分
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 尝试不同的内容提取方式
        let contentHTML = '';
        const contentElement = tempDiv.querySelector('#content');
        if (contentElement) {
            contentHTML = contentElement.innerHTML;
        } else {
            const mainContent = tempDiv.querySelector('main') || tempDiv.querySelector('.container') || tempDiv.querySelector('.content');
            if (mainContent) {
                contentHTML = mainContent.innerHTML;
            } else {
                // 如果都找不到，使用body内容但排除脚本和样式
                const bodyContent = tempDiv.querySelector('body');
                if (bodyContent) {
                    const clone = bodyContent.cloneNode(true);
                    const scripts = clone.querySelectorAll('script, style, link, meta, title');
                    scripts.forEach(el => el.remove());
                    contentHTML = clone.innerHTML;
                } else {
                    contentHTML = html;
                }
            }
        }
        
        container.innerHTML = contentHTML;
        setActiveMenuItem(pageId);
        window.scrollTo(0, 0);
        
        console.log('页面加载完成:', pageId);
        
    } catch (err) {
        console.error('页面加载失败:', err);
        container.innerHTML = `
            <div class="card active error">
                <h1>加载失败(＞﹏＜)</h1>
                <p>错误: ${err.message}</p>
                <p>页面: ${pageId}</p>
                <div style="margin-top: 15px;">
                    <button onclick="location.reload()" style="margin: 5px; padding: 8px 16px; background: #A1BDFF; color: white; border: none; border-radius: 4px; cursor: pointer;">刷新页面</button>
                </div>
            </div>
        `;
    } finally {
        router.isLoading = false;
        console.log('加载状态重置完成');
    }
}

// 响应式处理
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if(sidebar && content && window.innerWidth > 1023) {
        sidebar.classList.remove('active');
        content.classList.remove('shifted');
    }
});