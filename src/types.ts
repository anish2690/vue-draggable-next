/**
 * TypeScript definitions for vue-draggable-next
 * Provides comprehensive type support for all component features
 */

import type { Component, VNode } from 'vue'

// Core interfaces
export interface DraggableItem {
  [key: string]: any
}

export interface SortableEvent {
  to: HTMLElement
  from: HTMLElement
  item: HTMLElement
  clone?: HTMLElement
  oldIndex?: number
  newIndex?: number
  oldDraggableIndex?: number
  newDraggableIndex?: number
  pullMode?: 'clone' | boolean
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

export interface MoveEvent<T = DraggableItem> {
  to: HTMLElement
  from: HTMLElement
  dragged: HTMLElement
  draggedRect: DOMRect
  related: HTMLElement
  relatedRect: DOMRect
  willInsertAfter: boolean
  originalEvent: Event
  draggedContext: {
    index: number
    element: T
    futureIndex: number
  }
  relatedContext: {
    index: number
    element: T
    list: T[]
    component: any
  }
}

// Group configuration
export type GroupName = string

export interface GroupSpec {
  name: GroupName
  pull?:
    | boolean
    | 'clone'
    | string[]
    | ((
        to: any,
        from: any,
        dragEl: HTMLElement,
        evt: Event
      ) => boolean | string)
  put?:
    | boolean
    | string[]
    | ((to: any, from: any, dragEl: HTMLElement, evt: Event) => boolean)
  revertClone?: boolean
}

export type Group = GroupName | GroupSpec

// Component data configuration
export interface ComponentData {
  props?: Record<string, any>
  attrs?: Record<string, any>
  [key: string]: any
}

// Animation easing types
export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier(n,n,n,n)'

// Props interface
export interface VueDraggableNextProps<T = DraggableItem> {
  // Core props
  modelValue?: T[]
  list?: T[]
  itemKey?: string | ((item: T) => string | number)

  // HTML/Component configuration
  tag?: string
  component?: string | Component
  componentData?: ComponentData

  // Behavior
  group?: Group
  sort?: boolean
  delay?: number
  delayOnTouchStart?: boolean
  touchStartThreshold?: number
  disabled?: boolean
  store?: any

  // Animation
  animation?: number
  easing?: EasingFunction

  // Styling classes
  ghostClass?: string
  chosenClass?: string
  dragClass?: string

  // Advanced options
  handle?: string
  filter?: string
  preventOnFilter?: boolean
  draggable?: string
  dataIdAttr?: string
  swapThreshold?: number
  invertSwap?: boolean
  invertedSwapThreshold?: number
  direction?: 'horizontal' | 'vertical' | 'auto'

  // Scrolling
  scroll?: boolean | HTMLElement
  scrollSensitivity?: number
  scrollSpeed?: number
  bubbleScroll?: boolean

  // Force fallback
  forceFallback?: boolean
  fallbackClass?: string
  fallbackOnBody?: boolean
  fallbackTolerance?: number

  // Multi-drag (plugin)
  multiDrag?: boolean
  selectedClass?: string
  multiDragKey?: string

  // Clone function
  clone?: (original: T) => T

  // Move callback
  move?: (event: MoveEvent<T>, originalEvent: Event) => boolean | void

  // Remove on spill
  removeOnSpill?: boolean
  onSpill?: (event: SortableEvent) => void
}

// Event emitter types
export interface VueDraggableNextEvents<T = DraggableItem> {
  'update:modelValue': (value: T[]) => void
  change: (event: DragChangeEvent<T>) => void
  start: (event: SortableEvent) => void
  end: (event: SortableEvent) => void
  add: (event: SortableEvent) => void
  remove: (event: SortableEvent) => void
  update: (event: SortableEvent) => void
  sort: (event: SortableEvent) => void
  choose: (event: SortableEvent) => void
  unchoose: (event: SortableEvent) => void
  filter: (event: SortableEvent) => void
  clone: (event: SortableEvent) => void
  move: (event: MoveEvent<T>, originalEvent: Event) => boolean | void
}

// Slots interface
export interface VueDraggableNextSlots<T = DraggableItem> {
  default?: () => VNode[]
  item?: (props: { element: T; index: number }) => VNode[]
  header?: () => VNode[]
  footer?: () => VNode[]
}

// Plugin interfaces
export interface SortablePlugin {
  pluginName: string
  initializePlugin: (sortable: any) => void
  [key: string]: any
}

// Utility types
export type DragDirection = 'up' | 'down' | 'left' | 'right'

export interface DragContext<T = DraggableItem> {
  element: T
  index: number
  futureIndex?: number
}

export interface DropContext<T = DraggableItem> {
  element: T
  index: number
  list: T[]
  component: any
}

// Advanced configuration
export interface AutoScrollOptions {
  scroll?: boolean | HTMLElement
  scrollSensitivity?: number
  scrollSpeed?: number
  bubbleScroll?: boolean
}

export interface SwapOptions {
  swap?: boolean
  swapClass?: string
}

export interface MultiDragOptions {
  multiDrag?: boolean
  selectedClass?: string
  multiDragKey?: 'ctrl' | 'alt' | 'shift' | 'meta' | null
  avoidImplicitDeselect?: boolean
}

// Component instance type
export interface VueDraggableNextInstance<T = DraggableItem> {
  // Public methods
  option: (name: string, value?: any) => any
  closest: (selector: string, context?: HTMLElement) => HTMLElement | null
  toArray: () => string[]
  sort: (order: string[]) => void
  save: () => void
  destroy: () => void

