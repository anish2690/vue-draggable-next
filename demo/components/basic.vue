<template>
  <div class="flex justify-center">
    <div class="w-64">
      <draggable
        class="dragArea list-group w-full"
        :list="state.list"
        :sort="true"
        @change="log"
        :move="checkMove"
      >
        <div
          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center cursor-pointer"
          v-for="element in state.list"
          :key="element.name"
        >
          {{ element.name }}
        </div>
      </draggable>
    </div>
    <rawDisplays class="w-64" :value="state.list" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
// @ts-ignore
import { VueDraggableNext } from '/@'
import rawDisplays from './rawDisplay.vue'
export default defineComponent({
  components: {
    draggable: VueDraggableNext,
    rawDisplays,
  },
  setup() {
    const state = reactive({
      list: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ],
    })
    function log(event) {
      // console.log(event)
    }
    function checkMove(evt) {
      console.log('Future index: ' + evt.draggedContext.futureIndex)
      console.log('element: ' + evt.draggedContext.element.name)
    }
    return {
      state,
      log,
      checkMove,
    }
  },
})
</script>

<style scoped></style>
