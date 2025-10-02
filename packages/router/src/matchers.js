export function makeRouteMatcher(route) {
  return routeHasParams(route)
    ? makeMatcherWithParams(route)
    : makeMatcherWithoutParams(route);
}

function routeHasParams({ path }) {
  return path.includes(":");
}

const isWildCard = (path) => path === "*";

function withoutParamsRegex({ path }) {
  return new RegExp(isWildCard(path) ? "^.*$" : `^${path}$`);
}

function makeMatcherWithoutParams(route) {
  const regex = withoutParamsRegex(route);
  const isRedirect = typeof route.redirect === "string";

  return {
    route,
    isRedirect,
    checkMatch(path) {
      return regex.test(path);
    },
    extractParams() {
      return {};
    },
    extractQuery,
  };
}

function extractQuery(path) {
  const queryIndex = path.indexOf("?");

  if (queryIndex === -1) return {};

  return Object.fromEntries(
    new URLSearchParams(path.slice(queryIndex + 1)).entries()
  );
}

function withParamsRegex({ path }) {
  const regex = path.replace(
    /:([^/]+)/g,
    (_, paramName) => `(?<${paramName}>[^/]+)`
  );

  return new RegExp(`^${regex}$`);
}

function makeMatcherWithParams(route) {
  const regex = withParamsRegex(route);
  const isRedirect = typeof route.redirect === "string";

  return {
    route,
    isRedirect,
    checkMatch(path) {
      return regex.test(path);
    },
    extractParams(path) {
      const { groups } = regex.exec(path);
      return groups;
    },
    extractQuery,
  };
}
