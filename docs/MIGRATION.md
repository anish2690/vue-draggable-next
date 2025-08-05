# Migration Guide: Vue 2 to Vue 3

This guide will help you migrate from the Vue 2 version of vue-draggable to vue-draggable-next for Vue 3.

## 📋 Quick Migration Checklist

- [ ] Update to Vue 3
- [ ] Install vue-draggable-next
- [ ] Update import statements
- [ ] Migrate to Composition API (optional)
- [ ] Update TypeScript types (if using TypeScript)
- [ ] Test drag and drop functionality

## 🔄 Package Changes

### Installation

**Before (Vue 2):**
```bash
npm install vuedraggable
```

**After (Vue 3):**
```bash
npm install vue-draggable-next
```

### Import Changes

**Before (Vue 2):**
```javascript
import draggable from 'vuedraggable'
```

**After (Vue 3):**
```javascript
import { VueDraggableNext } from 'vue-draggable-next'
// or
import { VueDraggableNext as draggable } from 'vue-draggable-next'
```

## 🎯 Component Registration

### Global Registration

**Before (Vue 2):**
```javascript
import Vue from 'vue'
import draggable from 'vuedraggable'

Vue.component('draggable', draggable)
```

**After (Vue 3):**
```javascript
import { createApp } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

const app = createApp({})
app.component('draggable', VueDraggableNext)
```

### Local Registration

**Before (Vue 2):**
```javascript
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  }
}
```

**After (Vue 3):**
```javascript
import { VueDraggableNext } from 'vue-draggable-next'

export default {
  components: {
    draggable: VueDraggableNext
  }
}
```

## 🏗️ Template Syntax

### Basic Usage (No Changes Required)

The basic template syntax remains the same:

```vue
<template>
  <draggable v-model="list" @change="onChange">
    <div v-for="item in list" :key="item.id">
      {{ item.name }}
    </div>
  </draggable>
</template>
```

### Enhanced Performance (Recommended)

For better performance in Vue 3, use the item-key prop:

**Vue 3 Enhanced:**
```vue
<template>
  <draggable v-model="list" item-key="id" @change="onChange">
    <template #item="{ element }">
      <div>{{ element.name }}</div>
    </template>
  </draggable>
</template>
```

## 🔧 Script Changes

### Options API Migration

**Before (Vue 2):**
```vue
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      list: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]
    }
  },
  methods: {
    onChange(event) {
      console.log('Changed:', event)
    }
  }
}
</script>
```

**After (Vue 3 - Options API):**
```vue
<script>
import { VueDraggableNext } from 'vue-draggable-next'

export default {
  components: {
    draggable: VueDraggableNext
  },
  data() {
    return {
      list: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]
    }
  },
  methods: {
    onChange(event) {
      console.log('Changed:', event)
    }
  }
}
</script>
```

### Composition API Migration

**Vue 3 - Composition API:**
```vue
<script setup>
import { ref } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const list = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
])

const onChange = (event) => {
  console.log('Changed:', event)
}
</script>
```

## 📝 TypeScript Migration

### Type Definitions

**Before (Vue 2):**
```typescript
// Limited TypeScript support
import draggable from 'vuedraggable'
```

**After (Vue 3):**
```typescript
// Full TypeScript support with built-in types
import { VueDraggableNext } from 'vue-draggable-next'
import type { 
  DragChangeEvent, 
  SortableEvent 
} from 'vue-draggable-next'

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

const list = ref<TodoItem[]>([])

const onChange = (event: DragChangeEvent<TodoItem>) => {
  // Full type safety
}
```

## 🎛️ Props and Events

### Props Changes

Most props remain the same. Here are the key differences:

| Vue 2 | Vue 3 | Notes |
|-------|-------|-------|
| `value` | `modelValue` | Used with v-model |
| `options` | Individual props | Pass options as individual props |

**Before (Vue 2):**
```vue
<draggable 
  v-model="list"
  :options="{ animation: 150, group: 'people' }"
>
```

**After (Vue 3):**
```vue
<draggable 
  v-model="list"
  :animation="150"
  group="people"
>
```

### Events (No Changes)

All events remain the same:
- `@start`, `@end`, `@add`, `@remove`, `@update`, `@change`, etc.

## 🔧 Advanced Features

### Custom Components

**Before (Vue 2):**
```vue
<draggable 
  v-model="list"
  component="transition-group"
  :componentData="{ props: { name: 'fade' } }"
>
```

**After (Vue 3):**
```vue
<draggable 
  v-model="list"
  tag="transition-group"
  :component-data="{ 
    tag: 'div',
    name: 'fade',
    type: 'transition'
  }"
>
```

### Clone Function

**Before (Vue 2):**
```javascript
methods: {
  cloneItem(original) {
    return { ...original, id: Date.now() }
  }
}
```

**After (Vue 3 - Composition API):**
```javascript
const cloneItem = (original) => {
  return { ...original, id: Date.now() }
}
```

## 🐛 Common Migration Issues

### 1. Import Errors

**Error:**
```
Module not found: Can't resolve 'vuedraggable'
```

**Solution:**
Update package and import:
```bash
npm uninstall vuedraggable
npm install vue-draggable-next
```

```javascript
// Change this
import draggable from 'vuedraggable'

// To this
import { VueDraggableNext as draggable } from 'vue-draggable-next'
```

### 2. Component Registration

**Error:**
```
Failed to resolve component: draggable
```

**Solution:**
Update component registration:
```javascript
// Options API
components: {
  draggable: VueDraggableNext
}

// Or Composition API with script setup - no registration needed
import { VueDraggableNext as draggable } from 'vue-draggable-next'
```

### 3. TypeScript Errors

**Error:**
```
Property 'xxx' does not exist on type
```

**Solution:**
Use proper TypeScript imports:
```typescript
import type { DragChangeEvent } from 'vue-draggable-next'
```

### 4. Performance Issues

**Issue:** Slower performance with large lists

**Solution:** Use item-key prop:
```vue
<draggable v-model="list" item-key="id">
  <template #item="{ element }">
    <div>{{ element.name }}</div>
  </template>
</draggable>
```

## 📊 Performance Improvements

Vue 3 version includes several performance improvements:

1. **Better reactivity system**: More efficient updates
2. **Item tracking**: Use `item-key` for better performance
3. **Tree shaking**: Smaller bundle size
4. **TypeScript**: Better development experience

## 🧪 Testing Migration

### Unit Tests

**Before (Vue 2):**
```javascript
import { mount } from '@vue/test-utils'
import draggable from 'vuedraggable'

const wrapper = mount(draggable, {
  propsData: {
    value: []
  }
})
```

**After (Vue 3):**
```javascript
import { mount } from '@vue/test-utils'
import { VueDraggableNext } from 'vue-draggable-next'

const wrapper = mount(VueDraggableNext, {
  props: {
    modelValue: []
  }
})
```

## 🎯 Best Practices for Vue 3

1. **Use Composition API**: Better logic reuse and TypeScript support
2. **Use item-key prop**: Better performance and fewer re-renders
3. **Leverage TypeScript**: Full type safety
4. **Use script setup**: Cleaner component syntax
5. **Optimize large lists**: Consider virtual scrolling for 1000+ items

## 📚 Additional Resources

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript with Vue 3](https://vuejs.org/guide/typescript/overview.html)

## 🆘 Getting Help

If you encounter issues during migration:

1. Check the [troubleshooting section](../README.md#troubleshooting) in the main README
2. Search [existing issues](https://github.com/anish2690/vue-draggable-next/issues)
3. Create a new issue with a minimal reproduction case
4. Join our community discussions

Happy migrating! 🚀