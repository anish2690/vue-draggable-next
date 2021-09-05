<template>
  <div class="bg-white">
    <draggable class="dragArea" tag="ul" :list="tasks" :group="{ name: 'g1' }">
      <li v-for="el in tasks" :key="el.name">
        <p>{{ el.name }}</p>
        <nested-draggable :tasks="el.tasks" class="bg-gray-100 pl-5" />
      </li>
    </draggable>
  </div>
</template>
<script>
import { VueDraggableNext } from '/@'
export default {
  props: {
    tasks: {
      required: true,
      type: Array,
    },
  },
  components: {
    draggable: VueDraggableNext,
  },
  name: 'nested-draggable',
}
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>
