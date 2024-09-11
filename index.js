const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'BD_LOGIN'
});

connection.connect();

// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    const query = `
        SELECT u.id, u.nombre, u.apellido, u.telefono, u.correo, u.username, e.nombre as estado_nombre, r.nombre as rol_nombre 
        FROM usuarios u
        LEFT JOIN estado e ON u.estado_id = e.id
        LEFT JOIN rol r ON u.rol_id = r.id`;

    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Ruta para obtener todos los roles
app.get('/roles', (req, res) => {
    const query = 'SELECT * FROM rol';
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Ruta para obtener todos los estados
app.get('/estados', (req, res) => {
    const query = 'SELECT * FROM estado';
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Ruta para crear un nuevo usuario
app.post('/crear-usuario', (req, res) => {
    const { nombre, apellido, telefono, correo, username, password, rol, estado } = req.body;
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    const query = `
        INSERT INTO usuarios (nombre, apellido, telefono, correo, username, password, rol_id, estado_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, [nombre, apellido, telefono, correo, username, hashedPassword, rol, estado], (error, results) => {
        if (error) throw error;
        res.json({ success: true });
    });
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';

    connection.query(query, [username, hashedPassword], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            const user = results[0];

            // Verificar si el usuario está bloqueado
            if (user.estado_id === 2) {
                res.json({ success: false, message: 'Usuario bloqueado. Contacta al administrador.' });
            } else {
                // Verificar el rol del usuario
                if (user.rol_id === 1) {
                    // Admin: Redirigir a gestion.html
                    res.json({ success: true, rol: 'admin', message: 'Redirigir a gestion.html' });
                } else {
                    // Usuario normal: Redirigir a dashboard.html
                    res.json({ success: true, rol: 'usuario', message: 'Redirigir a dashboard.html' });
                }
            }
        } else {
            // Credenciales incorrectas
            res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Ruta para actualizar un usuario existente
app.put('/user/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, apellido, telefono, correo, username, password, estado, rol } = req.body;

    let query = 'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, correo = ?, username = ?, estado_id = ?, rol_id = ? WHERE id = ?';
    const params = [nombre, apellido, telefono, correo, username, estado, rol, id];

    if (password) {
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        query = 'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, correo = ?, username = ?, password = ?, estado_id = ?, rol_id = ? WHERE id = ?';
        params.splice(5, 0, hashedPassword);
    }

    connection.query(query, params, (error, results) => {
        if (error) throw error;
        res.json({ success: true });
    });
});

// Ruta para eliminar un usuario
app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) throw error;
        res.json({ success: true });
    });
});

app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});
