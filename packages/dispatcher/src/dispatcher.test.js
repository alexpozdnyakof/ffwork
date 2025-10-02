import { test, expect, vi } from "vitest";
import { dispatcher } from "./index";

test("it should run all main handlers consistently with passed payload", () => {
  const increment = (number) => number + 1;
  const handlerOne = vi.fn().mockImplementation(increment);
  const handlerTwo = vi.fn().mockImplementation(increment);

  const disp = dispatcher();
  disp.subscribe("inc", handlerOne);
  disp.subscribe("inc", handlerTwo);

  disp.dispatch("inc", 1);

  expect(handlerOne).toHaveBeenCalledTimes(1);
  expect(handlerTwo).toHaveBeenCalledTimes(1);

  expect(handlerOne).toHaveBeenCalledWith(1);
  expect(handlerTwo).toHaveBeenCalledWith(1);
});

test("it should run all afterware handlers consistently with passed payload", () => {
  const increment = (number) => number + 1;
  const handlerOne = vi.fn().mockImplementation(increment);
  const handlerTwo = vi.fn().mockImplementation(increment);

  const disp = dispatcher();
  disp.after(handlerOne);
  disp.after(handlerTwo);

  disp.dispatch("inc", 1);

  expect(handlerOne).toHaveBeenCalledTimes(1);
  expect(handlerTwo).toHaveBeenCalledTimes(1);

  expect(handlerOne).toHaveBeenCalledWith(1);
  expect(handlerTwo).toHaveBeenCalledWith(1);
});

test("it should run afterware handlers for every dispatched command", () => {
  const afterWare = vi.fn();

  const disp = dispatcher();
  disp.after(afterWare);

  disp.dispatch("inc", 1);
  disp.dispatch("dec", 2);

  expect(afterWare).toHaveBeenCalledTimes(2);
  expect(afterWare).toHaveBeenCalledWith(1);
  expect(afterWare).toHaveBeenCalledWith(2);
});
