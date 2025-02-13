import { expect, test } from "vitest";
import { findWinline } from "./find-winline";

test("it should find the first horizontal winline", () => {
  const winline = findWinline(
    [
      "x", "x", "x",
      "x", "o", "o",
      "o", "x", "o"
    ],
    3
  );

  expect(winline).toEqual([0, 1, 2]);
})

test("it should find the second horizontal winline", () => {
  const winline = findWinline(
    [
      "x", "o", "o",
      "x", "x", "x",
      "o", "x", "o"
    ],
    3
  );

  expect(winline).toEqual([3, 4, 5]);
})

test("it should find the third horizontal winline", () => {
  const winline = findWinline(
    [
      "x", "o", "o",
      "o", "o", "x",
      "x", "x", "x",
    ],
    3
  );

  expect(winline).toEqual([6, 7, 8]);
})

test("it should ignore nulled lines", () => {
  const winline = findWinline(
    [
      null, null, null,
      null, null, null,
      null, null, null
    ],
    3
  );

  expect(winline).not.toBeDefined();
})

test("it should find the horizontal winline in random sized field", () => {
  const winline = findWinline(
    [
      "x", "o", "o", null, null,
      "o", "o", "x", null, null,
      "x", "x", "x", "x", "x",
      null, null, null, null,
      null, null, null, null,
    ],
    5
  );

  expect(winline).toEqual([10, 11, 12, 13, 14]);
})

test("it should find the first vertical winline", () => {
  const winline = findWinline(
    [
      "x", "o", "x",
      "x", "o", "o",
      "x", "x", "o"
    ],
    3
  );
  expect(winline).toEqual([0, 3, 6]);
})

test("it should find the second vertical winline", () => {
  const winline = findWinline(
    [
      "o", "x", "x",
      "o", "x", "o",
      "x", "x", "o"
    ],
    3
  );
  expect(winline).toEqual([1, 4, 7]);
})

test("it should find the third vertical winline", () => {
  const winline = findWinline(
    [
      null, "x", "x",
      "o",  "x", "x",
      null, "o", "x"
    ],
    3
  );
  expect(winline).toEqual([2, 5, 8]);
})

test("it should find the vertical winline in random sized field", () => {
  const winline = findWinline(
    [
      "x", "o",   "x", null, null,
      "o", "o",   "x", null, null,
      "x", "x",   "x", null, "x",
      null, null, "x", null, null,
      null, null, "x", null, null
    ],
    5
  );

  expect(winline).toEqual([2, 7, 12, 17, 22]);
})

test("it should find the descending winline", () => {
  const winline = findWinline(
    [
      "x",  "x", null,
      "o",  "x", null,
      null, "o", "x"
    ],
    3
  );
  expect(winline).toEqual([0, 4, 8]);
})

test("it should find the descending winline in random sized field", () => {
  const winline = findWinline(
    [
      "x", "o",   "x", null, null,
      "o", "x",   "x", null, null,
      "x", "x",   "x", null, "x",
      null, null, "x", "x",  null,
      null, null, "x", null, "x"
    ],
    5
  );

  expect(winline).toEqual([0, 6, 12, 18, 24]);
})

test("it should find the ascending winline", () => {
  const winline = findWinline(
    [
      "o",  "o", "x",
      "o",  "x", null,
      "x",  "o", "x"
    ],
    3
  );
  expect(winline).toEqual([2, 4, 6]);
})

test("it should find the asscending winline in random sized field", () => {
  const winline = findWinline(
    [
      "x",  "o",   "x", null, "x",
      "o",  "x",   "o", "x", null,
      "x",  "x",   "x", null, "x",
      null, "x",   "x", null,  null,
      "x",  null,  "x", null, "x"
    ],
    5
  );

  expect(winline).toEqual([4, 8, 12, 16, 20]);
})

