document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('blogPosts')) {
        loadAllPosts();
    } else if (document.getElementById('singlePost')) {
        loadSinglePost();
    }
});

async function loadAllPosts() {
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to load posts');
        const posts = await response.json();
        
        const container = document.getElementById('blogPosts');
        container.innerHTML = posts.length ? '' : '<div class="no-posts">No blog posts found.</div>';
        
        posts.forEach(post => {
            const postEl = document.createElement('article');
            postEl.className = 'post-card';
            postEl.innerHTML = `
                <div class="post-content">
                    <h2>${post.title}</h2>
                    <p>${post.content.substring(0, 100)}...</p>
                    <div class="post-meta">
                        <span>By ${post.author}</span>
                        <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <a href="post.html?id=${post._id}" class="read-more">Read More</a>
                </div>
            `;
            container.appendChild(postEl);
        });
    } catch (err) {
        console.error("Error loading posts", err);
        document.getElementById('blogPosts').innerHTML = 
            '<div class="error">Error loading posts. Please try again later.</div>';
    }
}

async function loadSinglePost() {
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) return window.location.href = 'index.html';
    
    try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) throw new Error('Failed to load post');
        const post = await response.json();
        
        document.getElementById('singlePost').innerHTML = `
            <h1>${post.title}</h1>
            <div class="post-meta">
                <span>By ${post.author}</span>
                <span>${new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
        `;
    } catch (err) {
        console.error("Error loading post", err);
        document.getElementById('singlePost').innerHTML = 
            '<div class="error">Error loading post. Please try again later.</div>';
    }
}