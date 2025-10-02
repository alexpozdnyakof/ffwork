import { unmount } from "./unmount";
import { mount } from "./mount";
import { patch } from "./patch";
import {
  DOM_TYPES,
  didCreateSlot,
  extractChildren,
  resetDidCreateSlot,
} from "./h";
import { dispatcher } from "@fwork/dispatcher";
import { fillSlots } from "./slots";
import { compareIt } from "compare-it";
const noop = () => {};

export function defineComponent({
  render,
  state,
  onMounted = noop,
  onUnmounted = noop,
  ...methods
}) {
  class Component {
    #isMounted = false;
    #vdom = null;
    #hostEl = null;
    #eventHandlers = null;
    #parentComponent = null;
    #dispatcher = dispatcher();
    #subscriptions = [];
    #appContext = null;
    #children = [];
    state;
    props;

    constructor(props = {}, eventHandlers = {}, parentComponent = null) {
      this.props = props;
      this.state = state ? state(props) : {};
      this.#eventHandlers = eventHandlers;
      this.#parentComponent = parentComponent;
    }

    setExternalContent(children) {
      this.#children = children;
    }

    onMounted() {
      console.log("mount", onMounted.toString());
      return Promise.resolve(onMounted.call(this));
    }

    setAppContext(newContext) {
      this.#appContext = newContext;
    }
    get appContext() {
      return this.#appContext;
    }
    onUnmounted() {
      console.log("unmount", onUnmounted.toString());
      return Promise.resolve(onUnmounted.call(this));
    }

    get elements() {
      if (this.#vdom === null || this.#vdom === undefined) {
        return [];
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return extractChildren(this.#vdom).flatMap((child) =>
          child.type === DOM_TYPES.COMPONENT
            ? child.component.elements
            : [child.el]
        );
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

    emit(eventName, payload) {
      this.#dispatcher.dispatch(eventName, payload);
    }

    updateProps(props) {
      const next = { ...this.props, ...props };
      if (!compareIt(next, this.props)) {
        this.props = next;
        this.#patch();
      }
    }

    updateState(state) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    render() {
      const vdom = render.call(this);
      if (didCreateSlot()) {
        fillSlots(vdom, this.#children);
        resetDidCreateSlot();
      }

      return vdom;
    }

    mount(hostEl, idx = null) {
      if (this.#isMounted) {
        throw new Error("Component is already mounted");
      }
      this.#vdom = this.render();
      mount(this.#vdom, hostEl, idx, this);
      this.#wireEventHandlers();
      this.#hostEl = hostEl;
      this.#isMounted = true;
    }

    unmount() {
      if (!this.#isMounted) {
        throw new Error("Trying unmount not mounted component");
      }
      unmount(this.#vdom);
      this.#subscriptions.forEach((unsubscribe) => unsubscribe());
      this.#vdom = null;
      this.#hostEl = null;
      this.#isMounted = false;
      this.#subscriptions = [];
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error("Trying to patch component that is not mounted yet");
      }

      const next = this.render();
      this.#vdom = patch(this.#vdom, next, this.#hostEl, this);
    }
    #wireEventHandlers() {
      this.#subscriptions = Object.entries(this.#eventHandlers).map(
        ([name, handler]) => this.#wireEventHandler(name, handler)
      );
    }

    #wireEventHandler(eventName, handler) {
      return this.#dispatcher.subscribe(eventName, (payload) => {
        if (this.#parentComponent) {
          handler.call(this.#parentComponent, payload);
        } else {
          handler(payload);
        }
      });
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
