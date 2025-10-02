import { expect, test } from "vitest";
import { makeRouteMatcher } from "../src/route-matchers";

test("should match with route", () => {
  const route = { path: "/home" };
  const matcher = makeRouteMatcher(route);

  expect(matcher.checkMatch(route.path)).toBeTruthy();
  expect(matcher.checkMatch("/user")).toBeFalsy();
});

test("should extract query params", () => {
  const route = { path: "/home" };
  const matcher = makeRouteMatcher(route);

  expect(matcher.extractQuery(route.path)).toEqual({});
  expect(matcher.extractQuery(route.path.concat("?tab=profile"))).toEqual({
    tab: "profile",
  });
});

test("should match route with dynamic segments", () => {
  const route = { path: "/user/:id/orders/:orderId" };
  const matcher = makeRouteMatcher(route);

  expect(matcher.checkMatch("/user/123/orders/456")).toBeTruthy();
});

test("should extract dynamic params from route", () => {
  const route = { path: "/user/:id/orders/:orderId" };
  const matcher = makeRouteMatcher(route);

  expect(matcher.extractParams("/user/123/orders/456")).toEqual({
    id: "123",
    orderId: "456",
  });
});
