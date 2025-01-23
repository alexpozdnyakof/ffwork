import { unmount } from "./unmount";
import { mount } from "./mount";
import { dispatcher } from "./dispatcher";

export function createApp({ state, view, reducers = {} }) {
  let root = null;
  let vdom = null;
  let _state = state;
  const _dispatcher = dispatcher();
  
  const emit = (eventName, payload) => { _dispatcher.dispatch(eventName, payload) };
  
  const render = () => {
    if(vdom) {
      unmount(vdom);
    } 

    vdom = view(_state, emit);
    mount(vdom, root);
  }
  
  const subscriptions = [_dispatcher.after(render)];

  for (const actionName in reducers) {
    const reducer = reducers[actionName];

    const subscribe = _dispatcher.subscribe(actionName, (payload) => { _state = reducer(_state, payload) });
    subscriptions.push(subscribe);
  }

  return {
    mount(_root) {
      root = _root;
      render();
    },
    unmount() {
      unmount(vdom);
      vdom = null;
      subscriptions.forEach(unsubscribe => unsubscribe());
    }
  }
}

