import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import './ribbons.css'

const app = createApp(App)
window.vm = app.mount('#app')
