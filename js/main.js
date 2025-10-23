const menuData = [
    {name: "素素の生存服", items: [
        {href: "/ba/", page: "home", icon: "home", text: "首页"},
        {href: "/bb/", page: "bb", icon: "list-alt", text: "机制修改"},
        {href: "/sp/", page: "sp", icon: "heart", text: "赞助列表"},
        {href: "/ban/", page: "ban", icon: "ban", text: "封禁列表"},
        {href: "/skin/", page: "skin", icon: "star", text: "上传皮肤"}
    ]},
    {name: "小小素BOT", items: [
        {href: "/aa/", page: "aa", icon: "home", text: "首页"},
        {href: "/api/", page: "api", icon: "code", text: "API"},
        {href: "/ab/", page: "ab", icon: "star", text: "常见问题"},
        {href: "/ac/", page: "ac", icon: "heart", text: "鸣谢和赞助"},
        {href: "/cmds/", page: "cmds", icon: "list-alt", text: "指令列表"},
        {href: "/bot-update/", page: "bot-update", icon: "book", text: "更新日志"},
        {href: "/mcp/", page: "mcp", icon: "star", text: "MCPing"}
    ]},
    {name: "其他", active: false, items: [
        {href: "/wikl/cape/", page: "cape", icon: "star", text: "如何兑换Minecraft披风"},
        {href: "/g/", page: "g", icon: "book", text: "测试页面"}
    ]}
];

function getMenuHTML() {
    return menuData.map(group => `
<div class="menu-group ${group.active!==false?'active':''}">
    <div class="group-header">
        <i class="fas fa-star"></i>
        <span>${group.name}</span>
        <i class="fas fa-chevron-${group.active!==false?'down':'right'} toggle"></i>
    </div>
    <ul class="submenu" ${group.active===false?'style="display:none"':''}>
        ${group.items.map(item => `
        <li><a href="${item.href}" data-page="${item.page}"><i class="fas fa-${item.icon}"></i> ${item.text}</a></li>
        `).join('')}
    </ul>
</div>`).join('');
}

const specialPages = {'skin':1,'mcp':1};
let menuState = {expandedGroups: ['素素の生存服', '小小素BOT']};
let router = {currentPage: null, isLoading: false};

const isSubPage = () => {
    const p = location.pathname;
    return p !== '/' && p !== '/index.html' && !p.endsWith('.html');
};

const getCurrentPageId = () => {
    const p = location.pathname.replace(/^\/|\/$/g, '');
    if (p === '' || p === 'index.html') return 'home';
    return p.endsWith('.html') ? p.replace('.html', '') : p;
};

const getPageIdFromHref = href => {
    if (href === '/' || href === '') return 'home';
    let path = href.replace(/^\/|\/$/g, '');
    path = path.replace(/\.html$/, '');
    return path || 'home';
};

const isSpecialPage = pageId => {
    return specialPages[pageId] || pageId.startsWith('wikl/');
};

const buildPageUrl = pageId => pageId === 'home' ? '/' : `/${pageId}/`;
const buildPageRequestUrl = pageId => {
    if (pageId === 'home') return '/index.html';
    const pathParts = pageId.split('/');
    if (pathParts.length > 1) {
        return `/${pageId}/index.html`;
    }
    return `/${pageId}/index.html`;
};

function saveMenuState() {
    const groups = [];
    document.querySelectorAll('.menu-group.active').forEach(g => {
        groups.push(g.querySelector('.group-header span').textContent);
    });
    menuState.expandedGroups = groups;
    sessionStorage.setItem('menuState', JSON.stringify(menuState));
}

function restoreMenuState() {
    const saved = sessionStorage.getItem('menuState');
    if (saved) {
        menuState = JSON.parse(saved);
        document.querySelectorAll('.menu-group').forEach(group => {
            const name = group.querySelector('.group-header span').textContent;
            const submenu = group.querySelector('.submenu');
            const icon = group.querySelector('.toggle');
            const isActive = menuState.expandedGroups.includes(name);
            
            group.classList.toggle('active', isActive);
            if (submenu) submenu.style.display = isActive ? 'block' : 'none';
            if (icon) {
                icon.className = `fas fa-chevron-${isActive?'down':'right'} toggle`;
            }
        });
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    if (sidebar && content) {
        sidebar.classList.toggle('active');
        content.classList.toggle('shifted');
    }
}

function initMenuButton() {
    const btn = document.getElementById('menu-btn');
    if (btn) btn.addEventListener('click', toggleSidebar);
}

function ensureDynamicContentContainer() {
    let c = document.getElementById('dynamic-content');
    if (!c) {
        c = document.createElement('div');
        c.id = 'dynamic-content';
        const main = document.querySelector('#content .container') || document.querySelector('#content') || document.body;
        main.appendChild(c);
    }
    return c;
}

function initMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.innerHTML = getMenuHTML();
        sidebar.style.overflowY = 'auto';
        sidebar.style.maxHeight = 'calc(100vh - 60px)';

        document.querySelectorAll('.group-header').forEach(header => {
            header.addEventListener('click', function() {
                const group = this.parentElement;
                const submenu = this.nextElementSibling;
                const icon = this.querySelector('.toggle');
                
                group.classList.toggle('active');
                const isActive = group.classList.contains('active');
                
                if (submenu) submenu.style.display = isActive ? 'block' : 'none';
                if (icon) icon.className = `fas fa-chevron-${isActive?'down':'right'} toggle`;
                
                saveMenuState();
            });
        });

        document.querySelectorAll('#sidebar a[href^="/"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const pageId = getPageIdFromHref(href);
                
                const isSpecial = Object.keys(specialPages).some(special => 
                    pageId === special || pageId.startsWith(special + '/')
                );
                
                if (isSpecial) return true;
                
                if (!isSubPage()) {
                    e.preventDefault();
                    handleSPANavigation(pageId, buildPageUrl(pageId));
                }
                
                if (window.innerWidth <= 1023) toggleSidebar();
            });
        });
    }
}

