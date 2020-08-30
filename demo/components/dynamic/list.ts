
import { defineComponent, h } from 'vue'
export default defineComponent({
  props: ['classList'],
  render() {
    return h('ul', { ...this.$attrs, class: this.classList }, this.$slots.default())
  }
})