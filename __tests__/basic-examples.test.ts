/**
 * @jest-environment jsdom
 */
import { VueWrapper, mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

import { VueDraggableNext } from '../src'

// Mock Sortable.js
jest.mock('sortablejs', () => {
  const mockSortable = {
    create: jest.fn(() => ({
      option: jest.fn(),
      destroy: jest.fn(),
      toArray: jest.fn(() => []),
      sort: jest.fn(),
      save: jest.fn(),
      closest: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    })),
  }
  return mockSortable
})

interface TestItem {
  id: number
  name: string
}

describe('Basic README Examples', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Composition API Example', () => {
    it('should render basic composition API example correctly', async () => {
      const TestComponent = {
        template: `
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
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const list = ref<TestItem[]>([
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 3, name: 'Bob' },
          ])

          const onListChange = jest.fn()

          return { list, onListChange }
        },
      }

      const wrapper = mount(TestComponent)

      // Check if items are rendered
      expect(wrapper.findAll('.drag-item')).toHaveLength(3)
      expect(wrapper.text()).toContain('John')
      expect(wrapper.text()).toContain('Jane')
      expect(wrapper.text()).toContain('Bob')

      // Check if VueDraggableNext component is present
      expect(wrapper.findComponent(VueDraggableNext).exists()).toBe(true)
    })

    it('should update list when modelValue changes', async () => {
      const TestComponent = {
        template: `
          <draggable v-model="list" item-key="id">
            <template #item="{ element }">
              <div class="item">{{ element.name }}</div>
            </template>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const list = ref<TestItem[]>([{ id: 1, name: 'Item 1' }])
          return { list }
        },
      }

      const wrapper = mount(TestComponent)

      // Initial state
      expect(wrapper.findAll('.item')).toHaveLength(1)
      expect(wrapper.text()).toContain('Item 1')

      // Update list
      const vm = wrapper.vm as any
      vm.list.push({ id: 2, name: 'Item 2' })

      await nextTick()

      expect(wrapper.findAll('.item')).toHaveLength(2)
      expect(wrapper.text()).toContain('Item 2')
    })
  })

  describe('Options API Example', () => {
    it('should render options API example correctly', async () => {
      const TestComponent = {
        template: `
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
        `,
        components: { draggable: VueDraggableNext },
        data() {
          return {
            list: [
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' },
              { id: 3, name: 'Item 3' },
            ],
          }
        },
        methods: {
          handleChange: jest.fn(),
        },
      }

      const wrapper = mount(TestComponent)

      // Check rendering
      expect(wrapper.findAll('.drag-item')).toHaveLength(3)
      expect(wrapper.find('.drag-area').exists()).toBe(true)

      // Check content
      const items = wrapper.findAll('.drag-item')
      expect(items[0].text()).toBe('Item 1')
      expect(items[1].text()).toBe('Item 2')
      expect(items[2].text()).toBe('Item 3')
    })

    it('should handle list mutations', async () => {
      const TestComponent = {
        template: `
          <draggable :list="list">
            <div v-for="item in list" :key="item.id">{{ item.name }}</div>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        data() {
          return {
            list: [{ id: 1, name: 'Original' }],
          }
        },
      }

      const wrapper = mount(TestComponent)

      // Initial state
      expect(wrapper.text()).toContain('Original')

      // Mutate list directly (as would happen with drag operations)
      const vm = wrapper.vm as any
      vm.list.push({ id: 2, name: 'Added' })

      await nextTick()

      expect(wrapper.text()).toContain('Added')
    })
  })

  describe('Props and Events', () => {
    it('should pass through sortable options as props', () => {
      const TestComponent = {
        template: `
          <draggable
            v-model="list"
            :animation="300"
            ghost-class="ghost"
            chosen-class="chosen"
            :disabled="false"
            group="test-group"
          >
            <div v-for="item in list" :key="item.id">{{ item.name }}</div>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const list = ref([{ id: 1, name: 'Test' }])
          return { list }
        },
      }

      const wrapper = mount(TestComponent)
      const draggableComponent = wrapper.findComponent(VueDraggableNext)

      expect(draggableComponent.props('animation')).toBe(300)
      expect(draggableComponent.props('ghostClass')).toBe('ghost')
      expect(draggableComponent.props('chosenClass')).toBe('chosen')
      expect(draggableComponent.props('disabled')).toBe(false)
      expect(draggableComponent.props('group')).toBe('test-group')
    })

    it('should emit change events', async () => {
      const changeHandler = jest.fn()

      const TestComponent = {
        template: `
          <draggable v-model="list" @change="onChange">
            <div v-for="item in list" :key="item.id">{{ item.name }}</div>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const list = ref([{ id: 1, name: 'Test' }])
          return { list, onChange: changeHandler }
        },
      }

      const wrapper = mount(TestComponent)
      const draggableComponent = wrapper.findComponent(VueDraggableNext)

      // Simulate a change event
      await draggableComponent.vm.$emit('change', {
        added: { newIndex: 0, element: { id: 2, name: 'New Item' } },
      })

      expect(changeHandler).toHaveBeenCalledWith({
        added: { newIndex: 0, element: { id: 2, name: 'New Item' } },
      })
    })

    it('should handle start and end events', async () => {
      const startHandler = jest.fn()
      const endHandler = jest.fn()

      const TestComponent = {
        template: `
          <draggable 
            v-model="list" 
            @start="onStart"
            @end="onEnd"
          >
            <div v-for="item in list" :key="item.id">{{ item.name }}</div>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const list = ref([{ id: 1, name: 'Test' }])
          return { list, onStart: startHandler, onEnd: endHandler }
        },
      }

      const wrapper = mount(TestComponent)
      const draggableComponent = wrapper.findComponent(VueDraggableNext)

      // Simulate drag events
      await draggableComponent.vm.$emit('start', { item: {} })
      await draggableComponent.vm.$emit('end', { item: {} })

      expect(startHandler).toHaveBeenCalled()
      expect(endHandler).toHaveBeenCalled()
    })
  })

  describe('Multiple Lists Example', () => {
    it('should handle multiple draggable lists with same group', async () => {
      const TestComponent = {
        template: `
          <div>
            <draggable 
              v-model="todoList"
              group="tasks"
              class="todo-list"
            >
              <div v-for="item in todoList" :key="item.id" class="todo-item">
                {{ item.text }}
              </div>
            </draggable>
            
            <draggable 
              v-model="doneList"
              group="tasks"
              class="done-list"
            >
              <div v-for="item in doneList" :key="item.id" class="done-item">
                {{ item.text }}
              </div>
            </draggable>
          </div>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const todoList = ref([
            { id: 1, text: 'Learn Vue 3' },
            { id: 2, text: 'Build app' },
          ])

          const doneList = ref([{ id: 3, text: 'Read docs' }])

          return { todoList, doneList }
        },
      }

      const wrapper = mount(TestComponent)

      // Check both lists are rendered
      expect(wrapper.find('.todo-list').exists()).toBe(true)
      expect(wrapper.find('.done-list').exists()).toBe(true)

      // Check items count
      expect(wrapper.findAll('.todo-item')).toHaveLength(2)
      expect(wrapper.findAll('.done-item')).toHaveLength(1)

      // Check both draggable components have same group
      const draggableComponents = wrapper.findAllComponents(VueDraggableNext)
      expect(draggableComponents).toHaveLength(2)
      expect(draggableComponents[0].props('group')).toBe('tasks')
      expect(draggableComponents[1].props('group')).toBe('tasks')
    })
  })

  describe('Custom Handle Example', () => {
    it('should render handle correctly', () => {
      const TestComponent = {
        template: `
          <draggable 
            v-model="list"
            handle=".drag-handle"
          >
            <div v-for="item in list" :key="item.id" class="item-with-handle">
              <span class="drag-handle">⋮⋮</span>
              <span class="item-content">{{ item.name }}</span>
            </div>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const list = ref([
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
          ])
          return { list }
        },
      }

      const wrapper = mount(TestComponent)

      // Check handle prop is passed
      expect(wrapper.findComponent(VueDraggableNext).props('handle')).toBe(
        '.drag-handle'
      )

      // Check handles are rendered
      expect(wrapper.findAll('.drag-handle')).toHaveLength(2)
      expect(wrapper.findAll('.item-content')).toHaveLength(2)
    })
  })

  describe('TypeScript Usage', () => {
    interface TodoItem {
      id: number
      text: string
      completed: boolean
    }

    it('should work with TypeScript interfaces', () => {
      const TestComponent = {
        template: `
          <draggable v-model="items" item-key="id">
            <template #item="{ element }">
              <div class="todo-item">
                <input v-model="element.completed" type="checkbox">
                <span :class="{ done: element.completed }">{{ element.text }}</span>
              </div>
            </template>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const items = ref<TodoItem[]>([
            { id: 1, text: 'Learn TypeScript', completed: false },
            { id: 2, text: 'Build Vue app', completed: true },
          ])
          return { items }
        },
      }

      const wrapper = mount(TestComponent)

      expect(wrapper.findAll('.todo-item')).toHaveLength(2)

      // Check checkboxes
      const checkboxes = wrapper.findAll('input[type="checkbox"]')
      expect(checkboxes).toHaveLength(2)
      expect(checkboxes[1].element.checked).toBe(true) // Second item is completed

      // Check text content
      expect(wrapper.text()).toContain('Learn TypeScript')
      expect(wrapper.text()).toContain('Build Vue app')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty lists', () => {
      const TestComponent = {
        template: `
          <draggable v-model="list">
            <div v-for="item in list" :key="item.id">{{ item.name }}</div>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const list = ref([])
          return { list }
        },
      }

      const wrapper = mount(TestComponent)
      expect(wrapper.findComponent(VueDraggableNext).exists()).toBe(true)
      expect(wrapper.findAll('div').length).toBe(1) // Only the draggable container
    })

    it('should handle null/undefined list gracefully', () => {
      const TestComponent = {
        template: `<draggable :list="list" />`,
        components: { draggable: VueDraggableNext },
        data() {
          return { list: null }
        },
      }

      expect(() => mount(TestComponent)).not.toThrow()
    })

    it('should work with different HTML tags', () => {
      const TestComponent = {
        template: `
          <draggable v-model="list" tag="ul">
            <li v-for="item in list" :key="item.id">{{ item.name }}</li>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const list = ref([{ id: 1, name: 'Test' }])
          return { list }
        },
      }

      const wrapper = mount(TestComponent)

      // Should render as ul
      expect(wrapper.find('ul').exists()).toBe(true)
      expect(wrapper.find('li').exists()).toBe(true)
      expect(wrapper.findComponent(VueDraggableNext).props('tag')).toBe('ul')
    })
  })
})
