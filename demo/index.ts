import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import './index.css'
const app = createApp(App)
window.vm = app.mount('#app')
