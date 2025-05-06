import './assets/main.css'
import 'iconify-icon'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import SvgRectangle from "@/components/board/Rectangle.vue"


const app = createApp(App)

app.component('svg-rectangle', SvgRectangle)

app.use(createPinia())
app.use(router)

app.mount('#app')

