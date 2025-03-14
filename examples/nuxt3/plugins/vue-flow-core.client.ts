import { defineNuxtPlugin } from "#app";
import VueFlowCore from "../../../dist/vue-flow-core.es.min.js";
import "../../../dist/vue-flow-core.min.css";

export default defineNuxtPlugin((nuxtApp) => {
  console.log(VueFlowCore);
  nuxtApp.vueApp.component("VueFlowCore", VueFlowCore);
});
