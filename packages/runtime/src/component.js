import { unmount } from "./unmount";
import { mount } from "./mount";
import { patch } from "./patch";
import { DOM_TYPES, extractChildren } from "./h";

export function defineComponent({ render, state, ...methods }) {
  class Component {
    #isMounted = false;
    #vdom = null;
    #hostEl = null;
    state;
    props;

    constructor(props = {}) {
      this.props = props;
      this.state = state ? state(props) : {};
    }

    get elements() {
      if (this.#vdom === null || this.#vdom === undefined) {
        return [];
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return extractChildren(this.#vdom).map((child) => child.el);
      }

      return [this.#vdom.el];
    }

    get firstElement() {
      return this.elements.at(0);
    }

    get offset() {
      return this.#vdom.type === DOM_TYPES.FRAGMENT
        ? Array.from(this.#hostEl.children).indexOf(this.firstElement)
        : 0;
    }

    updateState(state) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    render() {
      return render.call(this);
    }

    mount(hostEl, idx = null) {
      if (this.#isMounted) {
        throw new Error("Component is already mounted");
      }
      this.#vdom = this.render();
      mount(this.#vdom, hostEl, idx, this);
      this.#hostEl = hostEl;
      this.#isMounted = true;
    }

    unmount() {
      if (!this.#isMounted) {
        throw new Error("Trying unmount not mounted component");
      }
      unmount(this.#vdom);
      this.#vdom = null;
      this.#hostEl = null;
      this.#isMounted = false;
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error("Trying to patch component that is not mounted yet");
      }

      const next = this.render();
      this.#vdom = patch(this.#vdom, next, this.#hostEl, this);
    }
  }

  for (const methodName in methods) {
    // TODO: This check is always falsy and do nothing, need to be refactored
    if (Object.hasOwn(Component, methodName)) {
      throw new Error(`Method "${methodName}" already exists in the component`);
    }
    Component.prototype[methodName] = methods[methodName];
  }

  return Component;
}
