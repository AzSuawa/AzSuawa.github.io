// 页面元数据配置
const pageMetaData = {
    'aa': {
        title: '阿素本素(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '素素の生存服'
    },
    'api': {
        title: '小小素BOT - API',
        description: 'Minecraft服务器Motd查询、2b2t.org数据图片查询',
        headerTitle: '小小素API'
    },
    'bot-update': {
        title: '小小素BOT - 更新日志',
        description: '小小素BOT的版本更新历史记录',
        headerTitle: '小小素更新日志'
    },
    'skin': {
        title: '上传皮肤到服务器 - 素素の生存服(p≧w≦q)',
        description: '上传皮肤到服务器 - 素素の生存服(p≧w≦q)、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '素素の生存服'
    },
    'mcp': {
        title: 'Minecraft服务器状态查询API - 阿素本素(p≧w≦q)',
        description: 'Minecraft服务器状态查询API - 素素の生存服(p≧w≦q)、Motd、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '小小素API'
    },
    'default': {
        title: '阿素本素(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '素素の生存服'
    }
};

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
    'bot-update': '/pages/bot-update.html',
    'ban-qwqwcllwww': '/pages/ban/qwqwcllwww.html',
    'ban-mam1145': '/pages/ban/mam1145.html',
    'ban-iuhiuhne': '/pages/ban/iuhiuhne.html',
    'ban-sudpkkkk': '/pages/ban/sudpkkkk.html'
};

document.addEventListener('DOMContentLoaded', function() {
    // 路由状态管理
    const router = {
        currentPage: null,
        isLoading: false
    };

    // 初始化路由系统
    initRouter(router);
    
    // 初始化菜单状态
    initMenu(router);
});

// 初始化路由系统
function initRouter(router) {
    // 处理初始路由
    handleInitialRoute(router);
    
    // 设置导航事件监听器
    setupNavigation(router);
}

function handleInitialRoute(router) {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // 处理哈希路由重定向（仅当路径为根路径时）
    if (hash && path === '/') {
        const cleanPath = hash.substring(1);
        if (pageContentMap[cleanPath]) {
            history.replaceState({ pageId: cleanPath }, null, '/' + cleanPath);
            updatePageMeta(cleanPath);
            loadPageContent(cleanPath, router);
            return;
        }
    }
    
    // 处理干净路径
    const pageId = path.substring(1) || 'api'; // 默认为api页面
    if (pageContentMap[pageId]) {
        updatePageMeta(pageId);
        loadPageContent(pageId, router);
    } else {
        // 无效路径重定向到api页面
        history.replaceState({ pageId: 'api' }, null, '/api');
        updatePageMeta('api');
        loadPageContent('api', router);
    }
}

function setupNavigation(router) {
    // 导航链接点击事件
    document.querySelectorAll('#sidebar a[href^="/"]').forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const path = this.getAttribute('href');
            const pageId = path.substring(1);
            
            // 避免重复加载相同页面
            if (router.currentPage === pageId || router.isLoading) return;
            
            // 更新活动菜单项
            updateActiveMenuItem(this);
            
            // 更新URL
            history.pushState({ pageId }, null, path);
            updatePageMeta(pageId);
            await loadPageContent(pageId, router);
            
            // 更新当前页面标记
            router.currentPage = pageId;
            
            // 移动端点击后自动关闭侧边栏
            if(window.innerWidth <= 1023) {
                document.getElementById('sidebar').classList.remove('active');
                document.getElementById('content').classList.remove('shifted');
            }
        });
    });

    // 处理浏览器前进/后退
    window.addEventListener('popstate', function(event) {
        let pageId;
        
        if (event.state && event.state.pageId) {
            pageId = event.state.pageId;
        } else {
            const path = window.location.pathname;
            pageId = path.substring(1) || 'api';
        }
        
        // 避免重复加载相同页面
        if (router.currentPage === pageId) return;
        
        const menuItem = document.querySelector(`[data-page="${pageId}"]`);
        if(menuItem) {
            updateActiveMenuItem(menuItem);
            updatePageMeta(pageId);
            loadPageContent(pageId, router);
            router.currentPage = pageId;
        } else {
            updatePageMeta('api');
            loadPageContent('api', router);
            router.currentPage = 'api';
        }
    });
}

// 初始化菜单功能
function initMenu(router) {
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

// 更新活动菜单项
function updateActiveMenuItem(clickedItem) {
    document.querySelectorAll('#sidebar li').forEach(item => {
        item.classList.remove('active');
    });
    clickedItem.parentElement.classList.add('active');
}

// 更新页面元数据
function updatePageMeta(pageId) {
    const metaData = pageMetaData[pageId] || pageMetaData['default'];
    
    // 更新title
    document.title = metaData.title;
    
    // 更新meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = metaData.description;
    
    // 更新header标题
    const headerTitle = document.getElementById('title');
    if (headerTitle) {
        headerTitle.textContent = metaData.headerTitle;
    }
}

// 加载页面内容
async function loadPageContent(pageId, router) {
    // 设置加载状态
    router.isLoading = true;
    
    // 隐藏所有卡片
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('active');
    });

    const container = document.getElementById('dynamic-content');
    
    // 移除了a-0, a-1, a-2的显示逻辑
    // 所有页面都通过AJAX加载内容
    
    try {
        const response = await fetch(pageContentMap[pageId]);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
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
                <button onclick="location.reload()">刷新页面</button>
            </div>
        `;
    } finally {
        router.isLoading = false;
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
