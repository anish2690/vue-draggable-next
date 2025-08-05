import { camelize, console, insertNodeAt, removeNode } from './util/helper'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  onMounted,
  ref,
  resolveComponent,
} from 'vue'

import Sortable from 'sortablejs'

export interface OpenObject {
  [key: string]: any
}

interface DragEvent {
  item: HTMLElement & { _underlying_vm_?: any }
  newIndex?: number
  oldIndex?: number
  from?: HTMLElement
  to?: HTMLElement
  pullMode?: string
  clone?: HTMLElement
  [key: string]: any
}

interface ExtendedHTMLElement extends HTMLElement {
  __draggable_component__?: any
}

// Utility functions remain outside component
function computeVmIndex(vnodes: HTMLElement[], element: HTMLElement) {
  return Object.values(vnodes).indexOf(element)
}

function computeIndexes(
  slots: HTMLElement[],
  children: HTMLElement[],
  isTransition: boolean,
  footerOffset: number
) {
  if (!slots) {
    return []
  }

  const elmFromNodes = Object.values(slots)
  const footerIndex = children.length - footerOffset
  const rawIndexes = [...children].map((elt, idx) =>
    idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt)
  )
  return rawIndexes
}

function isTransitionName(name: string) {
  return ['transition-group', 'TransitionGroup'].includes(name)
}

function isTransition(slots: any[]) {
  if (!slots || slots.length !== 1) {
    return false
  }

  const [{ type }] = slots
  if (!type) {
    return false
  }

  return isTransitionName(type.name)
}

function getComponentAttributes($attrs: OpenObject, componentData: OpenObject) {
  if (!componentData) {
    return $attrs
  }
  return { ...componentData.props, ...componentData.attrs }
}

const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End']
const eventsToEmit = ['Choose', 'Unchoose', 'Sort', 'Filter', 'Clone']
const readonlyProperties = ['Move', ...eventsListened, ...eventsToEmit].map(
  evt => 'on' + evt
)

let draggingElement: any = null

