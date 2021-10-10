import { createApp } from 'vue'
import App from './App.vue'
import { registerComponents } from './components/dynamic'
import { store } from './store'
import './index.css'
import './ribbons.css'
import { router } from './router'
const app = createApp(App)
app.use(store)
app.use(router)
app.use(registerComponents)
window.vm = app.mount('#app')
