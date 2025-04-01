import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// NOTE: VueFlowCore 플러그인 등록 후, 프로젝트의 CSS 를 나중에 import 하여 우선순위 조정
import VueFlowCorePlugin from './plugins/vue-flow-core.client'
import '@/assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('VueFlowCore', VueFlowCorePlugin)

app.mount('#app')
