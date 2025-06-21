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
    'b': 'pages/b.html',
    'c': 'pages/c.html',
    'd': 'pages/d.html',
    'e': 'pages/e.html'
};

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
            document.getElementById('a-welcome').classList.add('active');
            document.getElementById('a-group').classList.add('active');
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

// 加载页面内容
async function loadPageContent(pageId) {
    const container = document.getElementById('dynamic-content');
    
    try {
        const response = await fetch(pageContentMap[pageId]);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const html = await response.text();
        container.innerHTML = html;
        
        // 激活新加载的卡片
        document.getElementById(pageId).classList.add('active');
        
        // 滚动到顶部
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
    document.getElementById('a-welcome').classList.add('active');
    document.getElementById('a-group').classList.add('active');
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
