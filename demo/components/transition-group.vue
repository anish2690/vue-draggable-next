<template>
  <div class="flex justify-center">
    <div class="w-2/6 rounded overflow-hidden p-5">
      <button class="btn btn-blue" @click="sort">To original order</button>
      <draggable
        class="list-group"
        tag="ul"
        :list="list"
        v-bind="dragOptions"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <transition-group type="transition" name="flip-list">
          <li
            class="list-group-item p-1 bg-gray-200 m-1 rounded-md"
            v-for="element in list"
            :key="element.order"
          >
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              @click="element.fixed = !element.fixed"
              aria-hidden="true"
            ></i>
            {{ element.name }}
          </li>
        </transition-group>
      </draggable>
    </div>
    <rawDisplayer :value="list" class="w-64" />
  </div>
</template>

<script>
import { VueDraggableNext } from '/@'
import rawDisplayer from './rawDisplay.vue'
const message = [
  'vue.js 3.0',
  'vue.draggable',
  'draggable',
  'component',
  'for',
  'based',
  'on',
  'Sortablejs',
]
export default {
  name: 'transition-example',
  display: 'Transition',
  order: 6,
  components: {
    draggable: VueDraggableNext,

    rawDisplayer,
  },
  data() {
    return {
      list: message.map((name, index) => {
        return { name, order: index + 1 }
      }),
    }
  },
  mounted() {
    console.log(this.list)
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order)
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
}
</script>

<style>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}

.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
</style>
