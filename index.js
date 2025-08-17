const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MongoDB connection
const uri = 'mongodb+srv://Yahyya_19:Yahyya_19@cluster0.ht3jq0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let usersCollection;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB and start the server
async function startServer() {
    try {
        await client.connect();
        const db = client.db('test'); // Use your actual DB name if different
        usersCollection = db.collection('users');

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

// ---- CRUD Routes ----

// CREATE - Add a new user
app.post('/users', async (req, res) => {
    try {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'User created', id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user', details: err });
    }
});

// READ - Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await usersCollection.find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', details: err });
    }
});

// READ - Get a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user', details: err });
    }
});

// UPDATE - Update a user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user', details: err });
    }
});

// DELETE - Remove a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user', details: err });
    }
});

// Start the server
startServer();
