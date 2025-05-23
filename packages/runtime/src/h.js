import { withoutNulls } from "./utils/arrays";

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
  COMPONENT: "component",
};

function mapTextNodes(children) {
  return children.map((child) =>
    typeof child === "string" ? hString(child) : child
  );
}

export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str };
}

export function hFragment(vNodes) {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
}

export function h(tag, props = {}, children = []) {
  const { class: classNames, ...rest } = props;

  return {
    tag,
    props: {
      ...rest,
      class: Array.isArray(classNames) ? withoutNulls(classNames) : classNames,
    },
    children: mapTextNodes(withoutNulls(children)),
    type: typeof tag === "string" ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT,
  };
}

export function extractChildren(v) {
  if (v.children === null || v.children === undefined) return [];

  const children = [];

  for (const child of v.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child, children));
    } else {
      children.push(child);
    }
  }

  return children;
}
