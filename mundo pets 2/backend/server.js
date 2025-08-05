
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = './users.json';
const SECRET = 'clave_secreta';

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const exists = users.find(u => u.username === username);
  if (exists) return res.json({ error: 'Usuario ya existe' });
  users.push({ username, password });
  saveUsers(users);
  const token = jwt.sign({ username }, SECRET);
  res.json({ token });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.json({ error: 'Credenciales inválidas' });
  const token = jwt.sign({ username }, SECRET);
  res.json({ token });
});

app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
