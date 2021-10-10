<template>
  <div class="flex justify-center">
    <div class="w-64">
      <draggable
        class="dragArea list-group w-full"
        v-model="myList"
        :sort="true"
      >
        <div
          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center cursor-pointer"
          v-for="element in myList"
          :key="element.name"
        >
          {{ element.name }}
        </div>
      </draggable>
    </div>
    <rawDisplays class="w-64" :value="myList" />
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
  computed: {
    myList: {
      get() {
        return this.$store.state.elements
      },
      set(value) {
        this.$store.dispatch('updateElements', value)
      },
    },
  },
})
</script>

<style scoped></style>
