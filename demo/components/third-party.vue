<template>
  <div class="flex justify-center">
    <div class="w-64">
      <draggable
        :list="state.list"
        :sort="true"
        component="list-component"
        :component-data="state.collapseComponentData"
        @change="log"
      >
        <item-component
          class="list-group-item bg-gray-300 m-1 p-3 rounded-md cursor-pointer"
          v-for="element in state.list"
          :key="element.name"
        >
          <div class="inline-flex items-center">
            <svg
              class="h-5 w-5 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {{ element.name }}
          </div>
        </item-component>
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
        {
          name: 'Mandy',
          id: 1,
        },
        {
          name: 'Colten',
          id: 2,
        },
        {
          name: 'Ashly',
          id: 3,
        },
        {
          name: 'Nathan',
          id: 4,
        },
      ],
      collapseComponentData: {
        props: {
          classList: 'text-left text-md text-blue-700 list-group w-full w-64 ',
        },
      },
    })
    function log(event: any) {
      console.log(event)
    }
    function checkMove(evt: any) {
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
