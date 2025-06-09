// 侧边栏菜单按钮点击事件
document.getElementById('menu-btn').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    if(window.innerWidth <= 1023) {
        // 移动端：切换侧边栏显示
        sidebar.classList.toggle('active');
        content.classList.toggle('shifted');
    } else {
        // 桌面端：切换侧边栏隐藏
        sidebar.classList.toggle('desktop-hidden');
        content.classList.toggle('desktop-shifted');
    }
});

// 侧边栏菜单项点击事件 - 稳定版本
document.querySelectorAll('#sidebar ul li a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // 彻底阻止所有默认行为和冒泡
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // 使用双重requestAnimationFrame确保在渲染周期后执行
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // 更新UI状态
                updateActiveState(this);
                
                // 切换卡片显示
                toggleCards(this.getAttribute('data-page'));
                
                // 确保滚动位置重置
                resetScrollPosition();
                
                // 处理移动端侧边栏
                handleMobileSidebar();
                
                // 安全更新URL
                updateUrlHash(this.getAttribute('data-page'));
            });
        });
    });
});

// 提取的独立函数
function updateActiveState(clickedElement) {
    document.querySelectorAll('#sidebar ul li').forEach(item => {
        item.classList.remove('active');
    });
    clickedElement.parentElement.classList.add('active');
}

function toggleCards(pageId) {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('active');
    });
    
    if(pageId === 'a') {
        document.getElementById('a-welcome').classList.add('active');
        document.getElementById('a-group').classList.add('active');
    } else {
        document.getElementById(pageId).classList.add('active');
    }
}

function resetScrollPosition() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function handleMobileSidebar() {
    if(window.innerWidth <= 1023) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('content').classList.remove('shifted');
    }
}

function updateUrlHash(pageId) {
    if(history.replaceState) {
        history.replaceState(null, null, `#${pageId}`);
    } else {
        window.location.hash = `#${pageId}`;
    }
}

        
        
        // 更新菜单激活状态
        document.querySelectorAll('#sidebar ul li').forEach(item => {
            item.classList.remove('active');
        });
        this.parentElement.classList.add('active');

        // 隐藏所有卡片
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('active');
        });

        // 显示目标页面卡片
        const pageId = this.getAttribute('data-page');
        if(pageId === 'a') {
            // 首页特殊处理：显示两个卡片
            document.getElementById('a-welcome').classList.add('active');
            document.getElementById('a-group').classList.add('active');
        } else {
            // 其他页面：显示对应卡片
            document.getElementById(pageId).classList.add('active');
        }

        // 移动端点击后自动关闭侧边栏
        if(window.innerWidth <= 1023) {
            document.getElementById('sidebar').classList.remove('active');
            document.getElementById('content').classList.remove('shifted');
        }
        
        // 更新URL hash（不影响页面跳转）
        window.location.hash = pageId;
    });
});

// 页面加载时根据hash显示对应内容
window.addEventListener('DOMContentLoaded', function() {
    if(window.location.hash) {
        const pageId = window.location.hash.substring(1);
        const menuItem = document.querySelector(`#sidebar a[data-page="${pageId}"]`);
        if(menuItem) {
            // 模拟点击对应的菜单项
            menuItem.click();
        } else {
            // 默认显示首页
            showHomePage();
        }
    } else {
        // 无hash时默认显示首页
        showHomePage();
    }
});

// 窗口大小变化时的响应式处理
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if(window.innerWidth > 1023) {
        // 桌面端：确保侧边栏正常显示
        sidebar.classList.remove('active');
        content.classList.remove('shifted');
    } else {
        // 移动端：确保侧边栏初始状态正确
        sidebar.classList.remove('desktop-hidden');
        content.classList.remove('desktop-shifted');
    }
});

// 显示首页的函数
function showHomePage() {
    document.getElementById('a-welcome').classList.add('active');
    document.getElementById('a-group').classList.add('active');
    document.querySelector('#sidebar ul li:first-child').classList.add('active');
}
