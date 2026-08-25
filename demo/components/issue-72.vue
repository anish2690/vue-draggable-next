<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Issue #72: Elements shift incorrectly on async list updates</h1>
    
    <div class="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h2 class="font-semibold mb-2">Bug Description:</h2>
      <p class="text-sm">After upgrading from 2.2.1 to 2.3.0, list items shift incorrectly when using v-if on VueDraggableNext together with group and sort: false.</p>
      <p class="text-sm mt-2">This component simulates async list updates (like from an API call) that trigger the bug.</p>
    </div>

    <div class="mb-4">
      <button 
        @click="triggerAsyncUpdate" 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        :disabled="loading"
      >
        {{ loading ? 'Loading...' : 'Trigger Async Update (Reproduce Bug)' }}
      </button>
      <button 
        @click="resetList" 
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Reset
      </button>
    </div>

    <div class="mb-4 text-sm">
      <p><strong>isShown:</strong> {{ isShown }}</p>
      <p><strong>Items count:</strong> {{ items.length }}</p>
    </div>

    <div class="app-container">
      <div class="columns-container flex gap-4">
        <div class="column flex-1 border-2 border-gray-300 p-4 rounded">
          <h2 class="text-xl font-semibold mb-3">Done</h2>
          <VueDraggableNext
            v-if="isShown"
            v-model="items"
            class="draggable-list min-h-[200px] bg-gray-50 p-2 rounded"
            v-bind="{ group: 'test', sort: false }"
          >
            <div
              v-for="item in items"
              :key="item.id"
              class="task-item bg-white border border-gray-200 rounded p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
            >
              <h3 class="font-medium">{{ item.name }}</h3>
              <p class="text-xs text-gray-500">ID: {{ item.id }}</p>
            </div>
          </VueDraggableNext>
          <div v-else class="text-gray-400 italic">Loading...</div>
        </div>

        <div class="column flex-1 border-2 border-gray-300 p-4 rounded">
          <h2 class="text-xl font-semibold mb-3">In Progress</h2>
          <VueDraggableNext
            v-if="isShown"
            v-model="inProgressItems"
            class="draggable-list min-h-[200px] bg-gray-50 p-2 rounded"
            v-bind="{ group: 'test', sort: false }"
          >
            <div
              v-for="item in inProgressItems"
              :key="item.id"
              class="task-item bg-white border border-gray-200 rounded p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
            >
              <h3 class="font-medium">{{ item.name }}</h3>
              <p class="text-xs text-gray-500">ID: {{ item.id }}</p>
            </div>
          </VueDraggableNext>
          <div v-else class="text-gray-400 italic">Loading...</div>
        </div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">Debug Info:</h3>
      <div class="text-xs">
        <p><strong>Done Items:</strong></p>
        <pre class="bg-white p-2 rounded mt-1 overflow-auto">{{ JSON.stringify(items, null, 2) }}</pre>
        <p class="mt-2"><strong>In Progress Items:</strong></p>
        <pre class="bg-white p-2 rounded mt-1 overflow-auto">{{ JSON.stringify(inProgressItems, null, 2) }}</pre>
      </div>
    </div>

    <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
      <h3 class="font-semibold mb-2">How to test:</h3>
      <ol class="list-decimal list-inside space-y-1">
        <li>Click "Trigger Async Update" button</li>
        <li>Watch the items list - items should load in order (Task 1, Task 2, ... Task 15)</li>
        <li>If the bug is present, items will appear in incorrect order or shift around</li>
        <li>Try dragging items between the two columns</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import { VueDraggableNext } from '/@'

const isShown = ref(true)
const items = ref<Array<{ id: number; name: string }>>([])
const inProgressItems = ref<Array<{ id: number; name: string }>>([])
const loading = ref(false)

// This function reproduces the exact scenario from the issue
function triggerAsyncUpdate() {
  loading.value = true
  
  // Step 1: Hide the draggable component
  setTimeout(() => {
    isShown.value = false
    // Step 2: Update the items array (simulating API call)
    items.value = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Task ${i + 1}`
    }))
  }, 10)

  // Step 3: Show the draggable component again
  setTimeout(() => {
    isShown.value = true
    loading.value = false
  }, 15)
}

function resetList() {
  items.value = []
  inProgressItems.value = []
  isShown.value = true
  loading.value = false
}
</script>

<style scoped>
.app-container {
  width: 100%;
}

.columns-container {
  display: flex;
  gap: 1rem;
}

.column {
  flex: 1;
}

.draggable-list {
  min-height: 200px;
}

.task-item {
  user-select: none;
}
</style>

