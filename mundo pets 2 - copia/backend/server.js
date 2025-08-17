
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
  const { username, email, password } = req.body;
  
  // Validaciones
  if (!username || !email || !password) {
    return res.json({ error: 'Todos los campos son requeridos' });
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({ error: 'Formato de email inválido' });
  }
  
  const users = loadUsers();
  
  // Verificar si el usuario ya existe
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.json({ error: 'El nombre de usuario ya existe' });
  }
  
  // Verificar si el email ya existe
  const existingEmail = users.find(u => u.email === email);
  if (existingEmail) {
    return res.json({ error: 'El email ya está registrado' });
  }
  
  // Crear nuevo usuario
  users.push({ username, email, password });
  saveUsers(users);
  
  const token = jwt.sign({ username }, SECRET);
  res.json({ token, message: 'Usuario registrado exitosamente' });
});

app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body;
  
  if (!identifier || !password) {
    return res.json({ error: 'Usuario/Email y contraseña son requeridos' });
  }
  
  const users = loadUsers();
  
  // Buscar usuario por username o email
  const user = users.find(u => 
    (u.username === identifier || u.email === identifier) && 
    u.password === password
  );
  
  if (!user) {
    return res.json({ error: 'Credenciales inválidas' });
  }
  
  const token = jwt.sign({ username: user.username }, SECRET);
  res.json({ token, message: 'Inicio de sesión exitoso' });
});

app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
