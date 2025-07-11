const { MongoClient, ObjectId } = require('mongodb');
const MONGODB_URI = process.env.MONGO_URL_THILLAI;
let client;
let db;

async function connectToDatabase() {
    if (db) return db;
    
    client = new MongoClient(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    try {
        await client.connect();
        db = client.db();
        console.log("Connected to MongoDB Atlas");
        return db;
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        throw err;
    }
}

// CRUD Operations

// Create a new post
async function createPost(post) {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('posts').insertOne(post);
        return result.insertedId;
    } catch (err) {
        console.error("Error creating post", err);
        throw err;
    }
}

// Read all posts
async function getAllPosts() {
    try {
        const db = await connectToDatabase();
        const posts = await db.collection('posts').find().sort({ createdAt: -1 }).toArray();
        return posts;
    } catch (err) {
        console.error("Error fetching posts", err);
        throw err;
    }
}

// Read a single post by ID
async function getPostById(id) {
    try {
        const db = await connectToDatabase();
        const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
        return post;
    } catch (err) {
        console.error("Error fetching post", err);
        throw err;
    }
}

// Update a post
async function updatePost(id, updatedPost) {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('posts').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedPost }
        );
        return result.modifiedCount;
    } catch (err) {
        console.error("Error updating post", err);
        throw err;
    }
}

// Delete a post
async function deletePost(id) {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount;
    } catch (err) {
        console.error("Error deleting post", err);
        throw err;
    }
}

process.on('SIGINT', async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
    process.exit();
});

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};
