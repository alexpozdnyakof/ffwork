import { unmount } from "./unmount";
import { mount } from "./mount";
import { h } from "./h";
export function createApp(RootComponent, props = {}) {
  let root = null;
  let vdom = null;
  let isMounted = false;

  function reset() {
    root = null;
    isMounted = false;
    vdom = null;
  }

  return {
    mount(_root) {
      if (isMounted) throw new Error("The app is already mounted");
      root = _root;
      vdom = h(RootComponent, props);
      mount(vdom, root);

      isMounted = true;
    },
    unmount() {
      if (!isMounted) throw new Error("The app is not mounted");
      unmount(vdom);
      reset();
    },
  };
}
