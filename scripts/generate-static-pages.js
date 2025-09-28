import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 页面配置
const pageMetaData = {
    'aa': { title: '小小素(p≧w≦q)', headerTitle: '小小素BOT' },
    'ab': { title: '常见问题 - 小小素(p≧w≦q)', headerTitle: '常见问题' },
    'ac': { title: '鸣谢和赞助 - 小小素(p≧w≦q)', headerTitle: '鸣谢和赞助' },
    'cmds': { title: '指令帮助 - 小小素(p≧w≦q)', headerTitle: '指令帮助' },
    'api': { title: '小小素API - 小小素(p≧w≦q)', headerTitle: '小小素API' },
    'bot-update': { title: '更新日志 - 小小素(p≧w≦q)', headerTitle: '小小素更新日志' },
    'ba': { title: '素素の生存服 - 阿素本素(p≧w≦q)', headerTitle: '素素の生存服' },
    'bb': { title: '机制修改 - 素素の生存服(p≧w≦q)', headerTitle: '机制修改' },
    'ban': { title: '封禁列表 - 素素の生存服(p≧w≦q)', headerTitle: '封禁列表' },
    'sp': { title: '赞助列表 - 素素の生存服(p≧w≦q)', headerTitle: '赞助列表' },
    'g': { title: '小故事 - 阿素本素(p≧w≦q)', headerTitle: '小故事' }
};

// 生成静态页面
function generateStaticPages() {
    console.log('开始生成静态页面...');
    
    try {
        // 读取模板
        const template = fs.readFileSync('index-template.html', 'utf8');
        
        // 生成每个页面的静态文件
        Object.keys(pageMetaData).forEach(pageId => {
            try {
                // 读取页面内容
                const contentPath = `pages/${pageId}.html`;
                if (!fs.existsSync(contentPath)) {
                    console.log(`跳过: ${contentPath} 不存在`);
                    return;
                }
                
                const pageContent = fs.readFileSync(contentPath, 'utf8');
                const meta = pageMetaData[pageId];
                
                // 处理模板变量
                let staticPage = template
                    .replace(/\{\{PAGE_ID\}\}/g, pageId)
                    .replace(/\{\{PAGE_TITLE\}\}/g, meta.title)
                    .replace(/\{\{HEADER_TITLE\}\}/g, meta.headerTitle)
                    .replace(/\{\{PAGE_CONTENT\}\}/g, pageContent);
                
                // 处理活跃菜单项
                staticPage = staticPage.replace(/class="{{PAGE_ID === '([^']+)' ? 'active' : ''}}"/g, 
                    (match, targetPageId) => pageId === targetPageId ? 'class="active"' : 'class=""');
                
                // 写入静态文件
                fs.writeFileSync(`${pageId}.html`, staticPage);
                console.log(`✓ 生成: ${pageId}.html`);
                
            } catch (error) {
                console.error(`✗ 生成页面 ${pageId} 时出错:`, error.message);
            }
        });
        
        console.log('🎉 静态页面生成完成！');
        
    } catch (error) {
        console.error('❌ 生成静态页面失败:', error.message);
        process.exit(1);
    }
}

generateStaticPages();