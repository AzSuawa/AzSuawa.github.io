// build-edgeone.js
const fs = require('fs-extra');
const path = require('path');

// 配置所有页面
const pages = {
  '': { title: '阿素本素(p≧w≦q)', file: 'aa.html' },
  'aa': { title: '小小素(p≧w≦q)', file: 'aa.html' },
  'api': { title: '小小素API - 小小素(p≧w≦q)', file: 'api.html' },
  'cmds': { title: '指令帮助 - 小小素(p≧w≦q)', file: 'cmds.html' },
  'ban': { title: '封禁列表 - 素素の生存服(p≧w≦q)', file: 'ban.html' },
  'sp': { title: '赞助列表 - 素素の生存服(p≧w≦q)', file: 'sp.html' },
  'bot-update': { title: '更新日志 - 小小素(p≧w≦q)', file: 'bot-update.html' },
  'ab': { title: '常见问题 - 小小素(p≧w≦q)', file: 'ab.html' },
  'ac': { title: '鸣谢和赞助 - 小小素(p≧w≦q)', file: 'ac.html' },
  'ba': { title: '素素の生存服 - 阿素本素(p≧w≦q)', file: 'ba.html' },
  'bb': { title: '机制修改 - 素素の生存服(p≧w≦q)', file: 'bb.html' },
  'g': { title: '小故事 - 阿素本素(p≧w≦q)', file: 'g.html' }
};

// 生成静态HTML文件
async function build() {
  const distDir = './dist';
  await fs.ensureDir(distDir);
  
  // 复制静态资源
  await fs.copy('./css', path.join(distDir, 'css'));
  await fs.copy('./js', path.join(distDir, 'js'));
  await fs.copy('./images', path.join(distDir, 'images'));
  
  // 为每个页面生成HTML
  for (const [pagePath, config] of Object.entries(pages)) {
    const html = await generatePageHTML(config, pagePath);
    const outputPath = pagePath ? path.join(distDir, pagePath, 'index.html') : path.join(distDir, 'index.html');
    
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, html);
    console.log(`✅ 生成: /${pagePath || ''}`);
  }
  
  // 生成SEO文件
  await generateSEOFiles(distDir);
  console.log('🎉 EdgeOne静态站点构建完成！');
}

build();