const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

// इन-मेमोरी उपयोगकर्ता डेटा (MongoDB के बिना)
const users = {};

// इनपुट वैलिडेशन मिडलवेयर
const validateTransaction = [
  body('username').trim().notEmpty().withMessage('Username is required and cannot be empty'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number')
];

// जमा एNDपॉइंट
app.post('/deposit', validateTransaction, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, amount } = req.body;

  if (!users[username]) {
    users[username] = { balance: 0 }; // नया उपयोगकर्ता बनाएं
  }

  users[username].balance += amount;

  res.status(200).json({
    success: true,
    message: `Deposited ${amount}. New balance: ${users[username].balance}`,
    balance: users[username].balance
  });
});

// निकासी एNDपॉइंट
app.post('/withdraw', validateTransaction, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, amount } = req.body;

  if (!users[username]) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (users[username].balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  users[username].balance -= amount;

  res.status(200).json({
    success: true,
    message: Withdrawn ${amount}. New balance: ${users[username].balance},
    balance: users[username].balance
  });
});

// चैट एNDपॉइंट (इन-मेमोरी स्टोरेज के साथ, MongoDB के बिना)
const chats = []; // इन-मेमोरी चैट स्टोरेज

app.post('/chat', [
  body('sender').trim().notEmpty().withMessage('Sender is required'),
  body('receiver').trim().notEmpty().withMessage('Receiver is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sender, receiver, message } = req.body;
  const newChat = {
    sender,
    receiver,
    message,
    timestamp: new Date()
  };
  chats.push(newChat);

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    chat: newChat
  });
});

// चैट हिस्ट्री प्राप्त करने के लिए GET एNDपॉइंट (ऑप्शनल)
app.get('/chat/history', (req, res) => {
  res.status(200).json({
    success: true,
    chats: chats
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));
