import { unmount } from "./unmount";
import { mount } from "./mount";
import { dispatcher } from "./dispatcher";
import { patch } from "./patch";

export function createApp({ state, view, reducers = {} }) {
  let root = null;
  let vdom = null;
  let _state = state;
  let isMounted = false;
  const _dispatcher = dispatcher();

  const emit = (eventName, payload) => {
    _dispatcher.dispatch(eventName, payload);
  };

  const render = () => {
    const next = view(_state, emit);
    vdom = patch(vdom, next, root);
  };

  const subscriptions = [_dispatcher.after(render)];

  for (const actionName in reducers) {
    const reducer = reducers[actionName];

    const subscribe = _dispatcher.subscribe(actionName, (payload) => {
      _state = reducer(_state, payload);
    });
    subscriptions.push(subscribe);
  }

  return {
    mount(_root) {
      if (isMounted) throw new Error("The app is already mounted");
      root = _root;
      vdom = view(state, emit);
      mount(vdom, root);
    },
    unmount() {
      unmount(vdom);
      vdom = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
      isMounted = false;
    },
  };
}
