<template>
  <div class="flex justify-center">
    <div class="w-64">
      <h1>Instance 1</h1>
      <!-- list #1 -->
      <draggable
        class="dragArea list-group w-full"
        group="sortable-list-items"
        v-model="state.list[0]"
        :data-section="0"
        :sort="true"
        :move="onMove"
        @change="onChange"
      >
        <div
          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center cursor-pointer"
          v-for="element in state.list[0]"
          :key="element.name"
        >
          {{ element.name }}
        </div>
      </draggable>
      <h1>Instance 2</h1>

      <!-- list #2 -->
      <draggable
        class="dragArea list-group w-full"
        group="sortable-list-items"
        v-model="state.list[1]"
        :data-section="1"
        :sort="true"
        :move="onMove"
        @change="onChange"
      >
        <div
          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center cursor-pointer"
          v-for="element in state.list[1]"
          :key="element.name"
        >
          {{ element.name }}
        </div>
      </draggable>
      <h1>Instance 3</h1>

      <!-- list #3 -->
      <draggable
        class="dragArea list-group w-full"
        group="sortable-list-items"
        v-model="state.list[2]"
        :data-section="2"
        :sort="true"
        :move="onMove"
        @change="onChange"
      >
        <div
          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center cursor-pointer"
          v-for="element in state.list[2]"
          :key="element.name"
        >
          {{ element.name }}
        </div>
      </draggable>
    </div>
    <!-- display lists -->
    <div class="raw-displays">
      <rawDisplays class="w-64" :value="state.list[0]" />
      <rawDisplays class="w-64" :value="state.list[1]" />
      <rawDisplays class="w-64" :value="state.list[2]" />
    </div>
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
        [
          { name: 'John', id: 1 },
          { name: 'Joao', id: 2 },
          { name: 'Jean', id: 3 },
          { name: 'Gerard', id: 4 },
          { name: 'Marco', id: 5 },
          { name: 'Marcel', id: 6 },
          { name: 'Martin', id: 7 },
        ],
        [{ name: 'Michael', id: 1 }],
        [],
      ],
    })
    function onMove(evt) {
      console.log(
        'move from section: ' +
          evt.from.dataset.section +
          ' index: ' +
          evt.draggedContext.index +
          ' to section: ' +
          evt.to.dataset.section +
          ' index: ' +
          evt.draggedContext.futureIndex
      )
    }
    function onChange(evt) {
      console.log(evt)
    }
    return {
      state,
      onMove,
      onChange,
    }
  },
})
</script>

<style scoped>
.raw-displays {
  margin: 2rem;
}
</style>
