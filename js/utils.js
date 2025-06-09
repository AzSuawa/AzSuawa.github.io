/**
 * 工具函数库
 */

// 动态加载CSS
function loadCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

// 动态加载页面CSS
function loadPageStyles(pageId) {
    // 移除之前加载的页面CSS
    const oldStyle = document.getElementById('page-style');
    if(oldStyle) oldStyle.remove();
    
    if(pageId && pageId !== 'a') { // 首页不需要额外样式
        const link = document.createElement('link');
        link.id = 'page-style';
        link.rel = 'stylesheet';
        link.href = `css/pages/${pageId}.css`;
        document.head.appendChild(link);
    }
}

// 显示首页
function showHomePage() {
    document.getElementById('a-welcome').classList.add('active');
    document.getElementById('a-group').classList.add('active');
    document.querySelector('#sidebar ul li:first-child').classList.add('active');
}

// 导出工具函数
export { loadCSS, loadPageStyles, showHomePage };
