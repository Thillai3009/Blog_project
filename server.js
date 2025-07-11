const express = require('express');
const cors = require('cors');
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('./scripts/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// API Routes
app.post('/api/posts', async (req, res) => {
    try {
        const postId = await createPost({
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        res.status(201).json({ _id: postId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    try {
        const modifiedCount = await updatePost(req.params.id, {
            ...req.body,
            updatedAt: new Date()
        });
        if (modifiedCount === 0) return res.status(404).json({ error: 'Post not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        const deletedCount = await deletePost(req.params.id);
        if (deletedCount === 0) return res.status(404).json({ error: 'Post not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve HTML files
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/post.html', (req, res) => res.sendFile(__dirname + '/post.html'));
app.get('/admin.html', (req, res) => res.sendFile(__dirname + '/admin.html'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});