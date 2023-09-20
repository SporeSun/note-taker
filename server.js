const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const dbFilePath = path.join(__dirname, 'db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// HTML Routes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'notes.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    ...req.body,
    id: uuidv4()
  };
  let notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  notes.push(newNote);
  fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  notes = notes.filter(note => note.id !== noteId);
  fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
