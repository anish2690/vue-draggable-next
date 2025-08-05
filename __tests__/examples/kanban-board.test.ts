import { nextTick, ref } from 'vue'

import { VueDraggableNext } from '../../src'
/**
 * @jest-environment jsdom
 */
import { mount } from '@vue/test-utils'

// Mock Sortable.js
jest.mock('sortablejs', () => ({
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
}))

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

describe('Kanban Board Example', () => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    avatar: '/avatars/john.jpg',
  }

  const mockTask: Task = {
    id: '1',
    title: 'Design homepage',
    description: 'Create wireframes',
    priority: 'high',
    assignee: mockUser,
    dueDate: new Date('2024-02-15'),
    columnId: 'todo',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock fetch for saveKanbanState
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })
  })

  it('should render kanban board with columns', () => {
    const KanbanBoard = {
      template: `
        <div class="kanban-board">
          <div 
            v-for="column in columns" 
            :key="column.id"
            class="kanban-column"
            :data-testid="'column-' + column.id"
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
              class="task-list"
              item-key="id"
              @change="onTaskChange"
            >
              <template #item="{ element: task }">
                <div class="task-card" :data-testid="'task-' + task.id">
                  <div class="task-title">{{ task.title }}</div>
                  <p class="task-description">{{ task.description }}</p>
                  <div class="task-priority priority-${task.priority}">
                    {{ task.priority }}
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const columns = ref<Column[]>([
          {
            id: 'todo',
            title: 'To Do',
            tasks: [mockTask],
          },
          {
            id: 'inprogress',
            title: 'In Progress',
            tasks: [],
          },
          {
            id: 'done',
            title: 'Done',
            tasks: [],
          },
        ])

        const onTaskChange = jest.fn()

        return { columns, onTaskChange }
      },
    }

    const wrapper = mount(KanbanBoard)

    // Check columns are rendered
    expect(wrapper.find('[data-testid="column-todo"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="column-inprogress"]').exists()).toBe(
      true
    )
    expect(wrapper.find('[data-testid="column-done"]').exists()).toBe(true)

    // Check column titles
    expect(wrapper.text()).toContain('To Do')
    expect(wrapper.text()).toContain('In Progress')
    expect(wrapper.text()).toContain('Done')

    // Check task count
    expect(wrapper.find('[data-testid="column-todo"] .task-count').text()).toBe(
      '1'
    )
    expect(
      wrapper.find('[data-testid="column-inprogress"] .task-count').text()
    ).toBe('0')

    // Check task is rendered
    expect(wrapper.find('[data-testid="task-1"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Design homepage')
    expect(wrapper.text()).toContain('Create wireframes')
  })

  it('should handle task priority classes', () => {
    const TaskCard = {
      template: `
        <div class="task-card" :class="getPriorityClass(task.priority)">
          <span class="priority">{{ task.priority }}</span>
        </div>
      `,
      props: ['task'],
      setup() {
        const getPriorityClass = (priority: string) => `priority-${priority}`
        return { getPriorityClass }
      },
    }

    const highPriorityTask = { ...mockTask, priority: 'high' as const }
    const mediumPriorityTask = { ...mockTask, priority: 'medium' as const }
    const lowPriorityTask = { ...mockTask, priority: 'low' as const }

    const highWrapper = mount(TaskCard, { props: { task: highPriorityTask } })
    const mediumWrapper = mount(TaskCard, {
      props: { task: mediumPriorityTask },
    })
    const lowWrapper = mount(TaskCard, { props: { task: lowPriorityTask } })

    expect(highWrapper.classes()).toContain('priority-high')
    expect(mediumWrapper.classes()).toContain('priority-medium')
    expect(lowWrapper.classes()).toContain('priority-low')
  })

  it('should emit change events when tasks are moved', async () => {
    const changeHandler = jest.fn()

    const TestComponent = {
      template: `
        <draggable
          v-model="tasks"
          group="kanban"
          @change="onChange"
          item-key="id"
        >
          <template #item="{ element: task }">
            <div>{{ task.title }}</div>
          </template>
        </draggable>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const tasks = ref([mockTask])
        return { tasks, onChange: changeHandler }
      },
    }

    const wrapper = mount(TestComponent)
    const draggable = wrapper.findComponent(VueDraggableNext)

    // Simulate a task being added to this column
    await draggable.vm.$emit('change', {
      added: {
        newIndex: 0,
        element: { ...mockTask, id: '2', title: 'New Task' },
      },
    })

    expect(changeHandler).toHaveBeenCalledWith({
      added: {
        newIndex: 0,
        element: { ...mockTask, id: '2', title: 'New Task' },
      },
    })
  })

  it('should handle drag start and end states', async () => {
    const TestComponent = {
      template: `
        <div>
          <draggable
            v-model="tasks"
            @start="onDragStart"
            @end="onDragEnd"
            item-key="id"
          >
            <template #item="{ element: task }">
              <div>{{ task.title }}</div>
            </template>
          </draggable>
        </div>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const tasks = ref([mockTask])
        const isDragging = ref(false)

        const onDragStart = jest.fn(() => {
          isDragging.value = true
        })

        const onDragEnd = jest.fn(() => {
          isDragging.value = false
        })

        return { tasks, onDragStart, onDragEnd, isDragging }
      },
    }

    const wrapper = mount(TestComponent)
    const draggable = wrapper.findComponent(VueDraggableNext)

    // Test drag start
    await draggable.vm.$emit('start', { item: {} })
    expect(wrapper.vm.onDragStart).toHaveBeenCalled()

    // Test drag end
    await draggable.vm.$emit('end', { item: {} })
    expect(wrapper.vm.onDragEnd).toHaveBeenCalled()
  })

  it('should handle task filtering and search', async () => {
    const SearchableKanban = {
      template: `
        <div>
          <input v-model="searchTerm" placeholder="Search tasks..." />
          <draggable
            v-model="filteredTasks"
            item-key="id"
          >
            <template #item="{ element: task }">
              <div class="task-card">{{ task.title }}</div>
            </template>
          </draggable>
        </div>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const searchTerm = ref('')
        const allTasks = ref([
          { ...mockTask, title: 'Design homepage' },
          { ...mockTask, id: '2', title: 'Build API' },
          { ...mockTask, id: '3', title: 'Test design' },
        ])

        const filteredTasks = ref(allTasks.value)

        // Watch search term and filter tasks
        // In real implementation, this would be a computed property
        const updateFilter = () => {
          if (searchTerm.value) {
            filteredTasks.value = allTasks.value.filter(task =>
              task.title.toLowerCase().includes(searchTerm.value.toLowerCase())
            )
          } else {
            filteredTasks.value = allTasks.value
          }
        }

        return { searchTerm, filteredTasks, updateFilter }
      },
    }

    const wrapper = mount(SearchableKanban)

    // Initially all tasks should be visible
    expect(wrapper.findAll('.task-card')).toHaveLength(3)

    // Update search term
    await wrapper.find('input').setValue('design')
    wrapper.vm.updateFilter()
    await nextTick()

    // Should filter to tasks containing "design"
    expect(wrapper.vm.filteredTasks).toHaveLength(2)
    expect(wrapper.vm.filteredTasks[0].title).toBe('Design homepage')
    expect(wrapper.vm.filteredTasks[1].title).toBe('Test design')
  })

  it('should save kanban state to backend', async () => {
    const KanbanWithSave = {
      template: `
        <draggable
          v-model="tasks"
          @change="onTaskChange"
          item-key="id"
        >
          <template #item="{ element: task }">
            <div>{{ task.title }}</div>
          </template>
        </draggable>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const tasks = ref([mockTask])

        const saveKanbanState = jest.fn(async () => {
          await fetch('/api/kanban', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tasks.value),
          })
        })

        const onTaskChange = jest.fn(event => {
          saveKanbanState()
        })

        return { tasks, onTaskChange, saveKanbanState }
      },
    }

    const wrapper = mount(KanbanWithSave)
    const draggable = wrapper.findComponent(VueDraggableNext)

    // Simulate a change event
    await draggable.vm.$emit('change', { moved: { oldIndex: 0, newIndex: 1 } })

    expect(wrapper.vm.onTaskChange).toHaveBeenCalled()
    expect(wrapper.vm.saveKanbanState).toHaveBeenCalled()
    expect(global.fetch).toHaveBeenCalledWith('/api/kanban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([mockTask]),
    })
  })

  it('should handle error states gracefully', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const KanbanWithErrorHandling = {
      template: `
        <draggable v-model="tasks" @change="onTaskChange" item-key="id">
          <template #item="{ element: task }">
            <div>{{ task.title }}</div>
          </template>
        </draggable>
      `,
      components: { draggable: VueDraggableNext },
      setup() {
        const tasks = ref([mockTask])

        const saveKanbanState = async () => {
          try {
            await fetch('/api/kanban', {
              method: 'POST',
              body: JSON.stringify(tasks.value),
            })
          } catch (error) {
            console.error('Failed to save kanban state:', error)
          }
        }

        const onTaskChange = () => saveKanbanState()

        return { tasks, onTaskChange }
      },
    }

    const wrapper = mount(KanbanWithErrorHandling)
    const draggable = wrapper.findComponent(VueDraggableNext)

    await draggable.vm.$emit('change', { moved: { oldIndex: 0, newIndex: 1 } })

    // Should handle error gracefully
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save kanban state:',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })
})
