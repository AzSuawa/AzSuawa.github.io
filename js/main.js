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

// 侧边栏菜单项点击事件
document.querySelectorAll('#sidebar ul li a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 阻止默认行为后立即停止事件传播
        e.stopImmediatePropagation();
        
        // 使用requestAnimationFrame确保在下一帧执行
        requestAnimationFrame(() => {
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
                document.getElementById('a-welcome').classList.add('active');
                document.getElementById('a-group').classList.add('active');
            } else {
                document.getElementById(pageId).classList.add('active');
            }

            // 强制重置滚动位置
            window.scrollTo(0, 0);
            
            // 移动端点击后自动关闭侧边栏
            if(window.innerWidth <= 1023) {
                document.getElementById('sidebar').classList.remove('active');
                document.getElementById('content').classList.remove('shifted');
            }
            
            // 更新URL但不触发滚动
            history.replaceState(null, null, `#${pageId}`);
        });
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