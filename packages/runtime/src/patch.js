import { unmount } from "./unmount";
import { DOM_TYPES, extractChildren } from "./h";
import { mount } from "./mount";
import { areNodesEqual } from "./nodes-equal";
import {
  removeAttribute,
  setAttribute,
  removeStyle,
  setStyle,
} from "./attributes";
import { addEventListener } from "./events";
import {
  arrayDiff,
  arrayDiffSeq,
  objectDiff,
  ARRAY_DIFF_OP,
} from "./utils/diff";
import { isNotBlankOrEmptyString } from "./utils/string";

export function patch(prev, next, root, hostComponent = null) {
  if (!areNodesEqual(prev, next)) {
    const idx = findChildIndex(root, prev.el);
    unmount(prev);
    mount(next, root, idx, hostComponent);

    return next;
  }

  next.el = prev.el;

  switch (next.type) {
    case DOM_TYPES.TEXT: {
      patchText(prev, next);
      return next;
    }
    case DOM_TYPES.ELEMENT: {
      patchElement(prev, next, hostComponent);
      break;
    }
  }

  patchChildren(prev, next, hostComponent);

  return next;
}

function findChildIndex(root, el) {
  const idx = Array.from(root.childNodes).indexOf(el);
  return idx < 0 ? null : idx;
}

function patchText(prev, next) {
  if (prev.value !== next.value) prev.el.nodeValue = next.value;
}

function patchElement(prev, next, hostComponent) {
  const {
    class: pClass,
    style: pStyle,
    on: pEvents,
    ...pAttributes
  } = prev.props;

  const {
    class: nClass,
    style: nStyle,
    on: nEvents,
    ...nAttributes
  } = next.props;

  patchAttributes(prev.el, pAttributes, nAttributes);
  patchClasses(prev.el, pClass, nClass);
  patchStyles(prev.el, pStyle, nStyle);
  next.listeners = patchEvents(
    prev.el,
    prev.listeners,
    pEvents,
    nEvents,
    hostComponent
  );
}

function patchAttributes(el, prev, next) {
  const { added, removed, updated } = objectDiff(prev, next);

  for (const attr of removed) {
    removeAttribute(el, attr);
  }

  for (const attr of added.concat(updated)) {
    setAttribute(el, attr, next[attr]);
  }
}

function patchClasses(el, prev, next) {
  const prevList = toClassList(prev);
  const nextList = toClassList(next);
  const { added, removed } = arrayDiff(prevList, nextList);

  if (removed.length > 0) el.classList.remove(...removed);
  if (added.length > 0) el.classList.add(...added);
}

function toClassList(cls = "") {
  return (typeof cls === "string" ? cls.split(/(\s+)/) : cls).filter(
    isNotBlankOrEmptyString
  );
}

function patchStyles(el, prev = {}, next = {}) {
  const { added, removed, updated } = objectDiff(prev, next);

  for (const style of removed) {
    removeStyle(el, style);
  }

  for (const style of added.concat(updated)) {
    setStyle(el, style, next[style]);
  }
}

function patchEvents(
  el,
  prevListeners = {},
  prevEvents = {},
  nextEvents = {},
  hostComponent
) {
  const { removed, added, updated } = objectDiff(prevEvents, nextEvents);

  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, prevListeners[eventName]);
  }

  const addedListeners = {};

  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(
      eventName,
      nextEvents[eventName],
      el,
      hostComponent
    );
    addedListeners[eventName] = listener;
  }

  return addedListeners;
}

function patchChildren(prev, next, host) {
  const prevChildren = extractChildren(prev);
  const nextChildren = extractChildren(next);
  const root = prev.el;
  const diff = arrayDiffSeq(prevChildren, nextChildren, areNodesEqual);

  for (const operation of diff) {
    const { originalIndex, index, item, from } = operation;
    const offset = host ? host.offset : 0;

    switch (operation.op) {
      case ARRAY_DIFF_OP.ADD: {
        mount(item, root, index + offset, host);
        break;
      }
      case ARRAY_DIFF_OP.REMOVE: {
        unmount(item);
        break;
      }
      case ARRAY_DIFF_OP.MOVE: {
        const prevChild = prevChildren.at(originalIndex);
        const nextChild = nextChildren.at(index);
        const el = prevChild.el;
        const elAtTargetIndex = root.childNodes[index + offset];

        root.insertBefore(el, elAtTargetIndex);
        patch(prevChild, nextChild, root, host);

        break;
      }
      case ARRAY_DIFF_OP.NOOP: {
        patch(
          prevChildren.at(originalIndex),
          nextChildren.at(index),
          root,
          host
        );
        break;
      }
    }
  }
}
