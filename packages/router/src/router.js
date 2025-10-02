import { makeRouteMatcher } from "./matchers";
import { dispatcher as Dispatcher } from "@fwork/dispatcher";

const ROUTER_EVENT = "router-event";

function eq(x, y) {
  return x === y;
}

function getCurrentRouteHash() {
  const hash = document.location.hash;
  return hash === "" ? "/" : hash.slice(1);
}

async function checkRouteAccess(from, to) {
  const guard = to.beforeEnter;

  return (
    eq(typeof guard, "function")
      ? guard(from?.path, to?.path)
      : Promise.resolve(true)
  )
    .then((result) => {
      if (result === true) {
        return {
          redirectPath: null,
        };
      }

      if (typeof result === "string") {
        return {
          redirectPath: result,
        };
      }

      throw new Error("Not Allowed");
    })
    .catch((err) => {
      throw new Error("Guard internal error", err);
    });
}

export function HashRouter(routes = []) {
  const matchers = routes.map(makeRouteMatcher);
  const dispatcher = Dispatcher();
  const subscriptions = new WeakMap();
  const subscribers = new Set();

  let state = {
    matchedRoute: null,
    params: {},
    query: {},
  };

  let initialized = false;

  function onPopState() {
    return matchCurrentRoute();
  }
  function pushState(path) {
    window.history.pushState({}, "", `#${path}`);
  }

  function matchCurrentRoute() {
    return navigateTo(getCurrentRouteHash());
  }

  return {
    init() {
      if (initialized) return;

      if (document.location.hash === "") {
        window.history.replaceState({}, "", "#/");
      }

      window.addEventListener("popstate", onPopState);
      return this.navigateTo(getCurrentRouteHash()).then(() => {
        initialized = true;
      });
    },
    destroy() {
      if (!initialized) return;

      window.removeEventListener("popstate", onPopState);
      Array.from(subscribers).forEach(this.unsubscribe, this);
      initialized = false;
    },
    navigateTo(path) {
      const matcher = matchers.find((matcher) => matcher.checkMatch(path));

      if (matcher === undefined) {
        console.warn("[ROUTER]: No route matches for path", path);
        state = { ...state, matchedRoute: null, params: {}, query: {} };

        return;
      }

      if (matcher.isRedirect) {
        return navigateTo(matcher.route.redirect);
      }

      const from = state.matchedRoute;
      const to = matcher.route;

      return checkRouteAccess(from, to)
        .then(({ redirectPath }) => {
          if (redirectPath) {
            return navigateTo(redirectPath);
          }

          state = {
            ...state,
            matchedRoute: matcher.route,
            params: matcher.extractParams(path),
            query: matcher.extractQuery(path),
          };

          pushState(path);
          dispatcher.dispatch(ROUTER_EVENT, { from, to, router: this });
        })
        .catch(() => {
          console.warn("[ROUTER]: Can't access route", path);
        })
        .finally(() => Promise.resolve());
    },

    matchedRoute() {
      return state.matchedRoute;
    },
    params() {
      return state.params;
    },
    query() {
      return state.query;
    },
    back() {
      window.history.back();
    },
    forward() {
      window.history.forward();
    },
    subscribe(handler) {
      const unsubscribe = dispatcher.subscribe(ROUTER_EVENT, handler);

      subscriptions.set(handler, unsubscribe);
      subscribers.add(handler);
    },
    unsubscribe(handler) {
      const unsubscribe = subscriptions.get(handler);

      if (unsubscribe) {
        unsubscribe();
        subscriptions.delete(handler);
        subscribers.delete(handler);
      }
    },
  };
}

export function NoopRouter() {
  return {
    init() {},
    destroy() {},
    navigateTo() {},
    back() {},
    forward() {},
    subscribe() {},
    unsubscribe() {},
  };
}
