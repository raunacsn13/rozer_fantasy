const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

let db;

// MongoDB कनेक्ट करें
async function connectDB() {
    try {
        await client.connect();
        db = client.db('fantasyKing');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
}
connectDB();

// होम रूट
app.get('/', (req, res) => {
    res.send('Fantasy King App with MongoDB is running!');
});

// साइन अप
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await db.collection('users').findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        await db.collection('users').insertOne({ username, password, balance: 0 });
        res.json({ message: 'Signup successful! Please login.' });
    } catch (err) {
        res.status(500).json({ error: 'Signup failed' });
    }
});

// लॉगिन
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.collection('users').findOne({ username, password });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        res.json({ message: 'Login successful!' });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// डिपॉजिट
app.post('/deposit', async (req, res) => {
    const { username, amount } = req.body;
    try {
        const user = await db.collection('users').findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const newBalance = user.balance + amount;
        await db.collection('users').updateOne({ username }, { $set: { balance: newBalance } });
        res.json({ message: Deposited ${amount}. New balance: ${newBalance} });
    } catch (err) {
        res.status(500).json({ error: 'Deposit failed' });
    }
});

// विड्रॉल
app.post('/withdraw', async (req, res) => {
    const { username, amount } = req.body;
    try {
        const user = await db.collection('users').findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        if (user.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        const newBalance = user.balance - amount;
        await db.collection('users').updateOne({ username }, { $set: { balance: newBalance } });
        res.json({ message: Withdrawn ${amount}. New balance: ${newBalance} });
    } catch (err) {
        res.status(500).json({ error: 'Withdrawal failed' });
    }
});

// चैट सपोर्ट (MongoDB में स्टोर)
app.post('/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const reply = आपने कहा: ${message}। हमने इसे रिकॉर्ड किया। (AI सपोर्ट अभी उपलब्ध नहीं है।); // बिना OpenAI का साधारण जवाब
        await db.collection('chatHistory').insertOne({ message, reply, timestamp: new Date() });
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
});