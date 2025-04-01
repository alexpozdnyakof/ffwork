import { DOM_TYPES } from "./h";
import { removeEventListeners } from "./events";

export function unmount(vdom) {
  const { type } = vdom;

  switch (type) {
    case DOM_TYPES.TEXT: {
      removeTextNode(vdom);
      break;
    }
    case DOM_TYPES.ELEMENT: {
      removeElementNode(vdom);
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      removeFragmentNode(vdom);
      break;
    }
    default:
      throw new Error(`Unexpected type ${type}`);
  }

  delete vdom.el;
}

function removeTextNode(v) {
  const { el: element } = v;
  element.remove();
}
function removeElementNode(v) {
  const { el: element, children, listeners } = v;

  element.remove();
  children.forEach(unmount);

  if (listeners) {
    removeEventListeners(listeners, element);
    delete v.listeners;
  }
}
function removeFragmentNode(v) {
  const { children } = v;
  children.forEach(unmount);
}
