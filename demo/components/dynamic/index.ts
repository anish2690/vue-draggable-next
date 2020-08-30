import { Plugin } from 'vue'
import list from './list'
import item from './item'
export const registerComponents: Plugin = {
    install(app) {
        app.component('list-component', list)
        app.component('item-component', item)
    },
}
