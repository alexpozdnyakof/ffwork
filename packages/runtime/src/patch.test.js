import { beforeEach, expect, describe, it, test, vi } from "vitest";
import { h, hFragment, hString } from "./h";
import { patch } from "./patch";
import { mount } from "./mount";

function patchAfterMount(prev, next) {
  mount(prev, document.body);
  return patch(prev, next, document.body);
}

beforeEach(() => {
  document.body.innerHTML = "";
});

test("should patch with no changes", () => {
  const prev = h("div", {}, ["hello"]);
  const next = h("div", {}, ["hello"]);

  const v = patchAfterMount(prev, next, document.body);

  expect(document.body.innerHTML).toEqual("<div>hello</div>");
  expect(next.el).toBe(v.el);
});

test("should change the root node", () => {
  const prev = h("div", {}, ["text"]);
  const next = h("span", {}, ["text"]);

  const v = patchAfterMount(prev, next);

  expect(document.body.innerHTML).toEqual("<span>text</span>");
  expect(v.el).toBeInstanceOf(HTMLSpanElement);
  expect(next.el).toBe(v.el);
});

test("should change the root node and mount in the same index", () => {
  const staticV = h("p", {}, ["static"]);
  mount(h("p", {}, ["static"]), document.body);

  const prev = h("div", {}, ["text"]);
  const next = h("span", {}, ["text"]);
  mount(prev, document.body, 0);
  expect(document.body.innerHTML).toEqual("<div>text</div><p>static</p>");

  patch(prev, next, document.body);
  expect(document.body.innerHTML).toEqual("<span>text</span><p>static</p>");
});

test("sets the element in the new virtual dom from previous element when are elements same", () => {
  const prev = h("div", {}, ["text"]);
  const next = h("div", {}, ["text"]);

  const v = patch(prev, next);

  expect(prev.el).toBe(next.el);
});

test("should patch text", () => {
  const prev = hString("prev");
  const next = hString("next");

  patchAfterMount(prev, next);

  expect(document.body.innerHTML).toBe("next");
});

describe("fragments", () => {
  it("should patch nested fragments and add childs", () => {
    const prev = hFragment([hFragment([hString("con")])]);
    const next = hFragment([
      hFragment([hString("con"), hString("cat")]),
      h("p", {}, ["text"]),
    ]);

    patchAfterMount(prev, next);

    expect(document.body.innerHTML).toEqual("concat<p>text</p>");
  });
  it("should patch nested fragments and add child at index", () => {
    const prev = hFragment([
      hString("X"),
      hFragment([hString("Y"), hString("Z")]),
    ]);
    const next = hFragment([
      hFragment([hString("N")]),
      hString("X"),
      hFragment([hString("Y"), hFragment([hString("T"), hString("Z")])]),
    ]);

    patchAfterMount(prev, next);

    expect(document.body.innerHTML).toBe("NXYTZ");
  });
  it("should patch nested fragments and remove child", () => {
    const prev = hFragment([
      hFragment([hString("U")]),
      hString("X"),
      hFragment([hString("T"), hString("Y"), hString("Z")]),
    ]);

    const next = hFragment([
      hString("X"),
      hFragment([hString("Y"), hString("Z")]),
    ]);

    patchAfterMount(prev, next);

    expect(document.body.innerHTML).toBe("XYZ");
  });

  it("should patch nested fragments and move child", () => {
    const prev = hFragment([
      hString("X"),
      hFragment([hString("Y"), hString("Z")]),
    ]);

    const next = hFragment([
      hFragment([hString("Y")]),
      hString("X"),
      hFragment([hString("Z")]),
    ]);

    patchAfterMount(prev, next);

    expect(document.body.innerHTML).toBe("YXZ");
  });
});

