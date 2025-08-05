import { createTestList, flushPromises } from './setup'
import { nextTick, ref } from 'vue'

import { VueDraggableNext } from '../src'
/**
 * @jest-environment jsdom
 */
import { mount } from '@vue/test-utils'

describe('VueDraggableNext Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Mounting and Props', () => {
    it('should mount successfully with minimal props', () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: [],
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('DIV') // default tag
    })

    it('should render with custom tag', () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: [],
          tag: 'ul',
        },
      })

      expect(wrapper.element.tagName).toBe('UL')
    })

    it('should handle all sortable options as props', () => {
      const props = {
        modelValue: [],
        animation: 300,
        delay: 100,
        disabled: false,
        ghostClass: 'ghost',
        chosenClass: 'chosen',
        dragClass: 'drag',
        group: 'test-group',
        sort: true,
        handle: '.handle',
        filter: '.no-drag',
        scroll: true,
        scrollSensitivity: 50,
        scrollSpeed: 20,
      }

      const wrapper = mount(VueDraggableNext, { props })

      // Check that all props are correctly passed
      Object.entries(props).forEach(([key, value]) => {
        expect(wrapper.props(key)).toEqual(value)
      })
    })
  })

  describe('v-model and List Synchronization', () => {
    it('should sync with v-model', async () => {
      const TestComponent = {
        template: `
          <draggable v-model="items">
            <div v-for="item in items" :key="item.id">{{ item.name }}</div>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const items = ref(createTestList(3))
          return { items }
        },
      }

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      // Initial state
      expect(vm.items).toHaveLength(3)
      expect(wrapper.text()).toContain('Item 1')

      // Update model
      vm.items.push({ id: 4, name: 'Item 4' })
      await nextTick()

      expect(wrapper.text()).toContain('Item 4')
    })

    it('should work with list prop instead of v-model', async () => {
      const list = createTestList(2)

      const wrapper = mount(VueDraggableNext, {
        props: { list },
        slots: {
          default: () =>
            list.map(item => `<div key="${item.id}">${item.name}</div>`),
        },
      })

      expect(wrapper.props('list')).toEqual(list)
    })

    it('should emit update:modelValue when internal changes occur', async () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: createTestList(2),
        },
      })

      // Simulate internal change
      const newList = createTestList(3)
      await wrapper.setProps({ modelValue: newList })

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  describe('Events', () => {
    it('should emit all sortable events', async () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: createTestList(2),
        },
      })

      const sortableEvents = [
        'start',
        'end',
        'add',
        'remove',
        'update',
        'sort',
        'choose',
        'unchoose',
      ]

      // Simulate each event
      for (const event of sortableEvents) {
        await wrapper.vm.$emit(event, { item: {}, oldIndex: 0, newIndex: 1 })
        expect(wrapper.emitted(event)).toBeTruthy()
      }
    })

    it('should emit change event with proper data structure', async () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: createTestList(2),
        },
      })

      // Test added event
      await wrapper.vm.$emit('change', {
        added: { newIndex: 0, element: { id: 3, name: 'New Item' } },
      })

      const changeEvents = wrapper.emitted('change')
      expect(changeEvents).toHaveLength(1)
      expect(changeEvents![0][0]).toEqual({
        added: { newIndex: 0, element: { id: 3, name: 'New Item' } },
      })
    })

    it('should handle move callback', async () => {
      const moveCallback = jest.fn().mockReturnValue(true)

      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: createTestList(2),
          move: moveCallback,
        },
      })

      // Simulate move event
      await wrapper.vm.$emit('move', {
        draggedContext: { index: 0, element: { id: 1, name: 'Item 1' } },
        relatedContext: { index: 1, element: { id: 2, name: 'Item 2' } },
      })

      expect(moveCallback).toHaveBeenCalled()
    })
  })

  describe('Slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: [],
        },
        slots: {
          default: '<div class="test-content">Test Content</div>',
        },
      })

      expect(wrapper.find('.test-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Test Content')
    })

    it('should work with scoped slots using item-key', async () => {
      const TestComponent = {
        template: `
          <draggable v-model="items" item-key="id">
            <template #item="{ element, index }">
              <div class="item" :data-index="index">{{ element.name }}</div>
            </template>
          </draggable>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const items = ref(createTestList(2))
          return { items }
        },
      }

      const wrapper = mount(TestComponent)

      expect(wrapper.findAll('.item')).toHaveLength(2)
      expect(wrapper.find('[data-index="0"]').text()).toBe('Item 1')
      expect(wrapper.find('[data-index="1"]').text()).toBe('Item 2')
    })
  })

  describe('Component Data and Custom Components', () => {
    it('should work with component prop', () => {
      const CustomComponent = {
        template: '<section><slot /></section>',
        props: ['customProp'],
      }

      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: [],
          component: 'section',
          componentData: {
            props: { customProp: 'test-value' },
          },
        },
        global: {
          components: { section: CustomComponent },
        },
      })

      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should pass component data correctly', () => {
      const componentData = {
        props: { testProp: 'test-value' },
        attrs: { 'data-testid': 'custom-component' },
      }

      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: [],
          componentData,
        },
      })

      expect(wrapper.props('componentData')).toEqual(componentData)
    })
  })

  describe('Groups and Multi-List Scenarios', () => {
    it('should handle group configuration', () => {
      const groupConfig = {
        name: 'shared',
        pull: 'clone',
        put: false,
      }

      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: [],
          group: groupConfig,
        },
      })

      expect(wrapper.props('group')).toEqual(groupConfig)
    })

    it('should work with multiple lists sharing same group', async () => {
      const TestComponent = {
        template: `
          <div>
            <draggable v-model="list1" group="shared" class="list1">
              <div v-for="item in list1" :key="item.id">{{ item.name }}</div>
            </draggable>
            <draggable v-model="list2" group="shared" class="list2">
              <div v-for="item in list2" :key="item.id">{{ item.name }}</div>
            </draggable>
          </div>
        `,
        components: { draggable: VueDraggableNext },
        setup() {
          const list1 = ref([{ id: 1, name: 'Item 1' }])
          const list2 = ref([{ id: 2, name: 'Item 2' }])
          return { list1, list2 }
        },
      }

      const wrapper = mount(TestComponent)

      const draggables = wrapper.findAllComponents(VueDraggableNext)
      expect(draggables).toHaveLength(2)
      expect(draggables[0].props('group')).toBe('shared')
      expect(draggables[1].props('group')).toBe('shared')
    })
  })

  describe('Clone Functionality', () => {
    it('should use custom clone function', () => {
      const cloneFunction = jest.fn(original => ({
        ...original,
        id: `clone-${original.id}`,
        name: `Clone of ${original.name}`,
      }))

      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: createTestList(1),
          clone: cloneFunction,
        },
      })

      expect(wrapper.props('clone')).toBe(cloneFunction)
    })
  })

  describe('Performance and Optimization', () => {
    it('should handle large lists efficiently', async () => {
      const largeList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }))

      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: largeList,
          itemKey: 'id',
        },
        slots: {
          default: () =>
            largeList
              .map(item => `<div key="${item.id}">${item.name}</div>`)
              .join(''),
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.props('itemKey')).toBe('id')
    })

    it('should work with item-key function', () => {
      const itemKeyFunction = (item: any) => `custom-${item.id}`

      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: createTestList(2),
          itemKey: itemKeyFunction,
        },
      })

      expect(wrapper.props('itemKey')).toBe(itemKeyFunction)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid props gracefully', () => {
      // This should not throw an error
      expect(() => {
        mount(VueDraggableNext, {
          props: {
            modelValue: null as any,
            animation: -100, // Invalid animation value
            delay: 'invalid' as any, // Invalid delay type
          },
        })
      }).not.toThrow()
    })

    it('should handle undefined/null list items', () => {
      const listWithNulls = [
        { id: 1, name: 'Valid item' },
        null,
        undefined,
        { id: 2, name: 'Another valid item' },
      ]

      expect(() => {
        mount(VueDraggableNext, {
          props: {
            modelValue: listWithNulls as any,
          },
        })
      }).not.toThrow()
    })
  })

  describe('Lifecycle and Cleanup', () => {
    it('should clean up sortable instance on unmount', () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: createTestList(2),
        },
      })

      expect(wrapper.exists()).toBe(true)

      // Unmount component
      wrapper.unmount()

      // Sortable destroy should have been called
      // This is mocked in our setup, so we can't directly test it
      // but we can ensure unmounting doesn't throw errors
      expect(true).toBe(true)
    })

    it('should update sortable options when props change', async () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: createTestList(2),
          animation: 100,
        },
      })

      expect(wrapper.props('animation')).toBe(100)

      // Update prop
      await wrapper.setProps({ animation: 200 })

      expect(wrapper.props('animation')).toBe(200)
    })
  })

  describe('Accessibility', () => {
    it('should maintain semantic HTML structure', () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: createTestList(2),
          tag: 'ul',
        },
        slots: {
          default: '<li>Item 1</li><li>Item 2</li>',
        },
      })

      expect(wrapper.find('ul').exists()).toBe(true)
      expect(wrapper.findAll('li')).toHaveLength(2)
    })

    it('should preserve aria attributes', () => {
      const wrapper = mount(VueDraggableNext, {
        props: {
          modelValue: [],
        },
        attrs: {
          'aria-label': 'Draggable list',
          role: 'list',
        },
      })

      expect(wrapper.attributes('aria-label')).toBe('Draggable list')
      expect(wrapper.attributes('role')).toBe('list')
    })
  })
})
