import { DOM_TYPES } from "./h";
import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";

export function mount(vdom, root, idx) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT:
      return createTextNode(vdom, root, idx);
    case DOM_TYPES.ELEMENT:
      return createElementNode(vdom, root, idx);
    case DOM_TYPES.FRAGMENT:
      return createFragmentNode(vdom, root, idx);
    default:
      throw new Error(`Unexpected node type ${vdom.type}`);
  }
}

function createTextNode(vdom, root, idx) {
  const { value } = vdom;

  const textNode = document.createTextNode(value);
  vdom.el = textNode;

  insert(textNode, root, idx);
}

function createFragmentNode(vdom, root, idx) {
  const { children } = vdom;
  vdom.el = root;

  children.forEach((child, i) => mount(child, root, idx ? idx + i : null));
}

function createElementNode(vdom, root, idx) {
  const { tag, props, children } = vdom;

  const element = document.createElement(tag);
  addProps(element, props, vdom);
  vdom.el = element;

  children.forEach((child) => mount(child, element));
  insert(element, root, idx);
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props;

  vdom.listeners = addEventListeners(events, el);
  setAttributes(el, attrs);
}

function insert(el, root, idx) {
  if (idx === null || idx === undefined) {
    root.append(el);
    return;
  }

  if (idx < 0) {
    throw new Error(`Index must be a positive int, got ${index}`);
  }

  const children = root.childNodes;

  if (idx >= children.length) {
    root.append(el);
  } else {
    root.insertBefore(el, children[idx]);
  }
}
