let currentGroupId = null;

async function loadGroups() {
    const res = await fetch('/groups');
    const groups = await res.json();
    const select = document.getElementById('group-selector');

    select.innerHTML = '<option value="">All Groups</option>';

    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.name;
        select.appendChild(option);
    });

    selectGroup(null);
}

function selectGroup(groupId) {
    currentGroupId = groupId;
    loadTasks();
}

function handleGroupChange(groupId) {
    const selectedGroup = groupId === "" ? null : parseInt(groupId);
    selectGroup(selectedGroup);
}

async function createGroup() {
    const groupName = document.getElementById('group-name').value.trim();

    if (groupName) {
        const response = await fetch('/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: groupName }),
        });

        if (response.ok) {
            loadGroups();
        } else {
            const result = await response.json();
            alert(result.message || 'Something went wrong!');
        }

        document.getElementById('group-name').value = '';
    } else {
        alert('Group name is required!');
    }
}

async function deleteGroup() {
    const groupId = document.getElementById('group-selector').value; // Pobierz ID wybranej grupy

    if (!groupId) {
        alert('Please select a group to delete!');
        return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this group?');
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`/groups/${groupId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Group deleted successfully!');
            loadGroups();
        } else {
            alert('Failed to delete group');
        }
    } catch (err) {
        console.error('Error deleting group:', err);
        alert('Error deleting group');
    }
}

async function loadTasks() {
    const params = new URLSearchParams();
    if (currentGroupId !== null) {
        params.append('group_id', currentGroupId);
    }
    let url = '/tasks';
    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    const tasks = await res.json();

    const todoList = document.getElementById('todo-list');
    const inProgressList = document.getElementById('inprogress-list');
    const doneList = document.getElementById('done-list');

    todoList.innerHTML = '';
    inProgressList.innerHTML = '';
    doneList.innerHTML = '';

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'task';

        let buttonHtml = '';
        if (task.progress === 'todo') {
            buttonHtml = `<button onclick="updateTaskProgress(${task.id}, 'inprogress')">+</button>`;
        } else if (task.progress === 'inprogress') {
            buttonHtml = `<button onclick="updateTaskProgress(${task.id}, 'done')">✔️</button>`;
        } else if (task.progress === 'done') {
            buttonHtml = `<button onclick="deleteTask(${task.id})">❌</button>`;
        }

        li.innerHTML = `${task.title} ${buttonHtml}`;

        if (task.progress === 'todo') {
            todoList.appendChild(li);
        } else if (task.progress === 'inprogress') {
            inProgressList.appendChild(li);
        } else if (task.progress === 'done') {
            doneList.appendChild(li);
        }
    });
}

async function updateTaskProgress(taskId, newProgress) {
    await fetch(`/tasks/${taskId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress })
    });
    loadTasks();
}

async function addTask() {
    const input = document.getElementById('task-input');
    const task = input.value.trim();
    if (task) {
        await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, group_id: currentGroupId })
        });
        input.value = '';
        loadTasks();
    }
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
}

loadGroups()
loadTasks();
