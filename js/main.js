// 页面内容映射
const pageContentMap = {
    'aa': 'pages/aa.html',
    'ab': 'pages/ab.html',
    'ac': 'pages/ac.html',
    'cmds': 'pages/cmds.html',
    'ba': 'pages/ba.html',
    'bb': 'pages/bb.html',
    'ban': 'pages/ban.html',
    'g': 'pages/g.html',
    'mcp': 'pages/mcp.html',
    'skin': 'pages/skin.html',
    'api': 'pages/api.html',
    'sp': 'pages/sp.html',
    'ban-qwqwcllwww': 'pages/ban/qwqwcllwww.html',
    'ban-mam1145': 'pages/ban/mam1145.html',
    'ban-iuhiuhne': 'pages/ban/iuhiuhne.html',
    'ban-sudpkkkk': 'pages/ban/sudpkkkk.html'
};

// 页面CSS映射
const pageCssMap = {
    'mcp': 'css/mcp.css',
    'skin': 'css/skin.css'
};

// 当前加载的CSS文件
let currentLoadedCss = null;

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面hash
    if (!window.location.hash) {
        window.location.hash = '#ba';
    }
    
    // 初始化菜单状态
    initMenu();
    
    // 初始化页面内容
    initPageContent();
});

// 初始化菜单功能
function initMenu() {
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

// 动态加载CSS文件
function loadCssForPage(pageId) {
    // 移除之前加载的CSS
    if (currentLoadedCss) {
        document.head.removeChild(currentLoadedCss);
        currentLoadedCss = null;
    }
    
    // 检查是否需要加载新的CSS
    if (pageCssMap[pageId]) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = pageCssMap[pageId];
        link.id = 'dynamic-css';
        document.head.appendChild(link);
        currentLoadedCss = link;
    }
}

// 初始化页面内容功能
function initPageContent() {
    // 侧边栏菜单项点击事件
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', async function(e) {
            // 处理外部链接
            if (this.getAttribute('href').startsWith('http') || 
                this.getAttribute('href').startsWith('./') || 
                this.getAttribute('href').startsWith('/')) {
                return;
            }
            
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // 更新活动菜单项
            updateActiveMenuItem(this);
            
            const pageId = this.getAttribute('data-page');
            await loadPageContent(pageId);
            
            // 移动端点击后自动关闭侧边栏
            if(window.innerWidth <= 1023) {
                document.getElementById('sidebar').classList.remove('active');
                document.getElementById('content').classList.remove('shifted');
            }
            
            // 更新URL
            history.replaceState(null, null, `#${pageId}`);
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

    // 初始化显示正确页面
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
}

// 更新活动菜单项
function updateActiveMenuItem(clickedItem) {
    document.querySelectorAll('#sidebar li').forEach(item => {
        item.classList.remove('active');
    });
    clickedItem.parentElement.classList.add('active');
}

// 加载页面内容
async function loadPageContent(pageId) {
    // 加载对应CSS
    loadCssForPage(pageId);
    
    // 隐藏所有卡片
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('active');
    });

    if(pageId === 'ba') {
        // 显示首页卡片
        document.getElementById('a-0').classList.add('active');
        document.getElementById('a-1').classList.add('active');
        document.getElementById('a-2').classList.add('active');
        document.getElementById('dynamic-content').innerHTML = '';
    } else {
        // 加载动态内容
        const container = document.getElementById('dynamic-content');
        try {
            const response = await fetch(pageContentMap[pageId]);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();
            container.innerHTML = html;

            // 特殊页面初始化
            if (pageId === 'mcp') {
                initMcpPage();
            } else if (pageId === 'skin') {
                initSkinPage();
            }

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
                </div>
            `;
        }
    }
}

// MCP页面初始化
function initMcpPage() {
    const submitBtn = document.querySelector('#submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const ip = document.getElementById('ip').value.trim();
            const watermark = document.getElementById('watermark').value.trim();
            const resultDiv = document.getElementById('result');
            const errorDiv = document.getElementById('error');
            const loadingDiv = document.querySelector('.loading');

            if (!ip) {
                errorDiv.textContent = '请输入服务器地址';
                return;
            }

            resultDiv.innerHTML = '';
            errorDiv.textContent = '';
            loadingDiv.style.display = 'block';

            let apiUrl = `https://api.azsu.top/mcping/image?ip=${encodeURIComponent(ip)}&t=${Date.now()}`;
            if (watermark) {
                apiUrl += `&watermark=${encodeURIComponent(watermark)}`;
            }

            const img = new Image();
            img.onload = function() {
                loadingDiv.style.display = 'none';
                resultDiv.innerHTML = '';
                resultDiv.appendChild(img);
            };
            img.onerror = function() {
                loadingDiv.style.display = 'none';
                errorDiv.textContent = 'Ping失败(p≧w≦q)';
            };
            img.src = apiUrl;
        });
        
        // 自动触发第一次ping
        submitBtn.click();
    }
}

