import { expect, test, afterEach, beforeEach, vi } from "vitest";
import { createApp } from "../src/create-app";
import { h, hString } from "../src/h";

let app;

beforeEach(() =>{
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
})

afterEach(() => {
  if (app && "unmount" in app) app.unmount();
  app = undefined;
})

test("it should mount app to the document", () => { 
  app = createApp({
    view: (state, emit) => h("button", {}, [hString("submit")])
  });
  app.mount(document.body);

  expect(document.body.innerHTML).toBe("<button>submit</button>") 
});

test("it should unmount app from the document", () => { 
  app = createApp({
    view: (state, emit) => h("button", {}, [hString("submit")])
  });
  app.mount(document.body);
  expect(document.body.innerHTML).toBeDefined();

  app.unmount();
  expect(document.body.innerHTML).toBe("");
  app = undefined;
});

test("it should render the state", () => { 
  app = createApp({
    state: 0,
    view: (state => hString(state))
  });
  app.mount(document.body);

  expect(document.body.innerHTML).toBe("0");
});

test("it should attach the handler and dispatch the command", () => {
  const handler = vi.fn();
  app = createApp({
    state: 0,
    reducers: {
      add: handler,
    },
    view: (state, emit) => h("button", { on: { click(){ emit("add", 1) }}}, [hString(state)])
  });

  app.mount(document.body);

  const button = document.body.querySelector("button");
  button.click();

  expect(handler).toHaveBeenCalledTimes(1); 
  expect(handler).toHaveBeenCalledWith(0, 1);
});

test("it should rerender the view when the state is changed", () => { 
  app = createApp({
    state: 0,
    reducers: {
      add: (state, count) => state + count,
    },
    view: (state, emit) => h("button", { on: { click(){ emit("add", 1) }}}, [hString(state)])
  });
  app.mount(document.body);
  expect(document.body.innerHTML).toBe("<button>0</button>");

  const button = document.body.querySelector("button");
  button.click();
  
  expect(document.body.innerHTML).toBe("<button>1</button>");  
});

