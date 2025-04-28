const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Konfiguracja połączenia do bazy PostgreSQL
const pool = new Pool({
    user: 'twoj_user',
    host: 'localhost',
    database: 'twoja_baza',
    password: 'twoje_haslo',
    port: 5432,
});

// Endpoint do pobierania wszystkich zadań
app.get('/tasks', async (req, res) => {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
});

// Endpoint do dodawania nowego zadania
app.post('/tasks', async (req, res) => {
    const { title } = req.body;
    const result = await pool.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *', [title]);
    res.json(result.rows[0]);
});

// Endpoint do usuwania zadania
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.sendStatus(204);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
