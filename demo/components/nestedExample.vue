<template>
  <div class="flex">
    <div class="w-6/12">
      <h3>Nested draggable</h3>
      <nested-draggable :tasks="list" />
    </div>

    <rawDisplay class="w-full" :value="list" title="List" />
  </div>
</template>

<script>
import nestedDraggable from './nested.vue'
import rawDisplay from './rawDisplay.vue'
export default {
  name: 'nested-example',
  display: 'Nested',
  order: 15,
  components: {
    rawDisplay,
    nestedDraggable,
  },
  data() {
    return {
      list: [
        {
          name: 'task 1',
          tasks: [
            {
              name: 'task 2',
              tasks: [],
            },
          ],
        },
        {
          name: 'task 3',
          tasks: [
            {
              name: 'task 4',
              tasks: [],
            },
          ],
        },
        {
          name: 'task 5',
          tasks: [],
        },
      ],
    }
  },
}
</script>
<style scoped></style>
