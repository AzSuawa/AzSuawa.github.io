document.addEventListener('DOMContentLoaded', function() {
    // 检查当前 URL 是否有 hash，如果没有则设置默认 hash
    if (!window.location.hash) {
        window.location.hash = '#ba';
    }
    
    // 这里应该有你现有的路由处理代码
    // 确保它能正确处理 hash 变化并加载对应内容
});


// 侧边栏菜单按钮点击事件
document.getElementById('menu-btn').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    if(window.innerWidth <= 1023) {
        sidebar.classList.toggle('active');
        content.classList.toggle('shifted');
    } else {
        sidebar.classList.toggle('desktop-hidden');
        content.classList.toggle('desktop-shifted');
    }
});

// 页面内容映射
const pageContentMap = {
    'aa': 'pages/aa.html',
    'ab': 'pages/ab.html',
    'ac': 'pages/ac.html',
    'cmds': 'pages/cmds.html',
    'ba': 'pages/ba.html',
    'bb': 'pages/bb.html',
    'g': 'pages/g.html',
    'mcp': 'mcp.html',
    'skin': 'skim.html'
};

// 折叠菜单功能
document.querySelectorAll('.group-header').forEach(header => {
    header.addEventListener('click', function() {
        const group = this.parentElement;
        const submenu = this.nextElementSibling;
        const icon = this.querySelector('.toggle');
        
        // 切换展开状态
        group.classList.toggle('active');
        
        // 动画效果
        if (group.classList.contains('active')) {
            submenu.style.display = 'block';
            icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
        } else {
            submenu.style.display = 'none';
            icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
        }
    });
});

// 阻止链接默认行为并加载内容
document.querySelectorAll('.command-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');
        
        // 隐藏所有卡片
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('active');
        });
        
        if(pageId === 'c') {
            // 加载常见问题内容
            document.getElementById('dynamic-content').innerHTML = `
                <div class="card active">
                    <h1>常见问题</h1>
                    <div class="command-section">
                        <!-- 这里放你的常见问题内容 -->
                    </div>
                </div>
            `;
        } else {
            // 加载其他页面内容
            loadPageContent(pageId); // 使用你现有的loadPageContent函数
        }
        
        // 更新URL（不刷新页面）
        history.pushState(null, null, `#${pageId}`);
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

// 侧边栏菜单项点击事件
document.querySelectorAll('#sidebar ul li a[href^="#"]').forEach(link => {
    link.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        // 更新活动菜单项
        document.querySelectorAll('#sidebar ul li').forEach(item => {
            item.classList.remove('active');
        });
        this.parentElement.classList.add('active');

        const pageId = this.getAttribute('data-page');
        
        // 隐藏所有卡片
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('active');
        });

        if(pageId === 'a') {
            // 显示首页卡片
            document.getElementById('a-0').classList.add('active');
            document.getElementById('a-1').classList.add('active');
           
document.getElementById('a-2').classList.add('active');
            document.getElementById('dynamic-content').innerHTML = '';
        } else {
            // 加载动态内容
            await loadPageContent(pageId);
        }

        // 移动端点击后自动关闭侧边栏
        if(window.innerWidth <= 1023) {
            document.getElementById('sidebar').classList.remove('active');
            document.getElementById('content').classList.remove('shifted');
        }
        
        // 更新URL
        history.replaceState(null, null, `#${pageId}`);
    });
});

async function loadPageContent(pageId) {
    const container = document.getElementById('dynamic-content');
    try {
        const response = await fetch(pageContentMap[pageId]);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        container.innerHTML = html;

        // 调试：打印加载的内容和卡片数量
        console.log('Loaded HTML:', html);
        console.log('Cards found:', container.querySelectorAll('.card').length);

        // 激活所有卡片
        const cards = container.querySelectorAll('.card');
        if (cards.length === 0) {
            console.warn('No cards found in loaded content.');
        } else {
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

// 初始化页面
window.addEventListener('DOMContentLoaded', function() {
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
});

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
    } else {
        sidebar.classList.remove('desktop-hidden');
        content.classList.remove('desktop-shifted');
    }
});
