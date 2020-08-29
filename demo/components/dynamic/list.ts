
import { defineComponent, h } from 'vue'
export default defineComponent({
  render() {
    return h('li', { id: 'parent-ul' }, this.$slots.default())
  }
})