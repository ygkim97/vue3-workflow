import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VueFlowCorePlugin from './plugins/vue-flow-core.client'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('VueFlowCore', VueFlowCorePlugin)

app.mount('#app')