describe("patching attributes", () => {
  it("should add attribute", () => {
    const prev = h("div", {});
    const next = h("div", { id: "next" });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div id="next"></div>`);
  });

  it("should remove attribute", () => {
    const prev = h("div", { id: "prev" });
    const next = h("div", {});

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div></div>`);
  });

  it("should update attribute", () => {
    const prev = h("div", { id: "prev" });
    const next = h("div", { id: "next" });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div id="next"></div>`);
  });
});

describe("patching classes", () => {
  it("should patch empty class", () => {
    const prev = h("div", { class: "" });
    const next = h("div", { class: "next" });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div class="next"></div>`);
  });

  it("should make class empty", () => {
    const prev = h("div", { class: "prev" });
    const next = h("div", { class: "" });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div class=""></div>`);
  });

  it("should change class", () => {
    const prev = h("div", { class: "prev" });
    const next = h("div", { class: "next" });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div class="next"></div>`);
  });

  it("should patch single class with multiple value", () => {
    const prev = h("div", { class: "prev" });
    const next = h("div", { class: ["prev", "next"] });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div class="prev next"></div>`);
  });
  it("should patch multiple class with single value", () => {
    const prev = h("div", { class: ["prev", "next"] });
    const next = h("div", { class: "next" });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div class="next"></div>`);
  });

  it("should add class to array", () => {
    const prev = h("div", { class: ["prev"] });
    const next = h("div", { class: ["prev", "next"] });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div class="prev next"></div>`);
  });

  it("should remove class from array", () => {
    const prev = h("div", { class: ["prev", "next"] });
    const next = h("div", { class: ["prev"] });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div class="prev"></div>`);
  });

  it("should add class to string", () => {
    const prev = h("div", { class: "prev" });
    const next = h("div", { class: "prev next" });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div class="prev next"></div>`);
  });

  it("should remove class from string", () => {
    const prev = h("div", { class: "prev next" });
    const next = h("div", { class: "prev" });

    patchAfterMount(prev, next);
    expect(document.body.innerHTML).toBe(`<div class="prev"></div>`);
  });
});

describe("patching style", () => {
  it("should add style", () => {
    const prev = h("div");
    const next = h("div", { style: { color: "red" } });

    patchAfterMount(prev, next);

    expect(document.body.innerHTML).toBe(`<div style="color: red;"></div>`);
  });

  it("should remove style", () => {
    const prev = h("div", { style: { color: "red" } });
    const next = h("div");

    patchAfterMount(prev, next);

    expect(document.body.innerHTML).toBe(`<div style=""></div>`);
  });

  it("should change style", () => {
    const prev = h("div", { style: { color: "red" } });
    const next = h("div", { style: { color: "blue" } });

    patchAfterMount(prev, next);

    expect(document.body.innerHTML).toBe(`<div style="color: blue;"></div>`);
  });
});

describe("patching event handlers", () => {
  it("should update event handler", () => {
    const prevHandler = vi.fn();
    const prev = h("button", { on: { click: prevHandler } }, ["submit"]);
    const nextHandler = vi.fn();
    const next = h("button", { on: { click: nextHandler } }, ["submit"]);

    patchAfterMount(prev, next);

    document.body.querySelector("button").click();

    expect(prevHandler).not.toHaveBeenCalled();
    expect(nextHandler).toHaveBeenCalled();
    expect(next.listeners).toBeDefined();
  });

  it("should remove event handler", () => {
    const prevHandler = vi.fn();
    const prev = h("button", { on: { click: prevHandler } }, ["submit"]);
    const next = h("button", {}, ["submit"]);

    patchAfterMount(prev, next);

    document.body.querySelector("button").click();

    expect(prevHandler).not.toHaveBeenCalled();
    expect(next.listeners).toStrictEqual({});
  });
});

describe("patching children", () => {
  describe("text nodes", () => {
    it("should add text node at the end", () => {
      const prev = h("div", {}, ["T"]);
      const next = h("div", {}, ["T", "U"]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe("<div>TU</div>");
    });

    it("should add text node at the beginning", () => {
      const prev = h("div", {}, ["T"]);
      const next = h("div", {}, ["U", "T"]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe("<div>UT</div>");
    });

    it("should add text node at the middle", () => {
      const prev = h("div", {}, ["T", "U"]);
      const next = h("div", {}, ["T", "M", "U"]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe("<div>TMU</div>");
    });

    it("should remove text node at the end", () => {
      const prev = h("div", {}, ["T", "U"]);
      const next = h("div", {}, ["T"]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe("<div>T</div>");
    });

    it("should remove text node at the beginning", () => {
      const prev = h("div", {}, ["U", "T"]);
      const next = h("div", {}, ["T"]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe("<div>T</div>");
    });

    it("should remove text node at the middle", () => {
      const prev = h("div", {}, ["T", "M", "U"]);
      const next = h("div", {}, ["T", "U"]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe("<div>TU</div>");
    });

    it("should change the value", () => {
      const prev = h("div", {}, ["T"]);
      const next = h("div", {}, ["U"]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe("<div>U</div>");
    });

    it("should move around", () => {
      const prev = h("div", {}, ["T", "M", "U"]);
      const next = h("div", {}, ["U", "T", "M"]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe("<div>UTM</div>");
    });

    it("should update recursively", () => {
      const prev = hFragment([
        h("p", {}, ["X"]),
        h("span", {}, ["Y"]),
        h("div", {}, ["Z"]),
      ]);
      const next = hFragment([
        h("div", {}, ["Z"]),
        h("span", { id: "y" }, ["Y"]),
      ]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(`<div>Z</div><span id="y">Y</span>`);
    });
  });

  describe("element nodes", () => {
    it("should add element node at the end", () => {
      const prev = h("div", {}, [h("span", {}, ["T"])]);
      const next = h("div", {}, [
        h("span", {}, ["T"]),
        h("span", { id: "u" }, ["U"]),
      ]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(
        `<div><span>T</span><span id="u">U</span></div>`
      );
    });

    it("should add element node at the beginning", () => {
      const prev = h("div", {}, [h("span", {}, ["T"])]);
      const next = h("div", {}, [
        h("span", { id: "u" }, ["U"]),
        h("span", {}, ["T"]),
      ]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(
        `<div><span id="u">U</span><span>T</span></div>`
      );
    });

    it("should add element node in the middle", () => {
      const prev = h("div", {}, [h("span", {}, ["T"]), h("span", {}, ["U"])]);
      const next = h("div", {}, [
        h("span", {}, ["T"]),
        h("span", { id: "m" }, ["M"]),
        h("span", {}, ["U"]),
      ]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(
        `<div><span>T</span><span id="m">M</span><span>U</span></div>`
      );
    });

    it("should remove element node from the end", () => {
      const prev = h("div", {}, [
        h("span", {}, ["T"]),
        h("span", { id: "u" }, ["U"]),
      ]);
      const next = h("div", {}, [h("span", {}, ["T"])]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(`<div><span>T</span></div>`);
    });

    it("should remove element node from the beginning", () => {
      const prev = h("div", {}, [
        h("span", { id: "u" }, ["U"]),
        h("span", {}, ["T"]),
      ]);
      const next = h("div", {}, [h("span", {}, ["T"])]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(`<div><span>T</span></div>`);
    });

    it("should remove element node from the middle", () => {
      const prev = h("div", {}, [
        h("span", {}, ["T"]),
        h("span", {}, ["M"]),
        h("span", {}, ["U"]),
      ]);
      const next = h("div", {}, [h("span", {}, ["T"]), h("span", {}, ["U"])]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(
        `<div><span>T</span><span>U</span></div>`
      );
    });
    it("should move around", () => {
      const prev = h("div", {}, [
        h("span", {}, ["T"]),
        h("span", {}, ["M"]),
        h("span", {}, ["U"]),
      ]);
      const next = h("div", {}, [
        h("span", {}, ["U"]),
        h("span", {}, ["T"]),
        h("span", {}, ["M"]),
      ]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(
        `<div><span>U</span><span>T</span><span>M</span></div>`
      );
    });
  });
  describe("fragment nodes", () => {
    it("should add element at the end", () => {
      const prev = hFragment([h("span", {}, ["T"])]);
      const next = hFragment([
        h("span", {}, ["T"]),
        h("span", { id: "u" }, ["U"]),
      ]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(
        `<span>T</span><span id="u">U</span>`
      );
    });

    it("should add element at the beginning", () => {
      const prev = hFragment([h("span", {}, ["T"])]);
      const next = hFragment([
        h("span", { id: "u" }, ["U"]),
        h("span", {}, ["T"]),
      ]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(
        `<span id="u">U</span><span>T</span>`
      );
    });

    it("should add element in the middle", () => {
      const prev = hFragment([h("span", {}, ["T"]), h("span", {}, ["U"])]);
      const next = hFragment([
        h("span", {}, ["T"]),
        h("span", { id: "m" }, ["M"]),
        h("span", {}, ["U"]),
      ]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(
        `<span>T</span><span id="m">M</span><span>U</span>`
      );
    });

    it("should remove element from the end", () => {
      const prev = hFragment([
        h("span", {}, ["T"]),
        h("span", { id: "u" }, ["U"]),
      ]);
      const next = hFragment([h("span", {}, ["T"])]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(`<span>T</span>`);
    });

    it("should remove element from the beginning", () => {
      const prev = hFragment([
        h("span", { id: "u" }, ["U"]),
        h("span", {}, ["T"]),
      ]);
      const next = hFragment([h("span", {}, ["T"])]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(`<span>T</span>`);
    });

    it("should remove element from the middle", () => {
      const prev = hFragment([
        h("span", {}, ["T"]),
        h("span", { id: "m" }, ["M"]),
        h("span", {}, ["U"]),
      ]);
      const next = hFragment([h("span", {}, ["T"]), h("span", {}, ["U"])]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(`<span>T</span><span>U</span>`);
    });

    it("should append the new fragment", () => {
      const prev = hFragment([h("span", {}, ["T"])]);
      const next = hFragment([
        h("span", {}, ["T"]),
        hFragment([h("span", {}, ["U"])]),
      ]);

      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(`<span>T</span><span>U</span>`);
    });

    it("should move children around", () => {
      const prev = hFragment([
        h("span", {}, ["T"]),
        h("span", {}, ["M"]),
        h("span", {}, ["U"]),
      ]);
      const next = hFragment([
        h("span", {}, ["U"]),
        h("span", {}, ["T"]),
        h("span", {}, ["M"]),
      ]);
      patchAfterMount(prev, next);

      expect(document.body.innerHTML).toBe(
        `<span>U</span><span>T</span><span>M</span>`
      );
    });
  });
});
