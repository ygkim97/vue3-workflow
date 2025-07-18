import { createElementBlock, openBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 448 512"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createElementVNode("path", { d: "M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7c-12-12-28.3-18.7-45.3-18.7zm0 96c0-17.7 14.3-32 32-32h192c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zm160 160a64 64 0 1 1 0 128 64 64 0 1 1 0-128" }, null, -1)
  ]));
}
const floppyDisk = { render };
export {
  floppyDisk as default,
  render
};