  // Internal properties (readonly)
  readonly el: HTMLElement
  readonly options: VueDraggableNextProps<T>
}

// Error types
export class DraggableError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'DraggableError'
  }
}

// Utility functions types
export interface DraggableUtils {
  closest: (
    element: HTMLElement,
    selector: string,
    context?: HTMLElement
  ) => HTMLElement | null
  on: (element: HTMLElement, event: string, handler: EventListener) => void
  off: (element: HTMLElement, event: string, handler: EventListener) => void
  css: (element: HTMLElement, prop: string, value?: string) => string | void
  find: (
    context: HTMLElement,
    selector: string,
    all?: boolean
  ) => HTMLElement | HTMLElement[] | null
  index: (element: HTMLElement, selector?: string) => number
  toggleClass: (
    element: HTMLElement,
    className: string,
    state?: boolean
  ) => void
}

// Global configuration
export interface GlobalConfig {
  animation: number
  easing: EasingFunction
  ghostClass: string
  chosenClass: string
  dragClass: string
  direction: 'horizontal' | 'vertical' | 'auto'
  touchStartThreshold: number
  emptyInsertThreshold: number
}

// Plugin system
export interface PluginEvent {
  sortable: any
  name: string
  originalEvent?: Event
  [key: string]: any
}

export type PluginEventHandler = (event: PluginEvent) => void | boolean

export interface PluginDefinition {
  name: string
  params?: any
  initializePlugin?: (sortable: any) => void
  eventProperties?: string[]
  [key: string]: any
}

// Re-export main component types
export { VueDraggableNext } from './VueDraggableNext'

// Type guards
export function isDraggableEvent(event: any): event is SortableEvent {
  return event && typeof event === 'object' && 'item' in event
}

export function isChangeEvent<T>(event: any): event is DragChangeEvent<T> {
  return (
    event &&
    typeof event === 'object' &&
    ('added' in event || 'removed' in event || 'moved' in event)
  )
}

export function isMoveEvent<T>(event: any): event is MoveEvent<T> {
  return (
    event &&
    typeof event === 'object' &&
    'draggedContext' in event &&
    'relatedContext' in event
  )
}

// Default values
export const DEFAULT_PROPS: Partial<VueDraggableNextProps> = {
  tag: 'div',
  sort: true,
  disabled: false,
  animation: 0,
  ghostClass: '',
  chosenClass: '',
  dragClass: '',
  delay: 0,
  delayOnTouchStart: false,
  touchStartThreshold: 5,
  forceFallback: false,
  fallbackTolerance: 0,
  scroll: true,
  scrollSensitivity: 30,
  scrollSpeed: 10,
  bubbleScroll: true,
}

// Validation helpers
export function validateProps<T>(props: VueDraggableNextProps<T>): string[] {
  const errors: string[] = []

  if (props.list && props.modelValue) {
    errors.push('Cannot use both "list" and "modelValue" props simultaneously')
  }

  if (props.animation && (props.animation < 0 || props.animation > 3000)) {
    errors.push('Animation duration should be between 0 and 3000ms')
  }

  if (props.delay && props.delay < 0) {
    errors.push('Delay must be a positive number')
  }

  return errors
}

// Performance optimization helpers
export interface PerformanceOptions {
  itemKey?: string | ((item: any) => string | number)
  preventDefaultOnMove?: boolean
  optimizedUpdates?: boolean
  debounceTime?: number
}

// Accessibility helpers
export interface AccessibilityOptions {
  announcements?: {
    start?: string
    end?: string
    cancel?: string
  }
  liveRegion?: HTMLElement | string
  keyboardNavigation?: boolean
  focusManagement?: boolean
}

// Testing utilities
export interface TestUtils {
  triggerDragStart: (element: HTMLElement, options?: any) => void
  triggerDragEnd: (element: HTMLElement, options?: any) => void
  triggerDrop: (from: HTMLElement, to: HTMLElement, options?: any) => void
  simulateTouch: (element: HTMLElement, type: string, options?: any) => void
}
