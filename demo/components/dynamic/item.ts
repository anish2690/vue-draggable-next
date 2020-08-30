
import { defineComponent, h } from 'vue'
export default defineComponent({
  render() {
    return h('li', { id: 'child-li' }, this.$slots.default())
  }
})