function setActiveMenuItem(pageId) {
    document.querySelectorAll('#sidebar li').forEach(item => item.classList.remove('active'));
    const item = document.querySelector(`[data-page="${pageId}"]`) || 
                 document.querySelector(`a[href="${pageId==='home'?'/':'/'+pageId+'/'}"]`);
    if (item) item.parentElement.classList.add('active');
}

function handleSPANavigation(pageId, href) {
    const r = window.router || router;
    if (r.currentPage === pageId || r.isLoading) return;
    
    console.log('SPA导航到页面:', pageId);
    
    if (pageId === 'home') {
        history.pushState({ pageId: 'home' }, null, '/');
        showHomeContent();
        r.currentPage = 'home';
    } else {
        const targetUrl = pageId.includes('/') ? `/${pageId}/` : `/${pageId}/`;
        history.pushState({ pageId }, null, targetUrl);
        loadPageContent(pageId, r);
        r.currentPage = pageId;
    }
    
    setActiveMenuItem(pageId);
    saveMenuState();
}

function showHomeContent() {
    const container = ensureDynamicContentContainer();
    container.innerHTML = '';
    
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        cards.forEach(card => card.style.display = 'block');
    } else {
        container.innerHTML = '<div class="card active"><h1>遇到BUG了？</h1><p>啊这。。。</p></div>';
    }
    
    window.scrollTo(0, 0);
}

async function loadPageContent(pageId, router) {
    if (router.isLoading) return;
    router.isLoading = true;
    
    const container = ensureDynamicContentContainer();
    container.innerHTML = '<div class="card active"><div class="loading"><p>加载中...</p></div></div>';
    
    document.querySelectorAll('.card').forEach(card => card.style.display = 'none');

    try {
        const response = await fetch(buildPageRequestUrl(pageId));
        if (!response.ok) throw new Error(`HTTP错误! 状态码: ${response.status}`);
        
        const html = await response.text();
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        let content = temp.querySelector('#content') || temp.querySelector('main') || 
                     temp.querySelector('.container') || temp.querySelector('.content');
        
        container.innerHTML = content ? content.innerHTML : html;
        setActiveMenuItem(pageId);
        window.scrollTo(0, 0);
        
    } catch (err) {
        container.innerHTML = `
            <div class="card active error">
                <h1>加载失败QAQ</h1>
                <div class="command-section">
                    <p>${err.message}</p>
                    <p>ID: ${pageId}</p>
                    <div style="margin-top:15px">
                        <button onclick="location.reload()" style="margin:5px;padding:6px 15px;background:#A1BDFF;color:white;border:none;border-radius:4px;cursor:pointer;font-size:15px">刷新</button>
                    </div>
                </div>
            </div>
        `;
    } finally {
        router.isLoading = false;
    }
}

function initRouter(router) {
    window.router = router;
    const currentPageId = getCurrentPageId();
    router.currentPage = currentPageId;
    
    if (location.pathname === '/' || location.pathname === '' || location.pathname === '/index.html') {
        showHomeContent();
        router.currentPage = 'home';
    } else if (currentPageId !== 'home' && !isSpecialPage(currentPageId)) {
        loadPageContent(currentPageId, router);
        router.currentPage = currentPageId;
    }
    
    window.addEventListener('popstate', function(e) {
        let pageId = e.state && e.state.pageId ? e.state.pageId : getCurrentPageId();
        if (router.currentPage === pageId) return;
        
        if (isSpecialPage(pageId)) {
            location.href = buildPageUrl(pageId);
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

function initializePage() {
    const pageId = getCurrentPageId();
    router.currentPage = pageId;
    
    ensureDynamicContentContainer();
    initMenu();
    initMenuButton();
    setActiveMenuItem(pageId);
    restoreMenuState();
    
    if (!isSpecialPage(pageId) && !isSubPage()) {
        initRouter(router);
    }
}

document.addEventListener('DOMContentLoaded', initializePage);
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    if(sidebar && content && window.innerWidth > 1023) {
        sidebar.classList.remove('active');
        content.classList.remove('shifted');
    }
});