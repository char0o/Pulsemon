const express = require('express');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  const delay = Math.floor(Math.random() * (2000 - 50 + 1)) + 50; // 50–2000
  setTimeout(() => {
    console.log(`⏱️ Delayed ${delay}ms for ${req.method} ${req.url}`);
    next();
  }, delay);
});

app.get('/api/users', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/api/teams', (req, res) => {
  const fail = Math.random() < 0.3;
  if (fail) {
    res.status(401).send({ message: 'Unauthorized' });
  } else {
    res.send('Hello from Express!');
  }
});

app.post('/api/users', (req, res) => {
  res.send('Hello from Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});