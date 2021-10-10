<template>
  <div class="flex justify-center">
    <div class="w-64">
      <draggable class="dragArea list-group w-full" v-model="list" :sort="true">
        <div
          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center cursor-pointer"
          v-for="element in list"
          :key="element.name"
        >
          {{ element.name }}
        </div>
      </draggable>
    </div>
    <rawDisplays class="w-64" :value="list" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// @ts-ignore
import { VueDraggableNext } from '/@'
import rawDisplays from './rawDisplay.vue'
export default defineComponent({
  components: {
    draggable: VueDraggableNext,
    rawDisplays,
  },
  data() {
    return {
      list: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ],
    }
  },
})
</script>

<style scoped></style>
