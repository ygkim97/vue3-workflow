import { defineAsyncComponent } from 'vue'
import VueFlowCore from '../../../../dist/vue-flow-core.es.min.js'
import '../../../../dist/vue-flow-core.min.css'

export default defineAsyncComponent(() => {
  return new Promise((resolve) => {
    resolve(VueFlowCore)
  })
})
