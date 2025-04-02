import { expect, test } from "vitest";
import { h, hFragment } from "../src/h";

test("should create element", () => {
  expect(h("div")).toEqual({
    tag: "div",
    type: "element",
    props: {},
    children: [],
  });
});

test("should add props and childrens to element", () => {
  expect(
    h(
      "form",
      {
        class: "login-form",
        action: "login",
      },
      [
        h("input", {
          type: "text",
          name: "user",
        }),
      ]
    )
  ).toEqual({
    tag: "form",
    type: "element",
    props: {
      class: "login-form",
      action: "login",
    },
    children: [
      {
        tag: "input",
        type: "element",
        props: {
          type: "text",
          name: "user",
        },
        children: [],
      },
    ],
  });
});

test("should remove nulled childrens", () => {
  expect(h("div", {}, [null])).toEqual({
    tag: "div",
    type: "element",
    props: {},
    children: [],
  });
});

test("should map raw string children to text element", () => {
  expect(h("div", {}, ["str"])).toEqual({
    tag: "div",
    type: "element",
    props: {},
    children: [
      {
        value: "str",
        type: "text",
      },
    ],
  });
});

test("should create fragment with props and childrens", () => {
  expect(
    hFragment([
      h("input", {
        type: "text",
        name: "user",
      }),
      h("input", {
        type: "password",
        name: "pass",
      }),
    ])
  ).toEqual({
    type: "fragment",
    children: [
      {
        tag: "input",
        type: "element",
        props: {
          type: "text",
          name: "user",
        },
        children: [],
      },
      {
        tag: "input",
        type: "element",
        props: {
          type: "password",
          name: "pass",
        },
        children: [],
      },
    ],
  });
});

test("should remove nulls from classlist", () => {
  const v = h("button", { class: ["abc", null] }, []);
  expect(v.props.class).toEqual(["abc"]);
});
