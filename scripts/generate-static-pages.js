import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// 处理模板变量替换
function processTemplateVariables(template, pageId, meta, content) {
    let processed = template
        .replace(/\{\{PAGE_ID\}\}/g, pageId)
        .replace(/\{\{PAGE_TITLE\}\}/g, meta.title)
        .replace(/\{\{PAGE_DESCRIPTION\}\}/g, meta.description)
        .replace(/\{\{HEADER_TITLE\}\}/g, meta.headerTitle)
        .replace(/\{\{PAGE_CONTENT\}\}/g, content);
    
    // 处理活跃菜单项
    processed = processed.replace(/class="{{PAGE_ID === '([^']+)' ? 'active' : ''}}"/g, 
        (match, targetPageId) => pageId === targetPageId ? 'class="active"' : 'class=""');
    
    return processed;
}

// 生成静态页面
function generateStaticPages() {
    console.log('开始生成静态页面...');
    
    try {
        // 读取模板
        const templatePath = path.join(__dirname, '..', 'index-template.html');
        if (!fs.existsSync(templatePath)) {
            throw new Error('模板文件 index-template.html 不存在');
        }
        
        const template = fs.readFileSync(templatePath, 'utf8');
        
        // 生成每个页面的静态文件
        Object.keys(pageMetaData).forEach(pageId => {
            try {
                // 读取页面内容
                const contentPath = path.join(__dirname, '..', pageContentMap[pageId]);
                if (!fs.existsSync(contentPath)) {
                    console.log(`跳过: ${contentPath} 不存在`);
                    return;
                }
                
                const pageContent = fs.readFileSync(contentPath, 'utf8');
                const meta = pageMetaData[pageId];
                
                // 处理模板变量
                const staticPage = processTemplateVariables(template, pageId, meta, pageContent);
                
                // 写入静态文件
                const outputPath = path.join(__dirname, '..', `${pageId}.html`);
                fs.writeFileSync(outputPath, staticPage);
                console.log(`✓ 生成: ${pageId}.html`);
                
            } catch (error) {
                console.error(`✗ 生成页面 ${pageId} 时出错:`, error.message);
            }
        });
        
        // 复制特殊页面（skin.html, mcp.html）
        ['skin', 'mcp'].forEach(page => {
            const sourcePath = path.join(__dirname, '..', `${page}.html`);
            if (fs.existsSync(sourcePath)) {
                console.log(`✓ 保留: ${page}.html`);
            }
        });
        
        // 确保 index.html 存在（SPA入口）
        if (!fs.existsSync(path.join(__dirname, '..', 'index.html'))) {
            const spaTemplate = template
                .replace(/\{\{PAGE_ID\}\}/g, 'api')
                .replace(/\{\{PAGE_TITLE\}\}/g, '阿素本素(p≧w≦q)')
                .replace(/\{\{PAGE_DESCRIPTION\}\}/g, '素素の生存服、azsu.top、小小素QQ机器人、API接口、MC服务器、Minecraft、我的世界、麦块')
                .replace(/\{\{HEADER_TITLE\}\}/g, '素素の生存服')
                .replace(/\{\{PAGE_CONTENT\}\}/g, '')
                .replace(/class="{{PAGE_ID === '([^']+)' ? 'active' : ''}}"/g, 'class=""');
            
            fs.writeFileSync(path.join(__dirname, '..', 'index.html'), spaTemplate);
            console.log('✓ 生成: index.html (SPA入口)');
        }
        
        console.log('🎉 静态页面生成完成！');
        
    } catch (error) {
        console.error('❌ 生成静态页面失败:', error.message);
        process.exit(1);
    }
}

generateStaticPages();