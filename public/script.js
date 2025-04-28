async function loadTasks() {
    const res = await fetch('/tasks');
    const tasks = await res.json();
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task';
        li.innerHTML = `${task} <button onclick="deleteTask(${index})">Delete</button>`;
        list.appendChild(li);
    });
}

async function addTask() {
    const input = document.getElementById('task-input');
    const task = input.value.trim();
    if (task) {
        await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task })
        });
        input.value = '';
        loadTasks();
    }
}

async function deleteTask(index) {
    await fetch(`/tasks/${index}`, { method: 'DELETE' });
    loadTasks();
}

// Load tasks initially
loadTasks();
