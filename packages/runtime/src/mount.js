import { DOM_TYPES } from "./h";
import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";


export function mount(vdom, root) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: return createTextNode(vdom, root);
    case DOM_TYPES.ELEMENT: return createElementNode(vdom, root);
    case DOM_TYPES.FRAGMENT: return createFragmentNode(vdom, root);
    default: throw new Error(`Unexpected node type ${vdom.type}`);
  }
}

function createTextNode(vdom, root) {
  const { value } = vdom;

  const textNode = document.createTextNode(value);
  vdom.el = textNode;
  root.append(textNode);
}

function createFragmentNode(vdom, root) {
  const { children } = vdom;
  vdom.el = root;

  children.forEach(child => mount(child, root));
}


function createElementNode(vdom, root) {
  const { tag, props, children } = vdom;

  const element = document.createElement(tag);
  addProps(element, props, vdom);
  vdom.el = element;

  children.forEach(child => mount(child, element));
  root.append(element);
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props;

  vdom.listeners = addEventListeners(events, el);
  setAttributes(el, attrs);
}

