import { Plugin } from 'vue'
import list from './list.vue'
import item from './item.vue'

export const registerComponents: Plugin = {
    install(app) {
        app.component('list-component', list)
        app.component('item-component', item)
    },
}
