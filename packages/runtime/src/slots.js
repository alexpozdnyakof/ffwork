import { DOM_TYPES, hFragment } from "./h";
import { traverseDeepFirstSearch } from "./traverse";

export function fillSlots(vdom, external = []) {
  function processNode(node, parent, index) {
    insertViewInSlot(node, parent, index, external);
  }

  traverseDeepFirstSearch(vdom, processNode, shouldSkipBranch);
}

function insertViewInSlot(node, parent, index, external) {
  if (node.type !== DOM_TYPES.SLOT) return;

  const view = external.length > 0 ? external : node.children;
  const hasContent = view.length > 0;

  if (hasContent) {
    parent.children.splice(index, 1, hFragment(view));
  } else {
    parent.children.splice(index, 1);
  }
}

function shouldSkipBranch(node) {
  return node.type === DOM_TYPES.COMPONENT;
}
