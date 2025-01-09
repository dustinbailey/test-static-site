const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');

// Ensure build directory exists
fs.ensureDirSync('dist');

// Copy static assets
fs.copySync('src/static', 'dist');

// Convert markdown files to HTML
function convertMarkdown(markdown) {
  return marked.parse(markdown);
}

// Build pages
function buildPages() {
  const pagesDir = 'src/content/pages';
  const files = fs.readdirSync(pagesDir);
  
  // Handle index.html specially
  const indexContent = fs.readFileSync('src/templates/index.html', 'utf-8');
  const template = fs.readFileSync('src/templates/page.html', 'utf-8');
  const indexHtml = template.replace('{{content}}', indexContent);
  fs.writeFileSync('dist/index.html', indexHtml);
  
  files.forEach(file => {
    if (file === 'index.md') return; // Skip index.md if it exists
    
    if (file.endsWith('.md')) {
      const markdown = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
      const html = convertMarkdown(markdown);
      const template = fs.readFileSync('src/templates/page.html', 'utf-8');
      const finalHtml = template.replace('{{content}}', html);
      
      const outputPath = path.join('dist', file.replace('.md', '.html'));
      fs.writeFileSync(outputPath, finalHtml);
    }
  });
}

// Build blog posts
function buildBlog() {
  const blogDir = 'src/content/blog';
  const files = fs.readdirSync(blogDir);
  
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const markdown = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const html = convertMarkdown(markdown);
      const template = fs.readFileSync('src/templates/post.html', 'utf-8');
      const finalHtml = template.replace('{{content}}', html);
      
      const outputPath = path.join('dist/blog', file.replace('.md', '.html'));
      fs.ensureDirSync('dist/blog');
      fs.writeFileSync(outputPath, finalHtml);
    }
  });
}

buildPages();
buildBlog(); 