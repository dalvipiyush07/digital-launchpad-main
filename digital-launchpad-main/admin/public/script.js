const API_URL = 'http://localhost:8081/api';

// Check authentication
if (!localStorage.getItem('adminToken')) {
  window.location.href = '/login.html';
}

// Set user email
document.getElementById('userEmail').textContent = localStorage.getItem('adminEmail');

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminEmail');
  window.location.href = '/login.html';
});

// Navigation
document.querySelectorAll('.nav-link:not(.logout)').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
    
    loadData(section);
  });
});

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Modal
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

closeModal.addEventListener('click', () => {
  modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

// ===== OUR WORK =====
let currentEditWork = null;

async function loadWorks() {
  const response = await fetch(`${API_URL}/works`);
  const works = await response.json();
  
  // Sort by priority
  works.sort((a, b) => (a.priority || 999) - (b.priority || 999));
  
  const grid = document.getElementById('worksGrid');
  grid.innerHTML = works.map(work => `
    <div class="card" data-id="${work.id}">
      <div class="drag-handle" style="cursor: move; padding: 8px; background: #f1f5f9; border-radius: 4px; margin-bottom: 12px; text-align: center;">
        <span style="font-size: 20px;">☰</span>
        <span style="font-size: 12px; color: #64748b; margin-left: 8px;">Priority: ${work.priority || 999}</span>
      </div>
      <img src="${API_URL.replace('/api', '')}${work.coverImage}" class="card-image" alt="${work.name}">
      <div class="card-title">${work.name}</div>
      <div class="card-meta">${work.tag}</div>
      <div class="card-text">${work.desc}</div>
      <div class="card-meta">URL: ${work.url}</div>
      <div class="card-actions">
        <button class="btn btn-secondary btn-small" onclick="moveWork('${work.id}', 'up')">↑</button>
        <button class="btn btn-secondary btn-small" onclick="moveWork('${work.id}', 'down')">↓</button>
        <button class="btn btn-secondary btn-small" onclick="editWork('${work.id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteWork('${work.id}')">Delete</button>
      </div>
    </div>
  `).join('');
  
  // Initialize Sortable
  if (window.Sortable) {
    new Sortable(grid, {
      animation: 150,
      handle: '.drag-handle',
      onEnd: async function(evt) {
        await updateWorksPriority();
      }
    });
  }
}

async function updateWorksPriority() {
  const grid = document.getElementById('worksGrid');
  const cards = Array.from(grid.children);
  
  for (let i = 0; i < cards.length; i++) {
    const id = cards[i].dataset.id;
    const formData = new FormData();
    formData.append('priority', (i + 1).toString());
    
    await fetch(`${API_URL}/works/${id}/priority`, {
      method: 'PUT',
      body: formData
    });
  }
  
  showToast('Order updated!');
  loadWorks();
}

async function moveWork(id, direction) {
  const response = await fetch(`${API_URL}/works`);
  const works = await response.json();
  works.sort((a, b) => (a.priority || 999) - (b.priority || 999));
  
  const index = works.findIndex(w => w.id === id);
  if (index === -1) return;
  
  if (direction === 'up' && index > 0) {
    // Swap priorities
    const temp = works[index].priority || index + 1;
    works[index].priority = works[index - 1].priority || index;
    works[index - 1].priority = temp;
    
    await updateWorkPriority(works[index].id, works[index].priority);
    await updateWorkPriority(works[index - 1].id, works[index - 1].priority);
  } else if (direction === 'down' && index < works.length - 1) {
    // Swap priorities
    const temp = works[index].priority || index + 1;
    works[index].priority = works[index + 1].priority || index + 2;
    works[index + 1].priority = temp;
    
    await updateWorkPriority(works[index].id, works[index].priority);
    await updateWorkPriority(works[index + 1].id, works[index + 1].priority);
  }
  
  loadWorks();
}

async function updateWorkPriority(id, priority) {
  const formData = new FormData();
  formData.append('priority', priority.toString());
  
  await fetch(`${API_URL}/works/${id}/priority`, {
    method: 'PUT',
    body: formData
  });
}

document.getElementById('addWorkBtn').addEventListener('click', () => {
  currentEditWork = null;
  document.getElementById('modalTitle').textContent = 'Add New Project';
  document.getElementById('modalBody').innerHTML = `
    <form id="workForm" enctype="multipart/form-data">
      <div class="form-group">
        <label>Thumbnail Image</label>
        <input type="file" name="thumbnail" accept="image/*" onchange="previewImage(this)">
        <img id="imagePreview" class="image-preview" style="display:none">
      </div>
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" name="name" required>
      </div>
      <div class="form-group">
        <label>Category</label>
        <input type="text" name="tag" placeholder="e.g. E-commerce, SaaS" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="desc" required></textarea>
      </div>
      <div class="form-group">
        <label>Live Site URL</label>
        <input type="url" name="url" required>
      </div>
      <button type="submit" class="btn btn-primary">Add Project</button>
    </form>
  `;
  
  document.getElementById('workForm').addEventListener('submit', saveWork);
  modal.classList.add('show');
});

async function editWork(id) {
  const response = await fetch(`${API_URL}/works`);
  const works = await response.json();
  const work = works.find(w => w.id === id);
  
  currentEditWork = id;
  document.getElementById('modalTitle').textContent = 'Edit Project';
  document.getElementById('modalBody').innerHTML = `
    <form id="workForm" enctype="multipart/form-data">
      <div class="form-group">
        <label>Thumbnail Image</label>
        <input type="file" name="thumbnail" accept="image/*" onchange="previewImage(this)">
        <img id="imagePreview" class="image-preview" src="${API_URL.replace('/api', '')}${work.coverImage}">
      </div>
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" name="name" value="${work.name}" required>
      </div>
      <div class="form-group">
        <label>Category</label>
        <input type="text" name="tag" value="${work.tag}" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="desc" required>${work.desc}</textarea>
      </div>
      <div class="form-group">
        <label>Live Site URL</label>
        <input type="url" name="url" value="${work.url}" required>
      </div>
      <button type="submit" class="btn btn-primary">Update Project</button>
    </form>
  `;
  
  document.getElementById('workForm').addEventListener('submit', saveWork);
  modal.classList.add('show');
}

async function saveWork(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const url = currentEditWork 
    ? `${API_URL}/works/${currentEditWork}`
    : `${API_URL}/works`;
  
  const method = currentEditWork ? 'PUT' : 'POST';
  
  const response = await fetch(url, {
    method,
    body: formData
  });
  
  const data = await response.json();
  
  if (data.success) {
    showToast(currentEditWork ? 'Project updated!' : 'Project added!');
    modal.classList.remove('show');
    loadWorks();
  }
}

async function deleteWork(id) {
  if (!confirm('Delete this project?')) return;
  
  await fetch(`${API_URL}/works/${id}`, { method: 'DELETE' });
  showToast('Project deleted!');
  loadWorks();
}

// ===== CLIENT LOVE =====
let currentEditClient = null;

async function loadClients() {
  const response = await fetch(`${API_URL}/clients`);
  const clients = await response.json();
  
  const grid = document.getElementById('clientsGrid');
  grid.innerHTML = clients.map(client => `
    <div class="card">
      <img src="${API_URL.replace('/api', '')}${client.photo}" class="card-image" alt="${client.name}">
      <div class="card-title">${client.name}</div>
      <div class="card-meta">${client.role}</div>
      <div class="card-meta">${'⭐'.repeat(client.rating)}</div>
      <div class="card-text">"${client.text}"</div>
      <div class="card-actions">
        <button class="btn btn-secondary btn-small" onclick="editClient('${client.id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteClient('${client.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('addClientBtn').addEventListener('click', () => {
  currentEditClient = null;
  document.getElementById('modalTitle').textContent = 'Add New Testimonial';
  document.getElementById('modalBody').innerHTML = `
    <form id="clientForm" enctype="multipart/form-data">
      <div class="form-group">
        <label>Client Photo</label>
        <input type="file" name="photo" accept="image/*" onchange="previewImage(this)">
        <img id="imagePreview" class="image-preview" style="display:none">
      </div>
      <div class="form-group">
        <label>Client Name</label>
        <input type="text" name="name" required>
      </div>
      <div class="form-group">
        <label>Company / Designation</label>
        <input type="text" name="role" required>
      </div>
      <div class="form-group">
        <label>Star Rating</label>
        <select name="rating" required>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
      <div class="form-group">
        <label>Testimonial Text</label>
        <textarea name="text" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Add Testimonial</button>
    </form>
  `;
  
  document.getElementById('clientForm').addEventListener('submit', saveClient);
  modal.classList.add('show');
});

async function editClient(id) {
  const response = await fetch(`${API_URL}/clients`);
  const clients = await response.json();
  const client = clients.find(c => c.id === id);
  
  currentEditClient = id;
  document.getElementById('modalTitle').textContent = 'Edit Testimonial';
  document.getElementById('modalBody').innerHTML = `
    <form id="clientForm" enctype="multipart/form-data">
      <div class="form-group">
        <label>Client Photo</label>
        <input type="file" name="photo" accept="image/*" onchange="previewImage(this)">
        <img id="imagePreview" class="image-preview" src="${API_URL.replace('/api', '')}${client.photo}">
      </div>
      <div class="form-group">
        <label>Client Name</label>
        <input type="text" name="name" value="${client.name}" required>
      </div>
      <div class="form-group">
        <label>Company / Designation</label>
        <input type="text" name="role" value="${client.role}" required>
      </div>
      <div class="form-group">
        <label>Star Rating</label>
        <select name="rating" required>
          <option value="5" ${client.rating === 5 ? 'selected' : ''}>5 Stars</option>
          <option value="4" ${client.rating === 4 ? 'selected' : ''}>4 Stars</option>
          <option value="3" ${client.rating === 3 ? 'selected' : ''}>3 Stars</option>
          <option value="2" ${client.rating === 2 ? 'selected' : ''}>2 Stars</option>
          <option value="1" ${client.rating === 1 ? 'selected' : ''}>1 Star</option>
        </select>
      </div>
      <div class="form-group">
        <label>Testimonial Text</label>
        <textarea name="text" required>${client.text}</textarea>
      </div>
      <button type="submit" class="btn btn-primary">Update Testimonial</button>
    </form>
  `;
  
  document.getElementById('clientForm').addEventListener('submit', saveClient);
  modal.classList.add('show');
}

async function saveClient(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const url = currentEditClient 
    ? `${API_URL}/clients/${currentEditClient}`
    : `${API_URL}/clients`;
  
  const method = currentEditClient ? 'PUT' : 'POST';
  
  const response = await fetch(url, {
    method,
    body: formData
  });
  
  const data = await response.json();
  
  if (data.success) {
    showToast(currentEditClient ? 'Testimonial updated!' : 'Testimonial added!');
    modal.classList.remove('show');
    loadClients();
  }
}

async function deleteClient(id) {
  if (!confirm('Delete this testimonial?')) return;
  
  await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE' });
  showToast('Testimonial deleted!');
  loadClients();
}

// ===== VIDEO REVIEWS =====
let currentEditVideo = null;

async function loadVideos() {
  const response = await fetch(`${API_URL}/videos`);
  const videos = await response.json();
  
  const grid = document.getElementById('videosGrid');
  grid.innerHTML = videos.map(video => `
    <div class="card">
      <img src="${API_URL.replace('/api', '')}${video.thumbnail}" class="card-image" alt="${video.title}">
      <div class="card-title">${video.title}</div>
      <div class="card-meta">Type: ${video.type}</div>
      <div class="card-meta">URL: ${video.videoUrl}</div>
      <div class="card-actions">
        <button class="btn btn-secondary btn-small" onclick="editVideo('${video.id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteVideo('${video.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('addVideoBtn').addEventListener('click', () => {
  currentEditVideo = null;
  document.getElementById('modalTitle').textContent = 'Add New Video';
  document.getElementById('modalBody').innerHTML = `
    <form id="videoForm" enctype="multipart/form-data">
      <div class="form-group">
        <label>Video Type</label>
        <select name="type" required>
          <option value="YouTube">YouTube</option>
          <option value="Instagram">Instagram Reel</option>
        </select>
      </div>
      <div class="form-group">
        <label>Video URL</label>
        <input type="url" name="videoUrl" required>
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" required>
      </div>
      <div class="form-group">
        <label>Thumbnail Image</label>
        <input type="file" name="thumbnail" accept="image/*" onchange="previewImage(this)">
        <img id="imagePreview" class="image-preview" style="display:none">
      </div>
      <button type="submit" class="btn btn-primary">Add Video</button>
    </form>
  `;
  
  document.getElementById('videoForm').addEventListener('submit', saveVideo);
  modal.classList.add('show');
});

async function editVideo(id) {
  const response = await fetch(`${API_URL}/videos`);
  const videos = await response.json();
  const video = videos.find(v => v.id === id);
  
  currentEditVideo = id;
  document.getElementById('modalTitle').textContent = 'Edit Video';
  document.getElementById('modalBody').innerHTML = `
    <form id="videoForm" enctype="multipart/form-data">
      <div class="form-group">
        <label>Video Type</label>
        <select name="type" required>
          <option value="YouTube" ${video.type === 'YouTube' ? 'selected' : ''}>YouTube</option>
          <option value="Instagram" ${video.type === 'Instagram' ? 'selected' : ''}>Instagram Reel</option>
        </select>
      </div>
      <div class="form-group">
        <label>Video URL</label>
        <input type="url" name="videoUrl" value="${video.videoUrl}" required>
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" value="${video.title}" required>
      </div>
      <div class="form-group">
        <label>Thumbnail Image</label>
        <input type="file" name="thumbnail" accept="image/*" onchange="previewImage(this)">
        <img id="imagePreview" class="image-preview" src="${API_URL.replace('/api', '')}${video.thumbnail}">
      </div>
      <button type="submit" class="btn btn-primary">Update Video</button>
    </form>
  `;
  
  document.getElementById('videoForm').addEventListener('submit', saveVideo);
  modal.classList.add('show');
}

async function saveVideo(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const url = currentEditVideo 
    ? `${API_URL}/videos/${currentEditVideo}`
    : `${API_URL}/videos`;
  
  const method = currentEditVideo ? 'PUT' : 'POST';
  
  const response = await fetch(url, {
    method,
    body: formData
  });
  
  const data = await response.json();
  
  if (data.success) {
    showToast(currentEditVideo ? 'Video updated!' : 'Video added!');
    modal.classList.remove('show');
    loadVideos();
  }
}

async function deleteVideo(id) {
  if (!confirm('Delete this video?')) return;
  
  await fetch(`${API_URL}/videos/${id}`, { method: 'DELETE' });
  showToast('Video deleted!');
  loadVideos();
}

// Image preview
function previewImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('imagePreview');
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Load data based on section
function loadData(section) {
  if (section === 'works') loadWorks();
  else if (section === 'clients') loadClients();
  else if (section === 'videos') loadVideos();
}

// Initial load
loadWorks();
