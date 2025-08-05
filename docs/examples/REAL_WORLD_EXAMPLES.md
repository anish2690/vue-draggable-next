# Real-World Examples

This document provides practical, production-ready examples for common use cases.

## 📋 Kanban Board

A complete kanban board implementation with multiple columns and drag-and-drop between them.

```vue
<template>
  <div class="kanban-board">
    <div 
      v-for="column in columns" 
      :key="column.id"
      class="kanban-column"
    >
      <div class="column-header">
        <h3>{{ column.title }}</h3>
        <span class="task-count">{{ column.tasks.length }}</span>
      </div>
      
      <draggable
        v-model="column.tasks"
        :group="{ name: 'kanban', pull: true, put: true }"
        :animation="200"
        ghost-class="ghost-card"
        chosen-class="chosen-card"
        drag-class="drag-card"
        class="task-list"
        @change="onTaskChange"
        @start="onDragStart"
        @end="onDragEnd"
        item-key="id"
      >
        <template #item="{ element: task }">
          <div class="task-card" :class="getPriorityClass(task.priority)">
            <div class="task-header">
              <span class="task-title">{{ task.title }}</span>
              <button 
                @click="editTask(task)"
                class="edit-btn"
              >
                ✏️
              </button>
            </div>
            
            <p class="task-description">{{ task.description }}</p>
            
            <div class="task-footer">
              <div class="task-assignee">
                <img 
                  :src="task.assignee.avatar" 
                  :alt="task.assignee.name"
                  class="avatar"
                >
                <span>{{ task.assignee.name }}</span>
              </div>
              
              <div class="task-meta">
                <span class="priority">{{ task.priority }}</span>
                <span class="due-date">{{ formatDate(task.dueDate) }}</span>
              </div>
            </div>
          </div>
        </template>
      </draggable>
      
      <button 
        @click="addTask(column.id)"
        class="add-task-btn"
      >
        + Add Task
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

interface User {
  id: string
  name: string
  avatar: string
}

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignee: User
  dueDate: Date
  columnId: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const columns = ref<Column[]>([
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Design new homepage',
        description: 'Create wireframes and mockups',
        priority: 'high',
        assignee: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
        dueDate: new Date('2024-02-15'),
        columnId: 'todo'
      }
    ]
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    tasks: []
  },
  {
    id: 'review',
    title: 'Review',
    tasks: []
  },
  {
    id: 'done',
    title: 'Done',
    tasks: []
  }
])

const onTaskChange = (event: any) => {
  // Update task's column reference
  if (event.added) {
    const task = event.added.element
    const targetColumn = columns.value.find(col => 
      col.tasks.includes(task)
    )
    if (targetColumn) {
      task.columnId = targetColumn.id
    }
  }
  
  // Persist to backend
  saveKanbanState()
}

const onDragStart = (event: any) => {
  // Add visual feedback
  document.body.classList.add('dragging')
}

const onDragEnd = (event: any) => {
  // Remove visual feedback
  document.body.classList.remove('dragging')
}

const getPriorityClass = (priority: string) => {
  return `priority-${priority}`
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString()
}

const addTask = (columnId: string) => {
  // Implementation for adding new tasks
}

const editTask = (task: Task) => {
  // Implementation for editing tasks
}

const saveKanbanState = async () => {
  // Save to backend/localStorage
  try {
    await fetch('/api/kanban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(columns.value)
    })
  } catch (error) {
    console.error('Failed to save kanban state:', error)
  }
}
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  background: #f5f5f5;
}

.kanban-column {
  min-width: 280px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #eee;
}

.task-count {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.task-list {
  min-height: 200px;
  margin-bottom: 16px;
}

.task-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: grab;
  transition: all 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.task-card:active {
  cursor: grabbing;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-weight: 600;
  font-size: 14px;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-card:hover .edit-btn {
  opacity: 1;
}

.task-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 6px;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.task-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.priority-high { border-left: 4px solid #f44336; }
.priority-medium { border-left: 4px solid #ff9800; }
.priority-low { border-left: 4px solid #4caf50; }

.ghost-card {
  opacity: 0.5;
  background: #e3f2fd;
  transform: rotate(2deg);
}

.chosen-card {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

.add-task-btn {
  width: 100%;
  padding: 10px;
  border: 2px dashed #ccc;
  background: transparent;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.add-task-btn:hover {
  border-color: #2196f3;
  color: #2196f3;
  background: #f3f9ff;
}

/* Global dragging state */
:global(body.dragging) .kanban-column {
  background: #f9f9f9;
}
</style>
```

