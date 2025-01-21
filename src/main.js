import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import pinia from './store'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import './permission'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ElementPlus)

app.mount('#app')
