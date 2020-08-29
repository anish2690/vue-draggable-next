import { createApp } from 'vue'
import App from './App.vue'
import { registerComponents } from './components/dynamic'
import { store } from "./store";
import './index.css'
import './ribbons.css'

const app = createApp(App)
app.use(store)
app.use(registerComponents)
window.vm = app.mount('#app')
