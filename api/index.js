const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

// Use JSON parsing middleware
app.use(express.json());

async function connectToDatabase() {

  const uri = 'mongodb+srv://Yahiyya_19:Yahiyya_19@cluster0.ht3jq0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  if (!uri) throw new Error('Missing MongoDB URI in environment variables');

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  return client;
}

// Basic routes
app.get('/', (req, res) => {
  res.send('Hello World!!!!');
});

app.post('/pp', (req, res) => {
  res.send('Got a POST request');
});

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user');
});

app.delete('/userdd', (req, res) => {
  res.send('Got a DELETE request at /user');
});

// Example route that uses MongoDB
app.get('/users', async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db('test'); // Change this to your DB name
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    console.error('MongoDB error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Export the app (required by Vercel)
module.exports = app;
