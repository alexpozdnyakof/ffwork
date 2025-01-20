import { expect, test, beforeEach, vi } from "vitest";
import { mount } from "../src/mount";
import { h, hString, hFragment } from "../src/h";

beforeEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
})

test("should mount a text", () => {
  const node = hString("mounted");
  mount(node, document.body);
  expect(document.body.innerHTML).toBe("mounted");
})

test("should save the created text element reference to the mounted text", () => {
  const node = hString("mounted");
  expect(node["el"]).not.toBeDefined();
  mount(node, document.body);
  expect(node.el).toBeInstanceOf(Text);
  expect(node.el.textContent).toBe("mounted");
})

test("should mount an element", () => {
  const node = h("button", {}, [hString("submit")]);
  mount(node, document.body);
  expect(document.body.innerHTML).toBe("<button>submit</button>");
})

test("should save the created button element", () => {
  const node = h("button", {}, [hString("click")]);
  expect(node.el).not.toBeDefined();
  mount(node, document.body);
  expect(node.el).toBeInstanceOf(HTMLButtonElement);
})

test("should mount an element with attribute", () => {
  const node = h("button", { type: "submit" }, [hString("submit")]);
  mount(node, document.body);
  expect(document.body.innerHTML).toBe(`<button type="submit">submit</button>`);
})

test("should mount an element with single className", () => {
  const node = h("button", { class: "submit-btn" }, [hString("submit")]);
  mount(node, document.body);
  expect(document.body.innerHTML).toBe(`<button class="submit-btn">submit</button>`);
})

test("should mount an element with multiple classNames", () => {
  const node = h("button", { class: ["submit-btn","primary","outlined"] }, [hString("submit")]);
  mount(node, document.body);
  expect(document.body.innerHTML).toBe(`<button class="submit-btn primary outlined">submit</button>`);
})

test("should mount an element with style", () => {
  const node = h("button", { style: { fontWeight: "bold" } }, [hString("submit")]);
  mount(node, document.body);
  expect(document.body.innerHTML).toBe(`<button style="font-weight: bold;">submit</button>`);
  expect(node.el.style.fontWeight).toBe("bold")
})

test("should attach event listener to mounted element", () => {
  const handler = vi.fn();
  
  const node = h("button", { on: { click: handler } }, [hString("submit")]);
  mount(node, document.body);
  
  expect(node.listeners).toEqual({ click: expect.any(Function) });
  node.el.click();
  
  expect(handler).toBeCalledTimes(1);
});

test("should mount an fragment", () => {
  const node = hFragment([
    h("p", {}, ["first line"]),
    h("p", {}, ["second line"]),
  ]);
  mount(node, document.body);
  expect(document.body.innerHTML).toBe("<p>first line</p><p>second line</p>");
})

test("should mount nested fragments recursively", () => {
  const node = hFragment([
    h("p", {}, ["first line"]),
    h("p", {}, ["second line"]),
    hFragment([
      h("p", {}, ["third line"]),
      h("p", {}, ["fourth line"]),
    ]), 
  ]);
  mount(node, document.body);
  expect(document.body.innerHTML).toBe("<p>first line</p><p>second line</p><p>third line</p><p>fourth line</p>");
})


