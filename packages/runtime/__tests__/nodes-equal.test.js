import { expect, test } from "vitest";
import { h, hString, hFragment } from "../src/h";
import { areNodesEqual } from "../src/nodes-equal";

test("should return false for element and text node", () => {
  expect(areNodesEqual(h("button"), hString("text"))).toBeFalsy();
});

test("should return true for two button nodes", () => {
  expect(areNodesEqual(h("button"), h("buttom"))).toBeFalsy();
});
