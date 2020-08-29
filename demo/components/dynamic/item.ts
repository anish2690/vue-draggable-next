
import { defineComponent, h } from 'vue'
export default defineComponent({
  render() {
    return h('ul', { id: 'parent-ul' }, this.$slots.default())
  }
})