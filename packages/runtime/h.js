import { withoutNulls } from "./utils/arrays";

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
}


function mapTextNodes(children) { return children.map(child => typeof child === "string" ? hString(child) : child) };

function hString(str) { return ({ type: DOM_TYPES.TEXT, value: str }) };

function hFragment(vNodes) { return ({ type: DOM_TYPES.FRAGMENT, children: mapTextNodes(withoutNulls(vNodes)) }) };

export function h(tag, props = {}, children = {}) {
  return ({
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT
  })
}
