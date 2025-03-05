import { defineNuxtPlugin } from "#app";
import YongsComponent from "../../../dist/yongs-component.es.min.js";

export default defineNuxtPlugin((nuxtApp) => {
  console.log(YongsComponent)
  nuxtApp.vueApp.component("YongComponent", YongsComponent);
});
