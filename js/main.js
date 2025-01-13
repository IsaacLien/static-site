// Configure marked options
marked.setOptions({
    breaks: true,
    gfm: true
});

// Function to load and render markdown content
async function loadMarkdownContent(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Failed to load content');
        const markdown = await response.text();
        return marked.parse(markdown);
    } catch (error) {
        console.error('Error loading content:', error);
        return '<p>Error loading content. Please try again later.</p>';
    }
}

// Function to load blog posts
async function loadBlogPosts() {
    const blogList = document.querySelector('.blog-list');
    if (!blogList) return;

    try {
        const response = await fetch('../content/blog-index.json');
        const posts = await response.json();
        
        const postsHTML = posts.map(post => `
            <article class="blog-preview">
                <h2><a href="${post.slug}.html">${post.title}</a></h2>
                <time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time>
                <p>${post.excerpt}</p>
            </article>
        `).join('');
        
        blogList.innerHTML = postsHTML;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogList.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
    }
}

// Initialize page content
document.addEventListener('DOMContentLoaded', () => {
    // Check if there's markdown content to load
    const markdownContainer = document.querySelector('[data-markdown-content]');
    if (markdownContainer) {
        const contentPath = markdownContainer.dataset.markdownContent;
        loadMarkdownContent(contentPath).then(html => {
            markdownContainer.innerHTML = html;
        });
    }

    // Load blog posts if we're on the blog index page
    const path = window.location.pathname;
    if (path.endsWith('/blog/') || path.endsWith('/blog/index.html')) {
        loadBlogPosts();
    }
}); 