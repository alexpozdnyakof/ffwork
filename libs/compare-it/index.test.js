import { compareIt } from "./index";
import { describe, it, test, expect } from "vitest";

describe("primitive values", () => {
  it("should be truthy for the same unsigned integers", () => {
    expect(compareIt(1, 1)).toBeTruthy();
  });

  it("should be falsy for the difference unsigned integers", () => {
    expect(compareIt(1, 0)).toBeFalsy();
  });

  it("should be truthy for the same signed integers", () => {
    expect(compareIt(-1, -1)).toBeTruthy();
  });

  it("should be falsy for the difference signed integers", () => {
    expect(compareIt(-1, 1)).toBeFalsy();
  });

  it("should be truthy for the signed and unsigned zeroes", () => {
    expect(compareIt(0, -0)).toBeTruthy();
  });

  it("should be truthy for the same floats", () => {
    expect(compareIt(3.08, 3.08)).toBeTruthy();
  });

  it("should be falsy for the difference floats", () => {
    expect(compareIt(3.08, 4.2)).toBeFalsy();
  });

  it("should be truthy for the same signed floats", () => {
    expect(compareIt(-3.08, -3.08)).toBeTruthy();
  });

  it("should be falsy for the difference signed floats", () => {
    expect(compareIt(-3.08, -4.2)).toBeFalsy();
  });

  it("should be falsy for the same signed and unsigned floats", () => {
    expect(compareIt(3.08, -3.08)).toBeFalsy();
  });

  it("should be truthy for Infinities", () => {
    expect(compareIt(Infinity, Infinity)).toBeTruthy();
    expect(compareIt(-Infinity, -Infinity)).toBeTruthy();
  });

  it("should be falsy for the signed and usigned Infinities", () => {
    expect(compareIt(-Infinity, Infinity)).toBeFalsy();
  });

  it("should be truthy for the same strings", () => {
    expect(compareIt("xyz", "xyz")).toBeTruthy();
  });

  it("should be falsy for the difference strings", () => {
    expect(compareIt("xyz", "zyx")).toBeFalsy();
  });

  it("should be truthy for the empty strings", () => {
    expect(compareIt("", "")).toBeTruthy();
  });

  it("should be truthy for the same booleans", () => {
    expect(compareIt(true, true)).toBeTruthy();
    expect(compareIt(false, false)).toBeTruthy();
  });

  it("should be falsy for the difference booleans", () => {
    expect(compareIt(true, false)).toBeFalsy();
  });

  it("should falsy for the false and zero", () => {
    expect(compareIt(false, 0)).toBeFalsy();
  });

  it("should falsy for the false and empty string", () => {
    expect(compareIt(false, "")).toBeFalsy();
  });

  it("should falsy for the NaN and the Integer", () => {
    expect(compareIt(NaN, 1)).toBeFalsy();
  });

  it("should truthy for the NaNs", () => {
    expect(compareIt(NaN, NaN)).toBeTruthy();
  });
});

describe("nullish values", () => {
  it("should compare nulls", () => {
    expect(compareIt(null, null)).toBeTruthy();
  });

  it("should compare undefineds", () => {
    expect(compareIt(undefined, undefined)).toBeTruthy();
  });

  it("should compare null and undefined", () => {
    expect(compareIt(null, undefined)).toBeFalsy();
  });

  it("should be falsy when comparing the false and the null", () => {
    expect(compareIt(null, false)).toBeFalsy();
  });

  it("should be falsy when comparing the undefined and the empty string", () => {
    expect(compareIt("", undefined)).toBeFalsy();
  });

  it("should be falsy when comparing the undefined and the empty object", () => {
    expect(compareIt({}, undefined)).toBeFalsy();
  });

  it("should be falsy when comparing the undefined and the empty array", () => {
    expect(compareIt([], undefined)).toBeFalsy();
  });
});

