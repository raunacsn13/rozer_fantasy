document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = 'https://rozer-fantasy-8.onrender.com';

  // Deposit Form
  document.getElementById('depositForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('depositUsername').value;
    const amount = parseFloat(document.getElementById('depositAmount').value);

    try {
      const response = await fetch(${BASE_URL}/deposit, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': BASE_URL // CORS के लिए, अगर जरूरत हो
        },
        body: JSON.stringify({ username, amount })
      });
      const data = await response.json();
      document.getElementById('depositResult').textContent = data.message || JSON.stringify(data);
    } catch (error) {
      document.getElementById('depositResult').textContent = 'Error: ' + error.message;
    }
  });

  // Withdraw Form
  document.getElementById('withdrawForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('withdrawUsername').value;
    const amount = parseFloat(document.getElementById('withdrawAmount').value);

    try {
      const response = await fetch(${BASE_URL}/withdraw, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': BASE_URL // CORS के लिए, अगर जरूरत हो
        },
        body: JSON.stringify({ username, amount })
      });
      const data = await response.json();
      document.getElementById('withdrawResult').textContent = data.message || JSON.stringify(data);
    } catch (error) {
      document.getElementById('withdrawResult').textContent = 'Error: ' + error.message;
    }
  });

  // Chat Form
  document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const sender = document.getElementById('chatSender').value;
    const receiver = document.getElementById('chatReceiver').value;
    const message = document.getElementById('chatMessage').value;

    try {
      const response = await fetch(${BASE_URL}/chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': BASE_URL // CORS के लिए, अगर जरूरत हो
        },
        body: JSON.stringify({ sender, receiver, message })
      });
      const data = await response.json();
      document.getElementById('chatResult').textContent = data.message || JSON.stringify(data);
    } catch (error) {
      document.getElementById('chatResult').textContent = 'Error: ' + error.message;
    }
  });

  // Load Chat History
  document.getElementById('loadHistory').addEventListener('click', async () => {
    try {
      const response = await fetch(${BASE_URL}/chat/history, {
        headers: {
          'Origin': BASE_URL // CORS के लिए, अगर जरूरत हो
        }
      });
      const data = await response.json();
      const chatHistory = document.getElementById('chatHistory');
      chatHistory.innerHTML = '';
      data.chats.forEach(chat => {
        const li = document.createElement('li');
        li.textContent = ${chat.sender} to ${chat.receiver}: ${chat.message} (${new Date(chat.timestamp).toLocaleString()});
        chatHistory.appendChild(li);
      });
    } catch (error) {
      document.getElementById('chatHistory').textContent = 'Error loading history: ' + error.message;
    }
  });
});