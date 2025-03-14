import { defineNuxtPlugin } from "#app";
import VueFlowCore from "../../../dist/vue-flow-core.es.min.js";

export default defineNuxtPlugin((nuxtApp) => {
  console.log(VueFlowCore)
  nuxtApp.vueApp.component("VueFlowCore", VueFlowCore);
});
