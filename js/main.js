// 页面元数据配置
const pageMetaData = {
    'aa': {
        title: '小小素(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '小小素BOT'
    },
    'ab': {
        title: '常见问题 - 小小素(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '常见问题'
    },
    'ac': {
        title: '鸣谢和赞助 - 小小素(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '鸣谢和赞助'
    },
    'cmds': {
        title: '指令帮助 - 小小素(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '指令帮助'
    },
    'api': {
        title: '小小素API - 小小素(p≧w≦q)',
        description: 'Minecraft服务器Motd查询、2b2t.org数据图片查询',
        headerTitle: '小小素API'
    },
    'bot-update': {
        title: '更新日志 - 小小素(p≧w≦q)',
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
    'ba': {
        title: '素素の生存服 - 阿素本素(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '素素の生存服'
    },
    'bb': {
        title: '机制修改 - 素素の生存服(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '机制修改'
    },
    'ban': {
        title: '封禁列表 - 素素の生存服(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '封禁列表'
    },
    'sp': {
        title: '赞助列表 - 素素の生存服(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '赞助列表'
    },
    'g': {
        title: '小故事 - 阿素本素(p≧w≦q)',
        description: '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块',
        headerTitle: '小故事'
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

// 检测是否静态页面
function isStaticPage() {
    const ssrData = document.getElementById('ssr-data');
    return ssrData && JSON.parse(ssrData.textContent).isStatic;
}

// 获取当前静态页面ID
function getStaticPageId() {
    const ssrData = document.getElementById('ssr-data');
    return ssrData ? JSON.parse(ssrData.textContent).pageId : null;
}

// 检测是否为搜索引擎爬虫
function isSearchEngineBot() {
    const userAgent = navigator.userAgent.toLowerCase();
    const bots = [
        'googlebot', 'bingbot', 'baiduspider', 'yandexbot', 
        'duckduckbot', 'slurp', 'exabot', 'facebot', 'ia_archiver'
    ];
    return bots.some(bot => userAgent.includes(bot));
}

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
    
    // 如果是搜索引擎爬虫且是静态页面，直接显示静态内容
    if (isSearchEngineBot() && isStaticPage()) {
        const staticPageId = getStaticPageId();
        router.currentPage = staticPageId;
        console.log('搜索引擎访问静态页面:', staticPageId);
        return;
    }
    
    // 处理哈希路由重定向（仅当路径为根路径时）
    if (hash && path === '/') {
        const cleanPath = hash.substring(1);
        if (pageContentMap[cleanPath]) {
            history.replaceState({ pageId: cleanPath, isSPA: true }, null, '/' + cleanPath);
            updatePageMeta(cleanPath);
            loadPageContent(cleanPath, router);
            return;
        }
    }
    
    // 处理静态页面
    if (isStaticPage()) {
        const staticPageId = getStaticPageId();
        router.currentPage = staticPageId;
        
        // 如果是静态页面但URL不匹配，重定向到正确URL
        const currentPath = path.substring(1) || 'api';
        if (currentPath !== staticPageId) {
            history.replaceState({ pageId: staticPageId, isStatic: true }, null, '/' + staticPageId);
        }
        
        // 显示静态内容
        showStaticContent(staticPageId);
        return;
    }
    
    // 处理SPA路由
    const pageId = path.substring(1) || 'api';
    if (pageContentMap[pageId]) {
        updatePageMeta(pageId);
        loadPageContent(pageId, router);
    } else {
        // 无效路径重定向到api页面
        history.replaceState({ pageId: 'api', isSPA: true }, null, '/api');
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
            
            // 更新URL和元数据
            history.pushState({ pageId, isSPA: true }, null, path);
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
        let isSPA = false;
        
        if (event.state) {
            pageId = event.state.pageId;
            isSPA = event.state.isSPA;
        } else {
            const path = window.location.pathname;
            pageId = path.substring(1) || 'api';
            isSPA = true;
        }
        
        // 避免重复加载相同页面
        if (router.currentPage === pageId) return;
        
        // 如果是静态页面访问，显示静态内容
        if (!isSPA && isStaticPage() && getStaticPageId() === pageId) {
            showStaticContent(pageId);
            router.currentPage = pageId;
            return;
        }
        
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

// 显示静态内容
function showStaticContent(pageId) {
    const staticContent = document.getElementById('static-content');
    const dynamicContent = document.getElementById('dynamic-content');
    
    if (staticContent) {
        staticContent.style.display = 'block';
        if (dynamicContent) {
            dynamicContent.style.display = 'none';
        }
        
        // 激活静态内容中的卡片
        const cards = staticContent.querySelectorAll('.card');
        cards.forEach(card => card.classList.add('active'));
        
        // 更新菜单激活状态
        updateMenuActiveState(pageId);
    }
    
    window.scrollTo(0, 0);
}

// 更新菜单激活状态
function updateMenuActiveState(pageId) {
    document.querySelectorAll('#sidebar li').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`[data-page="${pageId}"]`);
    if (activeItem) {
        activeItem.parentElement.classList.add('active');
    }
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
    
    const staticContent = document.getElementById('static-content');
    const dynamicContent = document.getElementById('dynamic-content');
    
    try {
        // 隐藏静态内容，显示动态内容
        if (staticContent) {
            staticContent.style.display = 'none';
        }
        if (dynamicContent) {
            dynamicContent.style.display = 'block';
        }
        
        // 动态加载内容
        const response = await fetch(pageContentMap[pageId]);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        
        if (dynamicContent) {
            dynamicContent.innerHTML = html;
            
            // 激活所有卡片
            const cards = dynamicContent.querySelectorAll('.card');
            if (cards.length > 0) {
                cards.forEach(card => card.classList.add('active'));
            }
        }

        window.scrollTo(0, 0);
    } catch (err) {
        console.error('加载失败:', err);
        if (dynamicContent) {
            dynamicContent.innerHTML = `
                <div class="card active error">
                    <h1>加载失败(＞﹏＜)</h1>
                    <p>${err.message}</p>
                    <button onclick="location.reload()">刷新页面</button>
                </div>
            `;
        }
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

// 页面可见性变化处理（SEO优化）
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && isSearchEngineBot()) {
        // 搜索引擎爬虫重新激活页面时，确保显示正确内容
        const currentPage = router?.currentPage || getStaticPageId();
        if (currentPage) {
            updatePageMeta(currentPage);
        }
    }
});