// Skin页面初始化
// 增强版皮肤上传功能
function initSkinPage() {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const selectBtn = document.getElementById('selectBtn');
    const playerIdInput = document.getElementById('playerId');
    const progressContainer = document.getElementById('progressContainer');
    const uploadProgress = document.getElementById('uploadProgress');
    const statusText = document.getElementById('statusText');
    const fileList = document.getElementById('fileList');
    const errorDiv = document.getElementById('error');
    
    // 服务器配置
    const serverUrl = 'https://api.azsu.top/skin/upload';
    const skinPreviewBaseUrl = 'https://api.azsu.top/skin/skin/';
    
    // 阻止默认拖放行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // 高亮拖放区域
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    // 处理拖放文件
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    // 点击选择文件按钮
    selectBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 处理选择的文件
    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });
    
    // 处理文件
    function handleFiles(files) {
        fileList.innerHTML = '';
        errorDiv.textContent = '';
        
        const playerId = playerIdInput.value.trim();
        if (!playerId) {
            showError('请先输入玩家ID');
            return;
        }
        
        const pngFiles = Array.from(files).filter(file => file.type === 'image/png');
        
        if (pngFiles.length === 0) {
            showError('请选择PNG格式的皮肤文件');
            return;
        }
        
        // 检查文件大小
        const oversizedFiles = pngFiles.filter(file => file.size > 10 * 1024);
        if (oversizedFiles.length > 0) {
            showError(`文件 "${oversizedFiles[0].name}" 超过10KB限制`);
            return;
        }
        
        // 显示文件列表
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <span class="file-icon">📄</span>
                <span>${pngFiles[0].name}</span>
            </div>
            <span class="file-status status-pending">等待上传</span>
        `;
        fileList.appendChild(fileItem);
        
        // 开始上传
        uploadFile(pngFiles[0], playerId, fileItem);
    }
    
    // 上传文件
    function uploadFile(file, playerId, fileItem) {
        progressContainer.style.display = 'block';
        statusText.textContent = '准备上传...';
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('player_id', playerId);
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', serverUrl, true);
        
        // 更新进度条
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                uploadProgress.value = percent;
                statusText.textContent = `上传中: ${percent}%`;
                
                // 更新文件状态
                fileItem.querySelector('.file-status').textContent = `${percent}%`;
            }
        };
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === 'success') {
                        statusText.textContent = '上传成功!';
                        uploadProgress.value = 100;
                        
                        // 更新文件状态
                        const statusSpan = fileItem.querySelector('.file-status');
                        statusSpan.textContent = '上传成功';
                        statusSpan.className = 'file-status status-success';
                        
                        // 显示皮肤预览链接
                        const previewLink = document.createElement('a');
                        previewLink.href = skinPreviewBaseUrl + playerId;
                        previewLink.textContent = '查看皮肤';
                        previewLink.className = 'preview-link';
                        previewLink.target = '_blank';
                        previewLink.style.marginLeft = '10px';
                        fileItem.appendChild(previewLink);
                    } else {
                        showError(response.message || '上传失败');
                        
                        // 更新文件状态
                        const statusSpan = fileItem.querySelector('.file-status');
                        statusSpan.textContent = response.message || '上传失败';
                        statusSpan.className = 'file-status status-error';
                    }
                } catch (e) {
                    showError('解析服务器响应失败');
                    
                    // 更新文件状态
                    const statusSpan = fileItem.querySelector('.file-status');
                    statusSpan.textContent = '解析失败';
                    statusSpan.className = 'file-status status-error';
                }
            } else {
                showError('上传失败: ' + xhr.statusText);
                
                // 更新文件状态
                const statusSpan = fileItem.querySelector('.file-status');
                statusSpan.textContent = '上传失败';
                statusSpan.className = 'file-status status-error';
            }
        };
        
        xhr.onerror = function() {
            showError('上传过程中发生错误');
            
            // 更新文件状态
            const statusSpan = fileItem.querySelector('.file-status');
            statusSpan.textContent = '上传错误';
            statusSpan.className = 'file-status status-error';
        };
        
        xhr.send(formData);
    }
    
    // 显示错误信息
    function showError(message) {
        errorDiv.textContent = message;
    }
}


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
    }
});
