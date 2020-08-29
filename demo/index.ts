import { createApp } from 'vue'
import App from './App.vue'

import { store } from "./store";
import './index.css'
import './ribbons.css'

const app = createApp(App)
app.use(store)
window.vm = app.mount('#app')
