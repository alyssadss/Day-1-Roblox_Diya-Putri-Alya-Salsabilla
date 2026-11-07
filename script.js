// Student Task Planner - fitur tambah, filter, dan penyelesaian tugas.
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const formMessage = document.getElementById('formMessage');
const filterButtons = document.querySelectorAll('.filter-button');

let tasks = [
  { id: 1, title: 'Menyelesaikan desain moodboard', course: 'Dasar Desain', dueDate: getDateOffset(2), priority: 'high', completed: false },
  { id: 2, title: 'Membaca materi pengantar ICT', course: 'English for ICT', dueDate: getDateOffset(4), priority: 'medium', completed: false },
  { id: 3, title: 'Mengumpulkan latihan digital drawing', course: 'Visual Karakter', dueDate: getDateOffset(-1), priority: 'low', completed: true }
];
let currentFilter = 'all';
let nextId = 4;

function getDateOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDate(dateString) {
  if (!dateString) return 'Belum ada deadline';
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function getPriorityLabel(priority) {
  return { high: 'Tinggi', medium: 'Sedang', low: 'Rendah' }[priority] || 'Sedang';
}

function renderTasks() {
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  taskList.innerHTML = '';
  filteredTasks.forEach((task) => {
    const item = document.createElement('article');
    item.className = `task-item${task.completed ? ' is-completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Tandai ${task.title} selesai`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const main = document.createElement('div');
    main.className = 'task-main';
    const title = document.createElement('p');
    title.className = 'task-title';
    title.textContent = task.title;
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    const course = document.createElement('span');
    course.textContent = task.course || 'Umum';
    const due = document.createElement('span');
    due.textContent = `◷ ${formatDate(task.dueDate)}`;
    const priority = document.createElement('span');
    priority.className = `priority ${task.priority}`;
    priority.textContent = getPriorityLabel(task.priority);
    meta.append(course, due, priority);
    main.append(title, meta);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `Hapus ${task.title}`);
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    item.append(checkbox, main, deleteButton);
    taskList.appendChild(item);
  });

  emptyState.hidden = filteredTasks.length > 0;
  document.getElementById('visibleCount').textContent = `${filteredTasks.length} tugas`;
  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('pendingCount').textContent = tasks.filter((task) => !task.completed).length;
  document.getElementById('completedCount').textContent = tasks.filter((task) => task.completed).length;
}

function toggleTask(id) {
  tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
  formMessage.textContent = 'Tugas berhasil dihapus.';
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const title = String(formData.get('title')).trim();
  const course = String(formData.get('course')).trim();
  const dueDate = String(formData.get('dueDate'));
  const priority = String(formData.get('priority'));

  if (!title || !dueDate) {
    formMessage.textContent = 'Nama tugas dan deadline wajib diisi.';
    return;
  }

  tasks.unshift({ id: nextId++, title, course, dueDate, priority, completed: false });
  taskForm.reset();
  document.getElementById('taskPriority').value = 'medium';
  currentFilter = 'all';
  updateActiveFilter();
  renderTasks();
  formMessage.textContent = 'Tugas berhasil ditambahkan. Semangat mengerjakan!';
});

function updateActiveFilter() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    updateActiveFilter();
    renderTasks();
  });
});

const today = new Date();
document.getElementById('todayLabel').textContent = today.toLocaleDateString('id-ID', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});
// Atur tanggal minimum agar deadline baru tidak dipilih sebelum hari ini.
document.getElementById('taskDate').min = getDateOffset(0);
updateActiveFilter();
renderTasks();
