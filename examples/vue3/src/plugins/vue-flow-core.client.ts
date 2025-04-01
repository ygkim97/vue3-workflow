import { defineAsyncComponent } from 'vue'
import '../../../../dist/vue-flow-core.min.css'
// @ts-ignore
import VueFlowCore from '../../../../dist/vue-flow-core.es.min.js'

export default defineAsyncComponent(() => {
  return new Promise((resolve) => {
    resolve(VueFlowCore)
  })
})
