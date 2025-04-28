const express = require('express');
const app = express();
const PORT = 3000;

let tasks = []; // In-memory tasks

app.use(express.static('public'));
app.use(express.json());

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const task = req.body.task;
    if (task) {
        tasks.push(task);
        res.status(201).json({ message: 'Task added.' });
    } else {
        res.status(400).json({ message: 'Task text is required.' });
    }
});

// Delete a task by index
app.delete('/tasks/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        res.json({ message: 'Task deleted.' });
    } else {
        res.status(404).json({ message: 'Task not found.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
