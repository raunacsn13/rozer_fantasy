const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// सैंपल यूज़र डेटा (इन-मेमोरी स्टोरेज, MongoDB के बिना)
const users = {};

app.get('/', (req, res) => {
    res.send('Rozer Fantasy App is running!');
});

// साइन अप
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    users[username] = { password, balance: 0 };
    res.json({ message: 'Signup successful! Please login.' });
});

// लॉगिन
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!users[username] || users[username].password !== password) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    res.json({ message: 'Login successful!' });
});

// डिपॉजिट
app.post('/deposit', (req, res) => {
    const { username, amount } = req.body;
    if (!users[username]) {
        return res.status(400).json({ error: 'User not found' });
    }
    users[username].balance += amount;
    res.json({ message: Deposited ${amount}. New balance: ${users[username].balance} });
});

// विड्रॉल
app.post('/withdraw', (req, res) => {
    const { username, amount } = req.body;
    if (!users[username]) {
        return res.status(400).json({ error: 'User not found' });
    }
    if (users[username].balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }
    users[username].balance -= amount;
    res.json({ message: Withdrawn ${amount}. New balance: ${users[username].balance} });
});

// चैट सपोर्ट (MongoDB के बिना, साधारण जवाब)
app.post('/chat', (req, res) => {
    const { message } = req.body;
    const reply = आपने कहा: ${message}। हमने इसे रिकॉर्ड किया। (AI सपोर्ट अभी उपलब्ध नहीं है।);
    res.json({ reply });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
});
