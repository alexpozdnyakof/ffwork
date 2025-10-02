import { unmount } from "./unmount";
import { mount } from "./mount";
import { h } from "./h";
import { NoopRouter } from "@fwork/router";

export function createApp(RootComponent, props = {}, options = {}) {
  let root = null;
  let vdom = null;
  let isMounted = false;

  const context = {
    router: options?.router || NoopRouter(),
  };

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
      mount(vdom, root, null, { appContext: context });
      context.router.init().then(() => (isMounted = true));
    },
    unmount() {
      if (!isMounted) throw new Error("The app is not mounted");
      unmount(vdom);
      context.router.destroy();
      reset();
    },
  };
}
