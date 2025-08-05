import { VueDraggableNext } from '../src'
/**
 * @jest-environment jsdom
 */
import { mount } from '@vue/test-utils'

describe('Simple VueDraggableNext Test', () => {
  it('should mount successfully', () => {
    const wrapper = mount(VueDraggableNext, {
      props: {
        modelValue: [],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should render with basic props', () => {
    const testList = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]

    const wrapper = mount(VueDraggableNext, {
      props: {
        modelValue: testList,
        tag: 'ul',
      },
      slots: {
        default: testList
          .map(item => `<li key="${item.id}">${item.name}</li>`)
          .join(''),
      },
    })

    expect(wrapper.element.tagName).toBe('UL')
    expect(wrapper.text()).toContain('Item 1')
    expect(wrapper.text()).toContain('Item 2')
  })

  it('should accept basic sortable props', () => {
    const wrapper = mount(VueDraggableNext, {
      props: {
        modelValue: [],
        animation: 300,
        disabled: false,
        group: 'test-group',
      },
    })

    expect(wrapper.props('animation')).toBe(300)
    expect(wrapper.props('disabled')).toBe(false)
    expect(wrapper.props('group')).toBe('test-group')
  })
})
