import { expect, test, afterEach, beforeEach, vi } from "vitest";
import { createApp } from "./create-app";
import { h, hString } from "./h";
import { defineComponent } from "./component";
let app;

beforeEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

afterEach(() => {
  if (app && "unmount" in app) app.unmount();
  app = undefined;
});

const RootComponent = defineComponent({
  render() {
    const { text } = this.props;
    return h("button", { type: "submit" }, [text ?? hString("submit")]);
  },
});

test("it should mount app to the document", () => {
  app = createApp(RootComponent);
  app.mount(document.body);

  expect(document.body.innerHTML).toBe(`<button type="submit">submit</button>`);
});

test("it should throw an error when mount app twice", () => {
  app = createApp(RootComponent);
  app.mount(document.body);

  expect(document.body.innerHTML).toBe(`<button type="submit">submit</button>`);
  expect(() => app.mount(document.body)).toThrowError(
    "The app is already mounted"
  );
});

test("it should unmount app from the document", () => {
  app = createApp(RootComponent);
  app.mount(document.body);
  expect(document.body.innerHTML).toBeDefined();

  app.unmount();
  expect(document.body.innerHTML).toBe("");
  app = undefined;
});

test("it should throw an error when unmount not mounted app", () => {
  app = createApp(RootComponent);

  expect(() => app.unmount()).toThrowError("The app is not mounted");
  app = undefined;
});
