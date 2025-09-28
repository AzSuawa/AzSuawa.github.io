const fs = require('fs');
const path = require('path');

// 页面配置
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
    }
};

// 页面内容映射
const pageContentMap = {
    'aa': 'pages/aa.html',
    'ab': 'pages/ab.html',
    'ac': 'pages/ac.html',
    'cmds': 'pages/cmds.html',
    'api': 'pages/api.html',
    'bot-update': 'pages/bot-update.html',
    'ba': 'pages/ba.html',
    'bb': 'pages/bb.html',
    'ban': 'pages/ban.html',
    'sp': 'pages/sp.html',
    'g': 'pages/g.html'
};

// 读取主模板
const template = fs.readFileSync('index-template.html', 'utf8');

// 生成静态页面
function generateStaticPages() {
    console.log('开始生成静态页面...');
    
    Object.keys(pageMetaData).forEach(pageId => {
        try {
            // 读取页面内容
            const contentPath = pageContentMap[pageId];
            if (!fs.existsSync(contentPath)) {
                console.log(`跳过: ${contentPath} 不存在`);
                return;
            }
            
            const pageContent = fs.readFileSync(contentPath, 'utf8');
            const meta = pageMetaData[pageId];
            
            // 生成完整的HTML页面
            let staticPage = template
                .replace('{{PAGE_ID}}', pageId)
                .replace('{{PAGE_TITLE}}', meta.title)
                .replace('{{PAGE_DESCRIPTION}}', meta.description)
                .replace('{{HEADER_TITLE}}', meta.headerTitle)
                .replace('{{PAGE_CONTENT}}', pageContent);
            
            // 写入静态文件
            const outputPath = `${pageId}.html`;
            fs.writeFileSync(outputPath, staticPage);
            console.log(`生成: ${outputPath}`);
            
        } catch (error) {
            console.error(`生成页面 ${pageId} 时出错:`, error);
        }
    });
    
    // 复制特殊页面（skin.html, mcp.html）
    ['skin', 'mcp'].forEach(page => {
        if (fs.existsSync(`${page}.html`)) {
            console.log(`复制: ${page}.html`);
        }
    });
    
    console.log('静态页面生成完成！');
}

generateStaticPages();


// 在生成静态页面时替换模板变量
function processTemplateVariables(template, pageId, meta, content) {
    return template
        .replace(/\{\{PAGE_ID\}\}/g, pageId)
        .replace(/\{\{PAGE_TITLE\}\}/g, meta.title)
        .replace(/\{\{PAGE_DESCRIPTION\}\}/g, meta.description)
        .replace(/\{\{HEADER_TITLE\}\}/g, meta.headerTitle)
        .replace(/\{\{PAGE_CONTENT\}\}/g, content)
        .replace(/class="{{PAGE_ID === '([^']+)' ? 'active' : ''}}"/g, 
            (match, targetPageId) => pageId === targetPageId ? 'class="active"' : 'class=""');
}