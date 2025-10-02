import { expect, test, beforeEach, vi } from "vitest";
import { mount } from "./mount";
import { unmount } from "./unmount";
import { h, hString, hFragment } from "./h";

beforeEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

test("should remove the mounted element", () => {
  const node = h("button");
  mount(node, document.body);
  expect(document.body.innerHTML).toBe("<button></button>");
  unmount(node);
  expect(document.body.innerHTML).toBe("");
});

test("should remove the reference of mounted element", () => {
  const node = h("button");
  mount(node, document.body);
  expect(node.el).toBeDefined();
  unmount(node);
  expect(node.el).not.toBeDefined();
});

test("should remove the reference of mounted text", () => {
  const node = hString("text");
  mount(node, document.body);
  expect(node.el).toBeDefined();
  unmount(node);
  expect(node.el).not.toBeDefined();
});

test("should remove the mounted text", () => {
  const node = hString("text");
  mount(node, document.body);
  expect(document.body.innerHTML).toBe("text");
  unmount(node);
  expect(document.body.innerHTML).toBe("");
});

test("should remove the reference of mounted fragment", () => {
  const node = hFragment([h("button"), hString("text")]);
  mount(node, document.body);
  expect(node.el).toBeDefined();
  unmount(node);
  expect(node.el).not.toBeDefined();
});

test("should remove the mounted fragment", () => {
  const node = hFragment([h("button"), hString("text")]);
  mount(node, document.body);
  expect(document.body.innerHTML).toBe("<button></button>text");
  unmount(node);
  expect(document.body.innerHTML).toBe("");
});

test("should remove the mounted fragment and save an other elements in root", () => {
  const fragment = hFragment([h("button"), hString("text")]);
  const element = h("div");
  mount(fragment, document.body);
  mount(element, document.body);
  expect(document.body.innerHTML).toBe("<button></button>text<div></div>");
  unmount(fragment);
  expect(document.body.innerHTML).toBe("<div></div>");
});
