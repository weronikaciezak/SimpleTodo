const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const app = express();
const PORT = 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

app.use(express.static('public'));
app.use(express.json());

app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Add a new task
app.post('/tasks', async (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ message: 'Task text is required.' });
    }
    try {
        await pool.query('INSERT INTO tasks (title) VALUES ($1)', [task]);
        res.status(201).json({ message: 'Task added.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Task deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