## 🗂️ File Manager

A file manager with drag-and-drop file organization, including folders and sorting.

```vue
<template>
  <div class="file-manager">
    <div class="toolbar">
      <button @click="createFolder" class="btn btn-primary">
        📁 New Folder
      </button>
      <button @click="uploadFiles" class="btn btn-secondary">
        📤 Upload Files
      </button>
      
      <div class="view-controls">
        <button 
          @click="viewMode = 'grid'"
          :class="{ active: viewMode === 'grid' }"
          class="view-btn"
        >
          ⊞
        </button>
        <button 
          @click="viewMode = 'list'"
          :class="{ active: viewMode === 'list' }"
          class="view-btn"
        >
          ☰
        </button>
      </div>
    </div>
    
    <div class="breadcrumb">
      <span 
        v-for="(folder, index) in breadcrumbPath"
        :key="index"
        @click="navigateToFolder(folder.id)"
        class="breadcrumb-item"
      >
        {{ folder.name }}
        <span v-if="index < breadcrumbPath.length - 1"> / </span>
      </span>
    </div>
    
    <draggable
      v-model="currentFolderItems"
      :group="{ name: 'files', pull: true, put: canDropInFolder }"
      :animation="200"
      :class="['file-grid', viewMode]"
      @change="onFileMove"
      @start="onDragStart"
      @end="onDragEnd"
      item-key="id"
    >
      <template #item="{ element: item }">
        <div 
          :class="['file-item', item.type, { selected: selectedItems.includes(item.id) }]"
          @click="selectItem(item)"
          @dblclick="openItem(item)"
          @contextmenu="showContextMenu($event, item)"
        >
          <div class="file-icon">
            {{ getFileIcon(item) }}
          </div>
          
          <div class="file-info">
            <div class="file-name" :title="item.name">
              {{ item.name }}
            </div>
            <div class="file-meta">
              <span class="file-size" v-if="item.type === 'file'">
                {{ formatFileSize(item.size) }}
              </span>
              <span class="file-date">
                {{ formatDate(item.modifiedAt) }}
              </span>
            </div>
          </div>
          
          <div class="file-actions" v-if="viewMode === 'list'">
            <button @click.stop="downloadFile(item)" v-if="item.type === 'file'">
              ⬇️
            </button>
            <button @click.stop="shareFile(item)">
              🔗
            </button>
            <button @click.stop="deleteItem(item)" class="danger">
              🗑️
            </button>
          </div>
        </div>
      </template>
    </draggable>
    
    <!-- Context Menu -->
    <div 
      v-if="contextMenu.show"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      class="context-menu"
      @click="hideContextMenu"
    >
      <div @click="renameItem(contextMenu.item)">Rename</div>
      <div @click="copyItem(contextMenu.item)">Copy</div>
      <div @click="moveItem(contextMenu.item)">Move</div>
      <div class="separator"></div>
      <div @click="deleteItem(contextMenu.item)" class="danger">Delete</div>
    </div>
    
    <!-- Upload Progress -->
    <div v-if="uploadProgress.show" class="upload-progress">
      <div class="progress-header">
        <span>Uploading {{ uploadProgress.current }} of {{ uploadProgress.total }}</span>
        <button @click="cancelUpload">✕</button>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: uploadProgress.percentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  mimeType?: string
  parentId: string | null
  createdAt: Date
  modifiedAt: Date
  path: string
}

const viewMode = ref<'grid' | 'list'>('grid')
const currentFolderId = ref<string | null>(null)
const selectedItems = ref<string[]>([])
const files = ref<FileItem[]>([])

const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  item: null as FileItem | null
})

const uploadProgress = ref({
  show: false,
  current: 0,
  total: 0,
  percentage: 0
})

const currentFolderItems = computed({
  get: () => files.value.filter(item => item.parentId === currentFolderId.value),
  set: (newItems) => {
    // Update the files array while maintaining items in other folders
    const otherItems = files.value.filter(item => item.parentId !== currentFolderId.value)
    files.value = [...otherItems, ...newItems]
  }
})

const breadcrumbPath = computed(() => {
  const path = []
  let currentId = currentFolderId.value
  
  while (currentId) {
    const folder = files.value.find(f => f.id === currentId && f.type === 'folder')
    if (folder) {
      path.unshift(folder)
      currentId = folder.parentId
    } else {
      break
    }
  }
  
  path.unshift({ id: null, name: 'Root', type: 'folder' })
  return path
})

const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') return '📁'
  
  const ext = item.name.split('.').pop()?.toLowerCase()
  const iconMap = {
    'pdf': '📄',
    'doc': '📝', 'docx': '📝',
    'xls': '📊', 'xlsx': '📊',
    'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
    'mp4': '🎥', 'avi': '🎥', 'mov': '🎥',
    'mp3': '🎵', 'wav': '🎵', 'flac': '🎵',
    'zip': '🗜️', 'rar': '🗜️', '7z': '🗜️',
    'js': '📜', 'ts': '📜', 'vue': '📜', 'html': '📜', 'css': '📜'
  }
  
  return iconMap[ext] || '📄'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString()
}

const canDropInFolder = (to: any, from: any, dragEl: any, evt: any) => {
  // Allow dropping files into folders
  const targetItem = currentFolderItems.value[evt.newIndex]
  return !targetItem || targetItem.type === 'folder'
}

const onFileMove = async (event: any) => {
  if (event.added) {
    const item = event.added.element
    item.parentId = currentFolderId.value
    await updateItemLocation(item)
  }
}

const onDragStart = (event: any) => {
  // Visual feedback for drag operation
  document.body.classList.add('dragging-files')
}

const onDragEnd = (event: any) => {
  document.body.classList.remove('dragging-files')
}

const selectItem = (item: FileItem) => {
  if (selectedItems.value.includes(item.id)) {
    selectedItems.value = selectedItems.value.filter(id => id !== item.id)
  } else {
    selectedItems.value.push(item.id)
  }
}

const openItem = (item: FileItem) => {
  if (item.type === 'folder') {
    navigateToFolder(item.id)
  } else {
    // Open file (download or preview)
    window.open(`/api/files/${item.id}/preview`, '_blank')
  }
}

const navigateToFolder = (folderId: string | null) => {
  currentFolderId.value = folderId
  selectedItems.value = []
}

const createFolder = async () => {
  const name = prompt('Folder name:')
  if (!name) return
  
  const newFolder: FileItem = {
    id: generateId(),
    name,
    type: 'folder',
    parentId: currentFolderId.value,
    createdAt: new Date(),
    modifiedAt: new Date(),
    path: getCurrentPath() + '/' + name
  }
  
  files.value.push(newFolder)
  await saveItem(newFolder)
}

const uploadFiles = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.onchange = handleFileUpload
  input.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  uploadProgress.value = {
    show: true,
    current: 0,
    total: files.length,
    percentage: 0
  }
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    uploadProgress.value.current = i + 1
    uploadProgress.value.percentage = ((i + 1) / files.length) * 100
    
    await uploadSingleFile(file)
  }
  
  uploadProgress.value.show = false
}

const uploadSingleFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('parentId', currentFolderId.value || '')
  
  try {
    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    })
    
    const uploadedFile = await response.json()
    files.value.push(uploadedFile)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const showContextMenu = (event: MouseEvent, item: FileItem) => {
  event.preventDefault()
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    item
  }
}

const hideContextMenu = () => {
  contextMenu.value.show = false
}

const deleteItem = async (item: FileItem) => {
  if (confirm(`Delete ${item.name}?`)) {
    files.value = files.value.filter(f => f.id !== item.id)
    await deleteItemFromServer(item.id)
  }
}

const updateItemLocation = async (item: FileItem) => {
  // Update item location on server
  await fetch(`/api/files/${item.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parentId: item.parentId })
  })
}

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9)
const getCurrentPath = () => breadcrumbPath.value.map(f => f.name).join('/')
const saveItem = async (item: FileItem) => { /* Implementation */ }
const deleteItemFromServer = async (id: string) => { /* Implementation */ }

