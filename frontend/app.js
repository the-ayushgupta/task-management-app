// Use full URL when opening HTML from file system; relative when served by server
const API_BASE = (window.location.protocol === 'file:' ? 'http://localhost:5000' : '') + '/api/tasks';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const loadingEl = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const filterStatus = document.getElementById('filter-status');
const modal = document.getElementById('modal');
const editForm = document.getElementById('edit-form');
const cancelBtn = document.getElementById('cancel-btn');
const closeModalBtn = document.getElementById('close-modal');
const submitBtn = document.getElementById('submit-btn');

let tasks = [];
let editingId = null;

// Fetch all tasks
async function fetchTasks() {
  try {
    loadingEl.style.display = 'block';
    emptyState.style.display = 'none';
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    tasks = await res.json();
    renderTasks();
  } catch (error) {
    console.error('Error:', error);
    taskList.innerHTML = '<p class="empty-state">Unable to load tasks. Make sure the server is running.</p>';
  } finally {
    loadingEl.style.display = 'none';
  }
}

// Render tasks with optional filter
function renderTasks() {
  const filter = filterStatus.value;
  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    emptyState.textContent = filter === 'all' ? 'No tasks yet. Add your first task above!' : `No ${filter.replace('_', ' ')} tasks.`;
    taskList.innerHTML = '';
    taskList.appendChild(emptyState);
    return;
  }

  emptyState.style.display = 'none';
  taskList.innerHTML = '';

  filtered.forEach((task) => {
    const card = createTaskCard(task);
    taskList.appendChild(card);
  });
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = `task-card ${task.status === 'completed' ? 'completed' : ''}`;
  card.dataset.id = task.id;

  const statusClass = `status-${task.status}`;
  const statusLabel = task.status.replace('_', ' ');

  card.innerHTML = `
    <div class="task-header">
      <h3 class="task-title">${escapeHtml(task.title)}</h3>
    </div>
    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
    <div class="task-footer">
      <div class="task-meta">
        <span class="status-badge ${statusClass}">${statusLabel}</span>
        <span>${formatDate(task.created_at)}</span>
      </div>
      <div class="task-actions">
        <button class="btn btn-edit" data-action="edit" data-id="${task.id}">Edit</button>
        <button class="btn btn-danger" data-action="delete" data-id="${task.id}">Delete</button>
      </div>
    </div>
  `;

  card.querySelector('[data-action="edit"]').addEventListener('click', () => openEditModal(task));
  card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteTask(task.id));

  return card;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  const existing = document.getElementById('error-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'error-toast';
  toast.className = 'error-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Create task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const status = document.getElementById('status').value;

  if (!title) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `Server error (${res.status})`);
    }

    const newTask = data;
    tasks.unshift(newTask);
    renderTasks();
    taskForm.reset();
    document.getElementById('title').focus();
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Task';
  }
});

// Edit task - open modal
function openEditModal(task) {
  editingId = task.id;
  document.getElementById('edit-id').value = task.id;
  document.getElementById('edit-title').value = task.title;
  document.getElementById('edit-description').value = task.description || '';
  document.getElementById('edit-status').value = task.status;
  modal.classList.add('active');
}

// Edit task - submit
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const title = document.getElementById('edit-title').value.trim();
  const description = document.getElementById('edit-description').value.trim();
  const status = document.getElementById('edit-status').value;

  if (!title) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update task');
    }

    const updated = await res.json();
    const idx = tasks.findIndex((t) => t.id == id);
    if (idx !== -1) tasks[idx] = updated;
    renderTasks();
    closeModal();
  } catch (error) {
    showError(error.message);
  }
});

// Delete task
async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    tasks = tasks.filter((t) => t.id != id);
    renderTasks();
  } catch (error) {
    showError(error.message);
  }
}

// Close modal
function closeModal() {
  modal.classList.remove('active');
  editingId = null;
}

closeModalBtn.addEventListener('click', closeModal);
modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

// Filter
filterStatus.addEventListener('change', renderTasks);

// Init
fetchTasks();
