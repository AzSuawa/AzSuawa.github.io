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

// 侧边栏菜单项点击事件（唯一处理逻辑）
document.querySelectorAll('#sidebar ul li a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // 1. 阻止所有默认行为和冒泡
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // 2. 使用双重requestAnimationFrame确保DOM更新完成
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // 3. 更新菜单和卡片状态
                updateActiveState(this);
                toggleCards(this.getAttribute('data-page'));
                
                // 4. 强制重置滚动位置（修复自动滚动问题）
                resetScrollPosition();
                
                // 5. 移动端自动关闭侧边栏
                if(window.innerWidth <= 1023) {
                    document.getElementById('sidebar').classList.remove('active');
                    document.getElementById('content').classList.remove('shifted');
                }
                
                // 6. 安全更新URL（不触发滚动）
                history.replaceState(null, null, `#${this.getAttribute('data-page')}`);
            });
        });
    });
});

// 辅助函数
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
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
}

// 初始化页面
window.addEventListener('DOMContentLoaded', function() {
    if(window.location.hash) {
        const menuItem = document.querySelector(`#sidebar a[data-page="${window.location.hash.substring(1)}"]`);
        menuItem?.click(); // 存在hash则模拟点击
    } else {
        // 默认显示首页
        document.getElementById('a-welcome').classList.add('active');
        document.getElementById('a-group').classList.add('active');
        document.querySelector('#sidebar ul li:first-child').classList.add('active');
    }
});

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