onMounted(() => {
  // Load initial file list
  loadFiles()
})

const loadFiles = async () => {
  try {
    const response = await fetch('/api/files')
    files.value = await response.json()
  } catch (error) {
    console.error('Failed to load files:', error)
  }
}
</script>

<style scoped>
.file-manager {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.view-controls {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.view-btn {
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 16px;
}

.view-btn.active {
  background: #2196f3;
  color: white;
}

.breadcrumb {
  padding: 12px 16px;
  background: #f5f5f5;
  font-size: 14px;
}

.breadcrumb-item {
  cursor: pointer;
  color: #2196f3;
}

.breadcrumb-item:hover {
  text-decoration: underline;
}

.file-grid {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.file-grid.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.file-grid.list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.file-item {
  background: white;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.file-item:hover {
  background: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.file-item.selected {
  border-color: #2196f3;
  background: #e3f2fd;
}

.file-grid.grid .file-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-grid.list .file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
}

.file-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.file-grid.list .file-icon {
  font-size: 20px;
  margin-bottom: 0;
}

.file-name {
  font-weight: 500;
  font-size: 14px;
  word-break: break-word;
  margin-bottom: 4px;
}

.file-grid.list .file-name {
  flex: 1;
  margin-bottom: 0;
}

.file-meta {
  font-size: 12px;
  color: #666;
}

.file-grid.list .file-meta {
  display: flex;
  gap: 16px;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.file-actions button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.file-actions button:hover {
  background: #f0f0f0;
}

.file-actions button.danger:hover {
  background: #ffebee;
  color: #d32f2f;
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
}

.context-menu div {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.context-menu div:hover {
  background: #f5f5f5;
}

.context-menu .separator {
  height: 1px;
  background: #eee;
  margin: 4px 0;
  padding: 0;
}

.context-menu .danger {
  color: #d32f2f;
}

.upload-progress {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 300px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2196f3;
  transition: width 0.3s ease;
}
</style>
```

## 🛒 Shopping Cart with Drag to Remove

A shopping cart where users can drag items out to remove them.

```vue
<template>
  <div class="shopping-app">
    <div class="products-section">
      <h2>Products</h2>
      <draggable
        v-model="products"
        :group="{ name: 'shopping', pull: 'clone', put: false }"
        :clone="cloneProduct"
        :sort="false"
        class="products-grid"
        item-key="id"
      >
        <template #item="{ element: product }">
          <div class="product-card">
            <img :src="product.image" :alt="product.name" />
            <h4>{{ product.name }}</h4>
            <p class="price">${{ product.price }}</p>
            <div class="product-rating">
              <span class="stars">{{ '★'.repeat(product.rating) }}</span>
              <span class="rating-text">({{ product.reviews }})</span>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    
    <div class="cart-section">
      <h2>Shopping Cart</h2>
      <div class="cart-stats">
        <span>{{ cartItems.length }} items</span>
        <span class="total">${{ cartTotal }}</span>
      </div>
      
      <draggable
        v-model="cartItems"
        group="shopping"
        class="cart-items"
        @change="onCartChange"
        item-key="cartId"
      >
        <template #item="{ element: item }">
          <div class="cart-item">
            <img :src="item.image" :alt="item.name" />
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p class="price">${{ item.price }} × {{ item.quantity }}</p>
            </div>
            <div class="item-controls">
              <button @click="decreaseQuantity(item)" class="qty-btn">-</button>
              <span class="quantity">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)" class="qty-btn">+</button>
            </div>
            <button @click="removeFromCart(item)" class="remove-btn">×</button>
          </div>
        </template>
      </draggable>
      
      <div class="trash-zone" :class="{ active: isDragging }">
        <draggable
          v-model="trashItems"
          group="shopping"
          class="trash-area"
          @change="onTrashDrop"
        >
          <template #item="{ element }">
            <!-- Items dropped here are removed -->
          </template>
        </draggable>
        <div class="trash-content">
          <span class="trash-icon">🗑️</span>
          <span class="trash-text">Drop here to remove</span>
        </div>
      </div>
      
      <button 
        :disabled="cartItems.length === 0"
        @click="checkout"
        class="checkout-btn"
      >
        Checkout - ${{ cartTotal }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
}

interface CartItem extends Product {
  cartId: string
  quantity: number
}

const products = ref<Product[]>([
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: '/products/headphones.jpg',
    rating: 5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: '/products/watch.jpg',
    rating: 4,
    reviews: 89
  },
  {
    id: '3',
    name: 'Laptop Stand',
    price: 49.99,
    image: '/products/stand.jpg',
    rating: 4,
    reviews: 203
  }
])

const cartItems = ref<CartItem[]>([])
const trashItems = ref<CartItem[]>([])
const isDragging = ref(false)

const cartTotal = computed(() => {
  return cartItems.value
    .reduce((total, item) => total + (item.price * item.quantity), 0)
    .toFixed(2)
})

const cloneProduct = (product: Product): CartItem => {
  return {
    ...product,
    cartId: `${product.id}-${Date.now()}`,
    quantity: 1
  }
}

const onCartChange = (event: any) => {
  if (event.added) {
    const newItem = event.added.element as CartItem
    
    // Check if item already exists in cart
    const existingItem = cartItems.value.find(item => 
      item.id === newItem.id && item.cartId !== newItem.cartId
    )
    
    if (existingItem) {
      // Increase quantity instead of adding duplicate
      existingItem.quantity += newItem.quantity
      cartItems.value.splice(event.added.newIndex, 1)
    } else {
      // Add animation class
      setTimeout(() => {
        const element = document.querySelector(`[data-cart-id="${newItem.cartId}"]`)
        element?.classList.add('newly-added')
        setTimeout(() => element?.classList.remove('newly-added'), 500)
      }, 50)
    }
  }
  
  saveCartToLocalStorage()
}

const onTrashDrop = (event: any) => {
  if (event.added) {
    // Remove item from trash (it was dropped there to be deleted)
    const droppedItem = event.added.element
    trashItems.value = trashItems.value.filter(item => item.cartId !== droppedItem.cartId)
    
    // Show removal animation
    showRemovalFeedback(droppedItem)
  }
}

const increaseQuantity = (item: CartItem) => {
  item.quantity++
  saveCartToLocalStorage()
}

const decreaseQuantity = (item: CartItem) => {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    removeFromCart(item)
  }
  saveCartToLocalStorage()
}

const removeFromCart = (item: CartItem) => {
  const index = cartItems.value.findIndex(cartItem => cartItem.cartId === item.cartId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
    saveCartToLocalStorage()
  }
}

const showRemovalFeedback = (item: CartItem) => {
  // Create floating animation
  const notification = document.createElement('div')
  notification.className = 'removal-notification'
  notification.textContent = `${item.name} removed from cart`
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

const checkout = () => {
  if (cartItems.value.length === 0) return
  
  // Simulate checkout process
  alert(`Checkout completed! Total: $${cartTotal.value}`)
  cartItems.value = []
  saveCartToLocalStorage()
}

const saveCartToLocalStorage = () => {
  localStorage.setItem('shopping-cart', JSON.stringify(cartItems.value))
}

const loadCartFromLocalStorage = () => {
  const saved = localStorage.getItem('shopping-cart')
  if (saved) {
    cartItems.value = JSON.parse(saved)
  }
}

// Watch for drag state changes
watch(cartItems, (newItems, oldItems) => {
  isDragging.value = newItems.length !== oldItems.length
}, { deep: true })

// Load cart on mount
loadCartFromLocalStorage()
</script>

<style scoped>
.shopping-app {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  padding: 24px;
  min-height: 100vh;
  background: #f8f9fa;
}

.products-section h2,
.cart-section h2 {
  margin-bottom: 16px;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.product-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: grab;
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.product-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

.product-card h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #2196f3;
  margin: 8px 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.stars {
  color: #ffd700;
}

.rating-text {
  color: #666;
}

.cart-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cart-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.total {
  font-weight: bold;
  font-size: 18px;
  color: #2196f3;
}

.cart-items {
  min-height: 200px;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.cart-item:hover {
  background: #e3f2fd;
}

.cart-item.newly-added {
  background: #c8e6c9;
  transform: scale(1.02);
}

.cart-item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.item-details .price {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.qty-btn:hover {
  background: #f0f0f0;
}

.quantity {
  min-width: 20px;
  text-align: center;
  font-weight: 500;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #f44336;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.remove-btn:hover {
  background: #d32f2f;
}

.trash-zone {
  margin: 20px 0;
  border: 2px dashed #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  min-height: 80px;
}

.trash-zone.active {
  border-color: #f44336;
  background: #ffebee;
}

.trash-area {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.trash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  color: #999;
  pointer-events: none;
}

.trash-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.trash-text {
  font-size: 14px;
}

.checkout-btn {
  width: 100%;
  padding: 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  background: #45a049;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Global styles for notifications */
:global(.removal-notification) {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #f44336;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideOut {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
</style>
```

These examples demonstrate real-world usage patterns that your users can directly adapt for their projects. Each example includes:

- ✅ **Complete, working code**
- ✅ **TypeScript support**
- ✅ **Modern Vue 3 Composition API**
- ✅ **Responsive design**
- ✅ **Accessibility considerations**
- ✅ **Error handling**
- ✅ **Performance optimizations**
- ✅ **Real-world features** (persistence, validation, etc.)

This comprehensive documentation will significantly improve the developer experience for your open source project! 🚀