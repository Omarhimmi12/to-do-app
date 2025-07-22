document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const emptyImage = document.querySelector('.empty-image');
  const progressBar = document.getElementById('progress');
  const progressNumber = document.getElementById('numbers');

  const toggleEmptyState = () => {
    const hasTasks = taskList.children.length > 0;
    emptyImage.style.display = hasTasks ? 'none' : 'block';
  };

  const updateProgress = () => {
    const totalTasks = taskList.children.length;
    const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
    const percent = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = `${percent}%`;
    progressNumber.textContent = `${completedTasks} / ${totalTasks}`;
  };

  const saveTasks = () => {
    const tasks = [...taskList.querySelectorAll('li')].map(li => ({
      text: li.querySelector('span').textContent,
      completed: li.querySelector('.checkbox').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.text, task.completed));
  };

  const addTask = (text, completed = false) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
      <span>${taskText}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector('.checkbox');
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    if (completed) {
      li.classList.add('completed');
      editBtn.disabled = true;
      editBtn.style.opacity = '0.5';
      editBtn.style.pointerEvents = 'none';
    }

    checkbox.addEventListener('change', () => {
      const isChecked = checkbox.checked;
      li.classList.toggle('completed', isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? '0.5' : '1';
      editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
      updateProgress();
      saveTasks();
    });

    editBtn.addEventListener('click', () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector('span').textContent;
        li.remove();
        updateProgress();
        toggleEmptyState();
        saveTasks();
      }
    });

    deleteBtn.addEventListener('click', () => {
      li.remove();
      updateProgress();
      toggleEmptyState();
      saveTasks();
    });

    taskList.appendChild(li);
    taskInput.value = '';
    toggleEmptyState();
    updateProgress();
    saveTasks();
  };

  addTaskBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
  });

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });

  loadTasks();
});
