// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load existing posts
    loadPostsForAdmin();
    
    // Set up form submission for new post
    const createForm = document.getElementById('createPostForm');
    createForm.addEventListener('submit', handleCreatePost);
    
    // Set up modal close button
    const closeModalBtn = document.getElementById('closeEditModal');
    closeModalBtn.addEventListener('click', closeEditModal);
    
    // Set up form submission for edit post
    const editForm = document.getElementById('editPostForm');
    editForm.addEventListener('submit', handleEditPost);
});

// Load posts for admin with edit/delete options
async function loadPostsForAdmin() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
        const postsContainer = document.getElementById('adminPostsList');
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<div class="no-posts">No blog posts found.</div>';
            return;
        }
        
        let html = '';
        posts.forEach(post => {
            html += `
                <div class="post-item" data-id="${post._id}">
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 150)}...</p>
                    <div class="post-meta">
                        <span>By ${post.author}</span>
                        <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="post-item-actions">
                        <button class="btn btn-warning edit-btn" data-id="${post._id}">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${post._id}">Delete</button>
                    </div>
                </div>
            `;
        });
        
        postsContainer.innerHTML = html;
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditButtonClick);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteButtonClick);
        });
    } catch (err) {
        console.error("Error loading posts", err);
        document.getElementById('adminPostsList').innerHTML = 
            '<div class="error">Error loading posts. Please try again later.</div>';
    }
}

// Handle create new post form submission
async function handleCreatePost(e) {
    e.preventDefault();
    
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const author = document.getElementById('postAuthor').value;
    
    if (!title || !content || !author) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content,
                author,
                createdAt: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            // Clear form
            document.getElementById('createPostForm').reset();
            // Reload posts
            loadPostsForAdmin();
            alert('Post created successfully!');
        } else {
            throw new Error('Failed to create post');
        }
    } catch (err) {
        console.error("Error creating post", err);
        alert('Error creating post. Please try again.');
    }
}

// Handle edit button click
async function handleEditButtonClick(e) {
    const postId = e.target.getAttribute('data-id');
    
    try {
        const response = await fetch(`/api/posts/${postId}`);
        const post = await response.json();
        
        // Fill the edit form
        document.getElementById('editPostId').value = post._id;
        document.getElementById('editPostTitle').value = post.title;
        document.getElementById('editPostContent').value = post.content;
        document.getElementById('editPostAuthor').value = post.author;
        
        // Show the modal
        document.getElementById('editModal').style.display = 'flex';
    } catch (err) {
        console.error("Error loading post for edit", err);
        alert('Error loading post for editing. Please try again.');
    }
}

// Handle edit form submission
async function handleEditPost(e) {
    e.preventDefault();
    
    const postId = document.getElementById('editPostId').value;
    const title = document.getElementById('editPostTitle').value;
    const content = document.getElementById('editPostContent').value;
    const author = document.getElementById('editPostAuthor').value;
    
    if (!title || !content || !author) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content,
                author
            })
        });
        
        if (response.ok) {
            // Close modal
            closeEditModal();
            // Reload posts
            loadPostsForAdmin();
            alert('Post updated successfully!');
        } else {
            throw new Error('Failed to update post');
        }
    } catch (err) {
        console.error("Error updating post", err);
        alert('Error updating post. Please try again.');
    }
}

// Handle delete button click
async function handleDeleteButtonClick(e) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    const postId = e.target.getAttribute('data-id');
    
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Reload posts
            loadPostsForAdmin();
            alert('Post deleted successfully!');
        } else {
            throw new Error('Failed to delete post');
        }
    } catch (err) {
        console.error("Error deleting post", err);
        alert('Error deleting post. Please try again.');
    }
}

// Close the edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}