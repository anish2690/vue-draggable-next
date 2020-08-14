<template>
  <div class="h-screen">
    <basic />
    <basic1 />
    <nestedExample />
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
const basic = defineAsyncComponent(() => import('./components/basic.vue'))
const basic1 = defineAsyncComponent(() => import('./components/basic1.vue'))
const nestedExample = defineAsyncComponent(() =>
  import('./components/nestedExample.vue')
)

export default defineComponent({
  name: 'App',
  components: {
    basic,
    basic1,
    nestedExample,
  },
})
</script>
