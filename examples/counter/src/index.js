import { createApp, h, hString } from "runtime/dist/fwork";

const app = createApp({
  state: 0,
  reducers: {
    inc: (state) => state + 1,
    dec: (state) => state - 1
  },
  view: (state, emit) => h(
    "div", 
    { class: "counter__container" }, 
    [
      h("button", {on: {click(){ emit("dec") }}}, [hString("dec")]),
      hString(state),
      h("button", {on: { click(){ emit("inc") }}}, [hString("inc")]),
    ])
});

app.mount(document.querySelector("#root"));

