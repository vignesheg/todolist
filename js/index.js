document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('todo-form');
    const taskList = document.getElementById('task-list');
    
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        addTask();
    });

    function addTask() {
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const priority = document.getElementById('task-priority').value;
        const date = document.getElementById('task-date').value;

        const task = {
            id: Date.now(),
            title,
            desc,
            priority,
            date,
            completed: false
        };

        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTask(task);

        form.reset();
    }

    function getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function displayTask(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-id', task.id);
        li.setAttribute('data-priority', task.priority);
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.desc}</p>
                <small>Priority: ${task.priority}</small><br>
                <small>Due: ${task.date}</small>
            </div>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(task.id));
        li.querySelector('.edit-btn').addEventListener('click', () => editTask(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => displayTask(task));
    }

    function toggleComplete(id) {
        const tasks = getTasks();
        const task = tasks.find(t => t.id === id);
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskList.innerHTML = '';
        loadTasks();
    }

    function editTask(id) {
        const tasks = getTasks();
        const task = tasks.find(t => t.id === id);
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.desc;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-date').value = task.date;

        deleteTask(id);
    }

    function deleteTask(id) {
        let tasks = getTasks();
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskList.innerHTML = '';
        loadTasks();
    }

    loadTasks();
});
