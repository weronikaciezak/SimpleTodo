const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const app = express();
const PORT = 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

app.use(express.static('public'));
app.use(express.json());


app.get('/tasks', async (req, res) => {
    const { progress, group_id } = req.query;
    let query = 'SELECT * FROM tasks';
    const conditions = [];
    const values = [];

    if (progress) {
        values.push(progress);
        conditions.push(`progress = $${values.length}`);
    }

    if (group_id) {
        values.push(group_id);
        conditions.push(`group_id = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id ASC';

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});


// Add a new task
app.post('/tasks', async (req, res) => {
    const { task, group_id, progress } = req.body;
    if (!task) return res.status(400).json({ message: 'Task text is required.' });

    try {
        await pool.query(
            'INSERT INTO tasks (title, group_id, progress) VALUES ($1, $2, $3)',
            [task, group_id || null, progress || 'todo']
        );
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

// Add a new group
app.post('/groups', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Group name is required.' });

    try {
        await pool.query('INSERT INTO groups (name) VALUES ($1)', [name]);
        res.status(201).json({ message: 'Group added.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Delete a group by ID
app.delete('/groups/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM groups WHERE id = $1', [id]);
        res.json({ message: 'Group and its tasks deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Get all groups
app.get('/groups', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM groups');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

// Update task progress
app.put('/tasks/:id/progress', async (req, res) => {
    const { id } = req.params;
    const { progress } = req.body;
    try {
        await pool.query('UPDATE tasks SET progress = $1 WHERE id = $2', [progress, id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update task progress' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