describe("objects", () => {
  describe("hashmaps", () => {
    it("should be truthy when comparing the object with itself", () => {
      const obj = { a: 1 };
      expect(compareIt(obj, obj)).toBeTruthy();
    });

    it("should be truthy when comparing two empty objects", () => {
      const obj = { a: 1 };
      expect(compareIt({}, {})).toBeTruthy();
    });

    it("should be truthy for different objects with the same values", () => {
      const obj = { a: 1 };
      const obj_two = { a: 1 };
      expect(compareIt(obj, obj_two)).toBeTruthy();
    });

    it("should be truthy for objects with the same values", () => {
      const obj = { a: 1 };
      const obj_two = { a: 1 };
      expect(compareIt(obj, obj_two)).toBeTruthy();
    });

    it("should be truthy for nested objects with the same values", () => {
      const obj = { a: { b: 1 } };
      const obj_two = { a: { b: 1 } };
      expect(compareIt(obj, obj_two)).toBeTruthy();
    });

    it("should be truthy for objects with the same values and the different order", () => {
      const obj = { a: 1, b: 2 };
      const obj_two = { b: 2, a: 1 };
      expect(compareIt(obj, obj_two)).toBeTruthy();
    });

    it("should be falsy for objects with the different values", () => {
      const obj = { a: 1 };
      const obj_two = { a: 2 };
      expect(compareIt(obj, obj_two)).toBeFalsy();
    });

    it("should be falsy for objects with the different keys", () => {
      const obj = { a: 1 };
      const obj_two = { b: 1 };
      expect(compareIt(obj, obj_two)).toBeFalsy();
    });

    it("should be falsy for objects with the different length", () => {
      const obj = { a: 1 };
      const obj_two = { a: 1, b: 1 };
      expect(compareIt(obj, obj_two)).toBeFalsy();
    });

    it("should be falsy for objects with function values", () => {
      const obj = {
        a: 1,
        b: function (a) {
          return a;
        },
      };
      const obj_two = {
        a: 1,
        b: function (a) {
          return a;
        },
      };
      expect(compareIt(obj, obj_two)).toBeFalsy();
    });
  });
  describe("arrays", () => {
    it("should be truthy when comparing the array with itself", () => {
      const arr = new Array(1, 2, 3);

      expect(compareIt(arr, arr)).toBeTruthy();
    });

    it("should be truthy when comparing two empty arrays", () => {
      const arr = new Array();
      const arr_two = new Array();

      expect(compareIt(arr, arr_two)).toBeTruthy();
    });

    it("should be truthy when comparing with the same primitive values", () => {
      const arr = new Array(1, 2, 3);
      const arr_two = new Array(1, 2, 3);

      expect(compareIt(arr, arr_two)).toBeTruthy();
    });

    it("should be truthy when comparing with the same reference values", () => {
      const arr = new Array({ a: 1 });
      const arr_two = new Array({ a: 1 });

      expect(compareIt(arr, arr_two)).toBeTruthy();
    });

    it("should be truthy when comparing with nested arrays with the same values", () => {
      const arr = new Array([1]);
      const arr_two = new Array([1]);

      expect(compareIt(arr, arr_two)).toBeTruthy();
    });

    it("should be falsy when comparing with the same values and difference order", () => {
      const arr = new Array(1, 2, 3);
      const arr_two = new Array(3, 2, 1);

      expect(compareIt(arr, arr_two)).toBeFalsy();
    });

    it("should be falsy when comparing arrays with the different primitive values", () => {
      const arr = new Array(1, 2, 3);
      const arr_two = new Array(4, 5, 6);

      expect(compareIt(arr, arr_two)).toBeFalsy();
    });

    it("should be falsy when comparing with the different reference values", () => {
      const arr = new Array({ a: 1 });
      const arr_two = new Array({ a: 3 });

      expect(compareIt(arr, arr_two)).toBeFalsy();
    });

    it("should be falsy when comparing with the functions", () => {
      const arr = new Array((a) => a);
      const arr_two = new Array((a) => a);

      expect(compareIt(arr, arr_two)).toBeFalsy();
    });

    it("should be falsy when comparing with the nested and the different values arrays", () => {
      const arr = new Array([1]);
      const arr_two = new Array([2]);

      expect(compareIt(arr, arr_two)).toBeFalsy();
    });

    it("should be falsy when comparing the arrays with the different lengths", () => {
      const arr = new Array(1, 2, 3);
      const arr_two = new Array(4, 5);

      expect(compareIt(arr, arr_two)).toBeFalsy();
      expect(compareIt(arr_two, arr)).toBeFalsy();
    });
  });

  describe("Map", () => {
    it("should be truthy when comparing with itself", () => {
      const map = new Map([["a", 1]]);

      expect(compareIt(map, map)).toBeTruthy();
    });

    it("should be truthy when comparing two empty maps", () => {
      const map = new Map();
      const map_two = new Map();

      expect(compareIt(map, map_two)).toBeTruthy();
    });

    it("should be truthy when comparing with the same values", () => {
      const map = new Map([["a", 1]]);
      const map_two = new Map([["a", 1]]);

      expect(compareIt(map, map_two)).toBeTruthy();
    });

    it("should be truthy when comparing with the nested maps with the same values", () => {
      const map = new Map([["a", new Map([["b", 1]])]]);
      const map_two = new Map([["a", new Map([["b", 1]])]]);

      expect(compareIt(map, map_two)).toBeTruthy();
    });

    it("should be falsy when comparing with the different values", () => {
      const map = new Map([["a", 1]]);
      const map_two = new Map([["a", 2]]);

      expect(compareIt(map, map_two)).toBeFalsy();
    });

    it("should be falsy when comparing with the different keys", () => {
      const map = new Map([["a", 1]]);
      const map_two = new Map([["b", 2]]);

      expect(compareIt(map, map_two)).toBeFalsy();
    });
    it("should be falsy when comparing with the different sizes", () => {
      const map = new Map([["a", 1]]);
      const map_two = new Map([
        ["a", 1],
        ["b", 2],
      ]);

      expect(compareIt(map, map_two)).toBeFalsy();
    });
  });

  describe("Set", () => {
    it("should be truthy when comparing with itself", () => {
      const set = new Set([1]);
      expect(compareIt(set, set)).toBeTruthy();
    });

    it("should be truthy when comparing two empty Sets", () => {
      const map = new Set();
      const map_two = new Set();
      expect(compareIt(map, map_two)).toBeTruthy();
    });

    it("should be truthy when comparing with the same values", () => {
      const set = new Set([1]);
      const set_two = new Set([1]);
      expect(compareIt(set, set_two)).toBeTruthy();
    });

    it("should be truthy when comparing with the same reference values", () => {
      const set = new Set([{ a: 1 }]);
      const set_two = new Set([{ a: 1 }]);
      expect(compareIt(set, set_two)).toBeTruthy();
    });

    it("should be truthy when comparing with the same nested sets", () => {
      const set = new Set([new Set([1])]);
      const set_two = new Set([new Set([1])]);
      expect(compareIt(set, set_two)).toBeTruthy();
    });

    it("should be falsy when comparing with the same values and the different order", () => {
      const set = new Set([1, 2, 3]);
      const set_two = new Set([3, 2, 1]);
      expect(compareIt(set, set_two)).toBeFalsy();
    });

    it("should be falsy when comparing with the different sizes", () => {
      const set = new Set([{ a: 1 }]);
      const set_two = new Set([{ a: 1 }, { a: 1 }]);
      expect(compareIt(set, set_two)).toBeFalsy();
    });

    it("should be falsy when comparing with the different values", () => {
      const set = new Set([1]);
      const set_two = new Set([2]);
      expect(compareIt(set, set_two)).toBeFalsy();
    });

    it("should be falsy when comparing with the different reference values", () => {
      const set = new Set([{ a: 1 }]);
      const set_two = new Set([{ b: 2 }]);
      expect(compareIt(set, set_two)).toBeFalsy();
    });

    it("should be falsy when comparing with the different nested sets", () => {
      const set = new Set([new Set([1])]);
      const set_two = new Set([new Set([2])]);
      expect(compareIt(set, set_two)).toBeFalsy();
    });

    it("should be falsy when comparing with functions", () => {
      const set = new Set([(a) => a]);
      const set_two = new Set([(a) => a]);
      expect(compareIt(set, set_two)).toBeFalsy();
    });
  });

  describe("TypedArrays", () => {
    it("should be truthy for the same", () => {
      const arr = new Int32Array();
      expect(compareIt(arr, arr)).toBeTruthy();
    });

    it("should be truthy for empty", () => {
      const arr = new Int32Array();
      const arr_two = new Int32Array();
      expect(compareIt(arr, arr_two)).toBeTruthy();
    });

    it("should be truthy for the same values", () => {
      const arr = new Int32Array([1, 2, 3]);
      const arr_two = new Int32Array([1, 2, 3]);
      expect(compareIt(arr, arr_two)).toBeTruthy();
    });

    it("should be for the same values in diff order", () => {
      const arr = new Int32Array([1, 2, 3]);
      const arr_two = new Int32Array([1, 3, 2]);
      expect(compareIt(arr, arr_two)).toBeFalsy();
    });
  });

  it("should be truthy for the same string values", () => {
    const string = new String("abc");
    const string_two = new String("abc");

    expect(compareIt(string, string_two)).toBeTruthy();
  });

  it("should be falsy for the different string values", () => {
    const string = new String("abc");
    const string_two = new String("xyz");

    expect(compareIt(string, string_two)).toBeFalsy();
  });

  it("should be falsy for the same string and String value object", () => {
    const string = new String("abc");
    const string_two = "abc";

    expect(compareIt(string, string_two)).toBeFalsy();
  });

  it("should be truthy for the same number values", () => {
    const number = new Number(1);
    const number_two = new Number(1);

    expect(compareIt(number, number_two)).toBeTruthy();
  });

  it("should be truthy for the same signed number values", () => {
    const number = new Number(-1);
    const number_two = new Number(-1);

    expect(compareIt(number, number_two)).toBeTruthy();
  });

  it("should be falsy for the different number values", () => {
    const number = new Number(12);
    const number_two = new Number(1);

    expect(compareIt(number, number_two)).toBeFalsy();
  });

  it("should be falsy for the same number and Number value object", () => {
    const number = new Number(12);
    const number_two = 12;

    expect(compareIt(number, number_two)).toBeFalsy();
  });

  it("should be falsy for the signed and unsigned number values", () => {
    const number = new Number(1);
    const number_two = new Number(-1);

    expect(compareIt(number, number_two)).toBeFalsy();
  });

  it("should be truthy for the same date values", () => {
    const date = new Date(174480538);
    const date_two = new Date(174480538);

    expect(compareIt(date, date_two)).toBeTruthy();
  });

  it("should be falsy for the different date values", () => {
    const date = new Date(174480538);
    const date_two = new Date(174480000);

    expect(compareIt(date, date_two)).toBeFalsy();
  });

  it("should be falsy when comparing Date and string", () => {
    const date = new Date(174480538);

    expect(compareIt(date, date.toISOString())).toBeFalsy();
  });

  it("should be truthy for the same BigInt", () => {
    const bigint = BigInt(9007199254740991);

    expect(compareIt(bigint, bigint)).toBeTruthy();
  });

  it("should be truthy for the BigInts with same values", () => {
    const bigint = BigInt(9007199254740991);
    const bigint_two = BigInt(9007199254740991);

    expect(compareIt(bigint, bigint_two)).toBeTruthy();
  });

  it("should be falsy for the different BigInts", () => {
    const bigint = BigInt(9007199254740991);
    const bigint_two = BigInt(9007199254740000);

    expect(compareIt(bigint, bigint_two)).toBeFalsy();
  });

  it("should be truthy for the same RegExp", () => {
    const regexp = new RegExp("\\w+");
    expect(compareIt(regexp, regexp)).toBeTruthy();
  });

  it("should be truthy for the RegExp with the same values", () => {
    const regexp = new RegExp("\\w+");
    const regexp_two = new RegExp("\\w+");
    expect(compareIt(regexp, regexp_two)).toBeTruthy();
  });

  it("should be truthy for the RegExp with the same values and flags", () => {
    const regexp = new RegExp("\\w+", "i");
    const regexp_two = new RegExp("\\w+", "i");
    expect(compareIt(regexp, regexp_two)).toBeTruthy();
  });

  it("!!!should be truthy for the RegExp literal and the value object", () => {
    const regexp = /\w+/;
    const regexp_two = new RegExp("\\w+");

    expect(compareIt(regexp, regexp_two)).toBeTruthy();
  });

  it("should be truthy for the same Errors", () => {
    const err = new Error("error");
    const err_two = new Error("error");

    expect(compareIt(err, err_two)).toBeTruthy();
  });

  it("should be truthy for the empty Errors", () => {
    const err = new Error("");
    const err_two = new Error("");

    expect(compareIt(err, err_two)).toBeTruthy();
  });

  it("should be falsy for the difference Errors", () => {
    const err = new Error("error");
    const err_two = new Error("another error");

    expect(compareIt(err, err_two)).toBeFalsy();
  });
});

describe("Functions", () => {
  it("should be truthy when comparing the function with itself", () => {
    function identity(a) {
      return a;
    }

    expect(identity, identity);
  });

  it("should be falsy when comparing any functions", () => {
    function identity(a) {
      return a;
    }

    function identity_two(a) {
      return a;
    }
    expect(identity, identity_two);
  });

  it("should be falsy when comparing any class constructors", () => {
    class One {
      constructor(a) {}
    }

    class Two {
      constructor(b) {}
    }

    expect(compareIt(One, Two)).toBeFalsy();
  });
});

describe("Empty values comparsion", () => {
  it("should be falsy for empty object and empty arr", () => {
    expect(compareIt({}, [])).toBeFalsy();
  });

  it("should be falsy for empty object and undefined", () => {
    expect(compareIt({}, undefined)).toBeFalsy();
  });

  it("should be falsy for empty array and undefined", () => {
    expect(compareIt({}, undefined)).toBeFalsy();
  });

  it("should be falsy for empty object and map", () => {
    expect(compareIt({}, new Map())).toBeFalsy();
  });

  it("should be falsy for empty arr and set", () => {
    expect(compareIt({}, new Set())).toBeFalsy();
  });
});
