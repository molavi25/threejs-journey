const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const sessionsFile = path.join(__dirname, 'sessions.json');
const progressFile = path.join(__dirname, 'progress.json');

// Read JSON helper
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
}

// Write JSON helper
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// Endpoint to get sessions data
app.get('/api/sessions', (req, res) => {
  const sessions = readJSON(sessionsFile);
  if (!sessions) return res.status(500).json({ error: 'Sessions file not found' });
  res.json(sessions);
});

// Endpoint to get progress data
app.get('/api/progress', (req, res) => {
  let progress = readJSON(progressFile);
  if (!progress) progress = {};
  res.json(progress);
});

// Endpoint to update progress data
app.post('/api/progress', (req, res) => {
  const newProgress = req.body;
  if (typeof newProgress !== 'object') return res.status(400).json({ error: 'Invalid progress data' });
  writeJSON(progressFile, newProgress);
  res.json({ status: 'success' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
