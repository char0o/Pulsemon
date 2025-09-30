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
// Simple GET endpoint
app.get('/api/users', (req, res) => {
  res.send('Hello from Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});