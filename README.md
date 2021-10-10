# vue-draggable-next

Vue 3 drag-and-drop component based on Sortable.js

[Demo](https://vue-draggable-next.vercel.app/).

## Installation

```
npm install vue-draggable-next
//or
yarn add vue-draggable-next
```

### Typical use:

```html
<template>
  <div class="flex m-10">
    <draggable class="dragArea list-group w-full" :list="list" @change="log">
      <div
        class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
        v-for="element in list"
        :key="element.name"
      >
        {{ element.name }}
      </div>
    </draggable>
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next'
  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
    data() {
      return {
        enabled: true,
        list: [
          { name: 'John', id: 1 },
          { name: 'Joao', id: 2 },
          { name: 'Jean', id: 3 },
          { name: 'Gerard', id: 4 },
        ],
        dragging: false,
      }
    },
    methods: {
      log(event) {
        console.log(event)
      },
    },
  })
</script>
```

### With `transition-group`:

```html
<draggable v-model="myArray">
  <transition-group>
    <div v-for="element in myArray" :key="element.id">{{element.name}}</div>
  </transition-group>
</draggable>
```

### With Vuex:

```html
<draggable v-model="myList"></draggable>
```

```javascript
computed: {
    myList: {
        get() {
            return this.$store.state.elements
        },
        set(value) {
           this.$store.dispatch('updateElements', value)
        }
    }
}
```

### Props

#### value

Type: `Array`<br>
Required: `false`<br>
Default: `null`

Input array to draggable component. Typically same array as referenced by inner element v-for directive.<br>
This is the preferred way to use Vue.draggable as it is compatible with Vuex.<br>
It should not be used directly but only though the `v-model` directive:

```html
<draggable v-model="myArray"></draggable>
```

#### list

Type: `Array`<br>
Required: `false`<br>
Default: `null`

Alternative to the `value` prop, list is an array to be synchronized with drag-and-drop.<br>
The main difference is that `list` prop is updated by draggable component using splice method, whereas `value` is immutable.<br>
**Do not use in conjunction with value prop.**

#### All sortable options

New in version 2.19

Sortable options can be set directly as vue.draggable props since version 2.19.

This means that all [sortable option](https://github.com/RubaXa/Sortable#options) are valid sortable props with the notable exception of all the method starting by "on" as draggable component expose the same API via events.

kebab-case propery are supported: for example `ghost-class` props will be converted to `ghostClass` sortable option.

Example setting handle, sortable and a group option:

```HTML
<draggable
        v-model="list"
        handle=".handle"
        :group="{ name: 'people', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        @change="log"
      >
      <!-- -->
</draggable>
```

#### tag

Type: `String`<br>
Default: `'div'`

HTML node type of the element that draggable component create as outer element.

#### component

Type: `String`<br>
Default: `'null'`

It is also possible to pass the name of vue component as element. In this case, draggable attribute will be passed to the create component.

#### componentData

Type: `Function`<br>
Required: `false`<br>
Default: `null`<br>

if you need to set props or attrs to the created component.

#### clone

Type: `Function`<br>
Required: `false`<br>
Default: `(original) => { return original;}`<br>

Function called on the source component to clone element when clone option is true. The unique argument is the viewModel element to be cloned and the returned value is its cloned version.<br>
By default vue-draggable-next reuses the viewModel element, so you have to use this hook if you want to clone or deep clone it.

#### move

Type: `Function`<br>
Required: `false`<br>
Default: `null`<br>

If not null this function will be called in a similar way as [Sortable onMove callback](https://github.com/RubaXa/Sortable#move-event-object).
Returning false will cancel the drag operation.

```javascript
function onMoveCallback(evt, originalEvent){
   ...
    // return false; — for cancel
}
```

evt object has same property as [Sortable onMove event](https://github.com/RubaXa/Sortable#move-event-object), and 3 additional properties:

- `draggedContext`: context linked to dragged element
  - `index`: dragged element index
  - `element`: dragged element underlying view model element
  - `futureIndex`: potential index of the dragged element if the drop operation is accepted
- `relatedContext`: context linked to current drag operation
  - `index`: target element index
  - `element`: target element view model element
  - `list`: target list
  - `component`: target VueComponent

HTML:

```HTML
<draggable :list="list" :move="checkMove">
```

javascript:

```javascript
checkMove: function(evt){
    return (evt.draggedContext.element.name!=='apple');
}
```

### Events

- Support for Sortable events:

  `start`, `add`, `remove`, `update`, `end`, `choose`, `unchoose`, `sort`, `filter`, `clone`<br>
  Events are called whenever onStart, onAdd, onRemove, onUpdate, onEnd, onChoose, onUnchoose, onSort, onClone are fired by Sortable.js with the same argument.<br>
  [See here for reference](https://github.com/RubaXa/Sortable#event-object-demo)

HTML:

```HTML
<draggable :list="list" @end="onEnd">
```

- change event

  `change` event is triggered when list prop is not null and the corresponding array is altered due to drag-and-drop operation.<br>
  This event is called with one argument containing one of the following properties:

  - `added`: contains information of an element added to the array
    - `newIndex`: the index of the added element
    - `element`: the added element
  - `removed`: contains information of an element removed from to the array
    - `oldIndex`: the index of the element before remove
    - `element`: the removed element
  - `moved`: contains information of an element moved within the array
    - `newIndex`: the current index of the moved element
    - `oldIndex`: the old index of the moved element
    - `element`: the moved element

## 🌸 Thanks

This project is heavily inspired by the following awesome vue 2 projects.

- [SortableJS/Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)

Thanks!
