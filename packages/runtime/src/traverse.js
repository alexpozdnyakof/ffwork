export function traverseDeepFirstSearch(
  vdom,
  processNode,
  shouldSkipBranch = () => false,
  parentNode = null,
  index = null
) {
  if (shouldSkipBranch(vdom)) return;
  processNode(vdom, parentNode, index);

  if (vdom.children) {
    vdom.children.forEach((child, i) =>
      traverseDeep(child, processNode, shouldSkipBranch, vdom, i)
    );
  }
}
