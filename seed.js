const { MongoClient } = require('mongodb');
const posts = require('./database.json');

async function seedDatabase() {
  const uri = "mongodb+srv://thillainathanb6:ba2HqKg6S50Ut2xr@cluster0.5jatmse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    // Insert documents
    const result = await db.collection('posts').insertMany(posts);
    console.log(`${result.insertedCount} documents inserted`);
  } finally {
    await client.close();
  }
}

seedDatabase().catch(console.error);