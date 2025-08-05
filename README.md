# vue-draggable-next

[![npm version](https://badge.fury.io/js/vue-draggable-next.svg)](https://badge.fury.io/js/vue-draggable-next)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

🎯 **Vue 3 drag-and-drop component based on Sortable.js**

✨ **Features:**
- 🚀 Vue 3 Composition API support
- 📱 Touch-friendly (mobile support)
- 🎨 No CSS framework dependency
- 📦 TypeScript definitions included
- ⚡ Lightweight (~7kb gzipped)
- 🔧 All Sortable.js options supported

[📚 **Live Demo & Playground**](https://vue-draggable-next.vercel.app/) | [📖 **Migration Guide**](#-migration-from-vue-2) | [🎯 **Examples**](#-examples)

## 📦 Installation

```bash
# npm
npm install vue-draggable-next

# yarn  
yarn add vue-draggable-next

# pnpm
pnpm add vue-draggable-next
```

## 🚀 Quick Start

### Basic Example (Composition API)

```vue
<template>
  <div class="drag-container">
    <draggable 
      v-model="list" 
      group="people" 
      @change="onListChange"
      item-key="id"
    >
      <template #item="{ element }">
        <div class="drag-item">
          {{ element.name }}
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

// Define the item type
interface Person {
  id: number
  name: string
}

// Reactive list
const list = ref<Person[]>([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' }
])

// Handle changes
const onListChange = (event: any) => {
  console.log('List changed:', event)
}
</script>

<style scoped>
.drag-container {
  min-height: 200px;
  padding: 20px;
}

.drag-item {
  padding: 10px;
  margin: 5px 0;
  background: #f0f0f0;
  border-radius: 4px;
  cursor: move;
  transition: background 0.2s;
}

.drag-item:hover {
  background: #e0e0e0;
}
</style>
```

### Options API Example

```vue
<template>
  <draggable 
    :list="list" 
    class="drag-area"
    @change="handleChange"
  >
    <div 
      v-for="element in list"
      :key="element.id"
      class="drag-item"
    >
      {{ element.name }}
    </div>
  </draggable>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  components: {
    draggable: VueDraggableNext
  },
  data() {
    return {
      list: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]
    }
  },
  methods: {
    handleChange(event: any) {
      console.log('Changed:', event)
    }
  }
})
</script>
```

## 📖 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Array` | `[]` | Array to be synchronized with drag-and-drop (use with v-model) |
| `list` | `Array` | `[]` | Alternative to modelValue, directly mutates the array |
| `itemKey` | `String\|Function` | `undefined` | Key to use for tracking items (recommended for better performance) |
| `tag` | `String` | `'div'` | HTML tag for the root element |
| `component` | `String` | `null` | Vue component name to use as root element |
| `componentData` | `Object` | `null` | Props/attrs to pass to the component |
| `clone` | `Function` | `(item) => item` | Function to clone items when dragging |
| `move` | `Function` | `null` | Function to control move operations |
| `group` | `String\|Object` | `undefined` | Sortable group options |
| `sort` | `Boolean` | `true` | Enable sorting within the list |
| `disabled` | `Boolean` | `false` | Disable drag and drop |
| `animation` | `Number` | `0` | Animation speed (ms) |
| `ghostClass` | `String` | `''` | CSS class for the ghost element |
| `chosenClass` | `String` | `''` | CSS class for the chosen element |
| `dragClass` | `String` | `''` | CSS class for the dragging element |

### Events

| Event | Description | Payload |
|-------|-------------|---------|
| `@change` | Fired when the list changes | `{ added?, removed?, moved? }` |
| `@start` | Dragging started | `SortableEvent` |
| `@end` | Dragging ended | `SortableEvent` |
| `@add` | Item added from another list | `SortableEvent` |
| `@remove` | Item removed to another list | `SortableEvent` |
| `@update` | Item order changed | `SortableEvent` |
| `@sort` | Any change to the list | `SortableEvent` |
| `@choose` | Item is chosen | `SortableEvent` |
| `@unchoose` | Item is unchosen | `SortableEvent` |

## 🎯 Examples

### 1. Between Multiple Lists

```vue
<template>
  <div class="lists-container">
    <div class="list-column">
      <h3>Todo</h3>
      <draggable 
        v-model="todoList"
        group="tasks"
        class="drag-area"
        :animation="150"
      >
        <div 
          v-for="item in todoList"
          :key="item.id"
          class="task-item"
        >
          {{ item.text }}
        </div>
      </draggable>
    </div>
    
    <div class="list-column">
      <h3>Done</h3>
      <draggable 
        v-model="doneList"
        group="tasks"
        class="drag-area"
        :animation="150"
      >
        <div 
          v-for="item in doneList"
          :key="item.id"
          class="task-item done"
        >
          {{ item.text }}
        </div>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const todoList = ref([
  { id: 1, text: 'Learn Vue 3' },
  { id: 2, text: 'Build awesome apps' }
])

const doneList = ref([
  { id: 3, text: 'Read documentation' }
])
</script>
```

### 2. With Custom Handle

```vue
<template>
  <draggable 
    v-model="list"
    handle=".drag-handle"
    :animation="200"
  >
    <div 
      v-for="item in list"
      :key="item.id"
      class="item-with-handle"
    >
      <span class="drag-handle">⋮⋮</span>
      <span class="item-content">{{ item.name }}</span>
      <button @click="deleteItem(item.id)">Delete</button>
    </div>
  </draggable>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const list = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
])

const deleteItem = (id) => {
  const index = list.value.findIndex(item => item.id === id)
  if (index > -1) {
    list.value.splice(index, 1)
  }
}
</script>

<style scoped>
.item-with-handle {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.drag-handle {
  cursor: grab;
  margin-right: 10px;
  color: #999;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.item-content {
  flex: 1;
}
</style>
```

### 3. With Transitions

```vue
<template>
  <draggable 
    v-model="list"
    tag="transition-group"
    :component-data="{
      tag: 'div',
      type: 'transition',
      name: 'fade'
    }"
    :animation="200"
  >
    <div 
      v-for="item in list"
      :key="item.id"
      class="fade-item"
    >
      {{ item.text }}
    </div>
  </draggable>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const list = ref([
  { id: 1, text: 'Smooth transition' },
  { id: 2, text: 'On drag and drop' }
])
</script>

<style scoped>
.fade-item {
  padding: 15px;
  margin: 8px 0;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

### 4. TypeScript Usage

```typescript
// types.ts
export interface DraggableItem {
  id: string | number
  [key: string]: any
}

export interface DragChangeEvent<T = DraggableItem> {
  added?: {
    newIndex: number
    element: T
  }
  removed?: {
    oldIndex: number
    element: T
  }
  moved?: {
    newIndex: number
    oldIndex: number
    element: T
  }
}
```

```vue
<template>
  <draggable 
    v-model="items"
    @change="onListChange"
    item-key="id"
  >
    <template #item="{ element }: { element: TodoItem }">
      <div class="todo-item">
        <input 
          v-model="element.completed"
          type="checkbox"
        >
        <span :class="{ done: element.completed }">
          {{ element.text }}
        </span>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import type { DragChangeEvent } from './types'

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

const items = ref<TodoItem[]>([
  { id: 1, text: 'Learn TypeScript', completed: false },
  { id: 2, text: 'Build Vue 3 app', completed: true }
])

const onListChange = (event: DragChangeEvent<TodoItem>) => {
  if (event.added) {
    console.log('Added item:', event.added.element)
  }
  if (event.removed) {
    console.log('Removed item:', event.removed.element)
  }
  if (event.moved) {
    console.log('Moved item:', event.moved.element)
  }
}
</script>
```

## 🔧 Advanced Usage

### Custom Clone Function

```vue
<script setup>
import { ref } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const sourceList = ref([
  { id: 1, name: 'Template Item', color: 'blue' }
])

const targetList = ref([])

// Deep clone function for complex objects
const cloneItem = (original) => {
  return {
    ...original,
    id: Date.now(), // Generate new ID
    name: `Copy of ${original.name}`
  }
}
</script>

<template>
  <div class="clone-demo">
    <div class="source">
      <h3>Source (Clone)</h3>
      <draggable 
        v-model="sourceList"
        :group="{ name: 'shared', pull: 'clone', put: false }"
        :clone="cloneItem"
        :sort="false"
      >
        <div v-for="item in sourceList" :key="item.id">
          {{ item.name }}
        </div>
      </draggable>
    </div>
    
    <div class="target">
      <h3>Target</h3>
      <draggable 
        v-model="targetList"
        group="shared"
      >
        <div v-for="item in targetList" :key="item.id">
          {{ item.name }}
        </div>
      </draggable>
    </div>
  </div>
</template>
```

### Conditional Move

```vue
<script setup>
import { ref } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const list = ref([
  { id: 1, name: 'Movable item', locked: false },
  { id: 2, name: 'Locked item', locked: true },
  { id: 3, name: 'Another movable', locked: false }
])

// Prevent moving locked items
const checkMove = (event) => {
  // Don't allow moving locked items
  if (event.draggedContext.element.locked) {
    return false
  }
  
  // Don't allow dropping on locked items
  if (event.relatedContext.element?.locked) {
    return false
  }
  
  return true
}
</script>

<template>
  <draggable 
    v-model="list"
    :move="checkMove"
  >
    <div 
      v-for="item in list"
      :key="item.id"
      :class="{ locked: item.locked }"
      class="move-item"
    >
      {{ item.name }}
      <span v-if="item.locked">🔒</span>
    </div>
  </draggable>
</template>

<style scoped>
.move-item.locked {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

## 🔄 Migration from Vue 2

If you're migrating from the Vue 2 version, here are the key changes:

### Before (Vue 2)
```vue
<draggable v-model="list" @end="onEnd">
  <div v-for="item in list" :key="item.id">
    {{ item.name }}
  </div>
</draggable>
```

### After (Vue 3)
```vue
<!-- Option 1: Using item-key prop (recommended) -->
<draggable v-model="list" item-key="id" @end="onEnd">
  <template #item="{ element }">
    <div>{{ element.name }}</div>
  </template>
</draggable>

<!-- Option 2: Traditional approach (still works) -->
<draggable v-model="list" @end="onEnd">
  <div v-for="item in list" :key="item.id">
    {{ item.name }}
  </div>
</draggable>
```

### Breaking Changes
- **Vue 3 required**: This package only works with Vue 3
- **Composition API**: Full support for `<script setup>` syntax
- **TypeScript**: Built-in TypeScript definitions
- **Performance**: Better performance with item-key prop

## 🎨 Styling & Customization

### Ghost Element Styling

```css
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  border: 2px dashed #2196f3;
}

.chosen {
  transform: rotate(5deg);
}

.drag {
  transform: rotate(0deg);
}
```

### Smooth Animations

```vue
<draggable 
  v-model="list"
  :animation="300"
  easing="cubic-bezier(0.4, 0, 0.2, 1)"
  ghost-class="ghost"
  chosen-class="chosen"
  drag-class="drag"
>
  <!-- items -->
</draggable>
```

## 🔍 Troubleshooting

### Common Issues

1. **Items not dragging**: Check if `disabled` prop is false and items have unique keys
2. **Performance issues**: Use `item-key` prop for better tracking
3. **Touch not working**: Ensure touch-action CSS is not preventing touch events
4. **Transitions glitching**: Use `tag="transition-group"` with proper transition classes

### Debug Mode

```vue
<draggable 
  v-model="list"
  @start="console.log('Drag started', $event)"
  @end="console.log('Drag ended', $event)"
  @change="console.log('List changed', $event)"
>
  <!-- items -->
</draggable>
```

## 📱 Mobile Support

The component works out of the box on mobile devices. For better mobile experience:

```css
.drag-item {
  /* Prevent text selection during drag */
  user-select: none;
  -webkit-user-select: none;
  
  /* Better touch targets */
  min-height: 44px;
  
  /* Smooth feedback */
  transition: transform 0.2s ease;
}

.drag-item:active {
  transform: scale(1.02);
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/anish2690/vue-draggable-next.git

# Install dependencies
npm install

# Run development server
npm run playground:dev

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

[MIT License](LICENSE)

## 🌟 Credits

This project is heavily inspired by [SortableJS/Vue.Draggable](https://github.com/SortableJS/Vue.Draggable) and built on top of [SortableJS](https://github.com/SortableJS/Sortable).

## 🙏 Support

If this project helps you, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing code

---

**Made with ❤️ for the Vue.js community**