export const VueDraggableNext = defineComponent({
  name: 'VueDraggableNext',
  inheritAttrs: false,
  props: {
    options: Object,
    list: {
      type: Array,
      required: false,
      default: null,
    },
    noTransitionOnDrag: {
      type: Boolean,
      default: false,
    },
    clone: {
      type: Function,
      default: (original: any) => {
        return original
      },
    },
    tag: {
      type: String,
      default: 'div',
    },
    move: {
      type: Function,
      default: null,
    },
    componentData: {
      type: Object,
      required: false,
      default: null,
    },
    component: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Array,
      required: false,
      default: null,
    },
  },
  emits: [
    'update:modelValue',
    'move',
    'change',
    ...eventsListened.map(s => s.toLowerCase()),
    ...eventsToEmit.map(s => s.toLowerCase()),
  ],
  setup(props, { emit, slots, attrs }) {
    // Reactive state
    const transitionMode = ref(false)
    const noneFunctionalComponentMode = ref(false)
    const headerOffset = ref(0)
    const footerOffset = ref(0)
    const visibleIndexes = ref<number[]>([])
    const context = ref<OpenObject | null>(null)
    const sortableInstance = ref<any | null>(null)

    // Computed reactive list source
    const realList = computed(() =>
      props.list ? props.list : props.modelValue
    )

    // Current component instance (access to $el etc.)
    const instance = getCurrentInstance()

    // getTag function converts to computed or normal function here
    function getTag() {
      return props.component ? resolveComponent(props.component) : props.tag
    }

    function updateOptions(newOptionValue: OpenObject) {
      if (!sortableInstance.value) return

      for (const property in newOptionValue) {
        const value = camelize(property)
        if (readonlyProperties.indexOf(value) === -1) {
          sortableInstance.value.option(value, newOptionValue[property])
        }
      }
    }

    function getChildrenNodes(): HTMLElement[] {
      return instance?.proxy?.$el.children || ([] as any)
    }

    async function computeIndexesFn() {
      await nextTick()
      visibleIndexes.value = computeIndexes(
        getChildrenNodes() as any,
        (instance?.proxy?.$el.children || []) as any,
        transitionMode.value,
        footerOffset.value
      )
    }

    function getUnderlyingVm(htmlElt: HTMLElement) {
      const index = computeVmIndex(getChildrenNodes() || [], htmlElt)
      if (index === -1) {
        return null
      }
      const element = realList.value ? (realList.value as any)[index] : null
      return { index, element }
    }

    function emitChanges(evt: OpenObject) {
      nextTick(() => emit('change', evt))
    }

    function alterList(onList: any) {
      if (props.list) {
        onList(props.list)
        return
      }
      const newList = [...(props.modelValue || [])]
      onList(newList)
      emit('update:modelValue', newList)
    }

    function spliceList(...args: any[]) {
      const spliceList = (list: any) => list.splice(...(args as any))
      alterList(spliceList)
    }

    function updatePosition(oldIndex: number, newIndex: number) {
      const updatePosition = (list: any) =>
        list.splice(newIndex, 0, list.splice(oldIndex, 1)[0])
      alterList(updatePosition)
    }

    function getVmIndex(domIndex: number) {
      const indexes = visibleIndexes.value
      const numberIndexes = indexes.length
      return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex]
    }

    function getComponent(): any {
      if (!slots.default) return null
      const sl = slots.default()
      return sl[0]?.component?.proxy || null
    }

    function resetTransitionData(index: number) {
      if (!props.noTransitionOnDrag || !transitionMode.value) return
      const nodes = getChildrenNodes() as any
      if (nodes[index]) {
        nodes[index].data = null
      }
      const transitionContainer = getComponent()
      if (transitionContainer) {
        transitionContainer.children = []
        transitionContainer.kept = undefined
      }
    }

    function onDragStart(evt: DragEvent) {
      computeIndexesFn()
      context.value = getUnderlyingVm(evt.item)
      if (!context.value) return
      evt.item._underlying_vm_ = props.clone(context.value.element)
      draggingElement = evt.item
    }

    function onDragAdd(evt: DragEvent) {
      const element = evt.item._underlying_vm_
      if (element === undefined) return
      removeNode(evt.item)
      const newIndex = getVmIndex(evt.newIndex!)
      spliceList(newIndex, 0, element)
      computeIndexesFn()
      emitChanges({ added: { element, newIndex } })
    }

    function onDragRemove(evt: DragEvent) {
      insertNodeAt(instance?.proxy?.$el, evt.item, evt.oldIndex!)
      if (evt.pullMode === 'clone') {
        removeNode(evt.clone)
        return
      }
      if (!context.value) return
      const oldIndex = context.value.index
      spliceList(oldIndex, 1)
      resetTransitionData(oldIndex)
      emitChanges({ removed: { element: context.value.element, oldIndex } })
    }

    function onDragUpdate(evt: DragEvent) {
      removeNode(evt.item)
      insertNodeAt(evt.from, evt.item, evt.oldIndex!)

      const oldIndex = context.value?.index as number
      const newIndex = getVmIndex(evt.newIndex!)
      updatePosition(oldIndex, newIndex)
      emitChanges({
        moved: { element: context.value?.element, oldIndex, newIndex },
      })
    }

    function updateProperty(evt: DragEvent, propertyName: string) {
      if (Object.prototype.hasOwnProperty.call(evt, propertyName))
        evt[propertyName] += headerOffset.value
    }

    function getTargetedComponent(htmlElement: ExtendedHTMLElement) {
      return htmlElement.__draggable_component__
    }

    function getRelatedContextFromMoveEvent({
      to,
      related,
    }: {
      to: ExtendedHTMLElement
      related: HTMLElement
    }) {
      const component = getTargetedComponent(to)
      if (!component) {
        return { component }
      }
      const list = component.realList
      const contextLocal = { list, component }
      if (to !== related && list && component.getUnderlyingVm) {
        const destination = component.getUnderlyingVm(related)
        if (destination) {
          return Object.assign(destination, contextLocal)
        }
      }
      return contextLocal
    }

    function computeFutureIndex(relatedContext: any, evt: any) {
      const domChildren = [...evt.to.children].filter(
        (el: HTMLElement) => el.style['display'] !== 'none'
      )
      if (domChildren.length === 0) return 0
      const currentDOMIndex = domChildren.indexOf(evt.related)
      const currentIndex = relatedContext.component.getVmIndex(currentDOMIndex)
      const draggedInList = domChildren.indexOf(draggingElement) !== -1
      return draggedInList || !evt.willInsertAfter
        ? currentIndex
        : currentIndex + 1
    }

    const mounted = () => {
      const optionsAdded: OpenObject = {}
      eventsListened.forEach(elt => {
        optionsAdded['on' + elt] = delegateAndEmit(elt)
      })

      eventsToEmit.forEach(elt => {
        optionsAdded['on' + elt] = emitEvent.bind(null, elt)
      })

      const attributes = Object.keys(attrs).reduce((res: OpenObject, key) => {
        res[camelize(key)] = attrs[key]
        return res
      }, {})

      const options = Object.assign({}, attributes, optionsAdded, {
        onMove: (evt: any, originalEvent: any) => {
          return onDragMove(evt, originalEvent)
        },
      }) as Sortable.Options

      if (!('draggable' in options)) {
        options.draggable = '>*'
      }

      const targetDomElement =
        instance?.proxy?.$el.nodeType === 1
          ? instance.proxy.$el
          : instance?.proxy?.$el.parentElement || null

      if (targetDomElement) {
        sortableInstance.value = new Sortable(targetDomElement, options)
        targetDomElement.__draggable_component__ = instance?.proxy
        computeIndexesFn()
      }
    }

    function emitEvent(evtName: string, evtData: any) {
      nextTick(() => emit(evtName.toLowerCase(), evtData))
    }

    function delegateAndEmit(evtName: string) {
      return (evtData: any) => {
        if (realList.value !== null) {
          // call handler like onDragStart etc. if available
          const handlerName = 'onDrag' + evtName
          const handler = (methods as any)[handlerName]
          if (handler) {
            handler(evtData)
          }
        }
        emitEvent(evtName, evtData)
      }
    }

    function onDragMove(evt: any, originalEvent: any) {
      const onMove = props.move
      if (!onMove || !realList.value) {
        return true
      }
      const relatedContext = getRelatedContextFromMoveEvent(evt)
      const draggedContext = context.value
      const futureIndex = computeFutureIndex(relatedContext, evt)
      if (draggedContext) {
        Object.assign(draggedContext, { futureIndex })
      }
      const sendEvt = Object.assign({}, evt, {
        relatedContext,
        draggedContext,
      })
      return onMove(sendEvt, originalEvent)
    }

    function onDragEnd() {
      computeIndexesFn()
      draggingElement = null
    }

    // You can group 'methods' into an object for delegateAndEmit references if needed
    const methods = {
      onDragStart,
      onDragAdd,
      onDragRemove,
      onDragUpdate,
      onDragMove,
      onDragEnd,
    }
    onMounted(() => {
      // Call setup's mounted method
      mounted()
    })

    // created lifecycle equivalent (run synchronously)
    if (props.list !== null && props.modelValue !== null) {
      console.error('list props are mutually exclusive! Please set one.')
    }

    // Expose what you want accessible in template / render
    return {
      getTag,
      realList,
      visibleIndexes,
      noneFunctionalComponentMode,
      headerOffset,
      footerOffset,
      transitionMode,
      computeIndexes: computeIndexesFn,
      updateOptions,
      getChildrenNodes,
      getUnderlyingVm,
      emitChanges,
      alterList,
      spliceList,
      updatePosition,
      getVmIndex,
      getComponent,
      resetTransitionData,
      onDragStart,
      onDragAdd,
      onDragRemove,
      onDragUpdate,
      updateProperty,
      onDragMove,
      onDragEnd,
      mounted,
      context,
      sortableInstance,
      getRelatedContextFromMoveEvent,
      getTargetedComponent,
      computeFutureIndex,
      // ... other exposed functions as needed
    }

    // Vue 3 lifecycle hooks outside setup
  },

  render() {
    const tag = this.getTag()
    const attrs = getComponentAttributes(this.$attrs, this.componentData)

    // For HTML tags, call the slot function and pass the result
    if (typeof tag === 'string') {
      const slots =
        this.$slots.default && typeof this.$slots.default === 'function'
          ? this.$slots.default()
          : null
      if (!slots) return h(tag, attrs, [])
      this.transitionMode = isTransition(slots)
      return h(tag, attrs, slots)
    }

    // For components, pass the slot functions, not their results
    const slotFunctions = this.$slots.default
      ? { default: this.$slots.default }
      : {}
    if (this.$slots.default) {
      const slotResult =
        typeof this.$slots.default === 'function' ? this.$slots.default() : null
      this.transitionMode = isTransition(slotResult || [])
    }
    return h(tag, attrs, slotFunctions)
  },
})
