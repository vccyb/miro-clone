import './assets/main.css'
import 'iconify-icon'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import SvgRectangle from "@/components/board/Rectangle.vue"
import SvgEllipse from "@/components/board/Ellipse.vue"
import SvgNote from "@/components/board/Note.vue"
import SvgText from "@/components/board/Text.vue"
import SvgPath from "@/components/board/Path.vue"

const app = createApp(App)

app.component('svg-rectangle', SvgRectangle)
app.component('svg-ellipse', SvgEllipse)
app.component('svg-note', SvgNote)
app.component('svg-text', SvgText)
app.component('svg-path', SvgPath)

app.use(createPinia())
app.use(router)

app.mount('#app')



