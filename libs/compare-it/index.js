export function compareIt(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a === "object") {
    if (a.constructor !== b.constructor) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0; i <= a.length; i++) {
        if (!compareIt(a[i], b[i])) return false;
      }
      return true;
    }

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (const [key, value] of a.entries()) {
        if (b.has(key) && compareIt(b.get(key), value)) {
          continue;
        } else {
          return false;
        }
      }
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      return compareIt(Array.from(a), Array.from(b));
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      if (a.length !== b.length) return false;

      for (let i = 0; i <= a.length; i++) {
        if (!compareIt(a[i], b[i])) return false;
      }

      return true;
    }

    if (a.constructor === RegExp)
      return a.source === b.source && a.flags === b.flags;

    if (Object.prototype.valueOf !== a.valueOf)
      return a.valueOf() === b.valueOf();

    if (Object.prototype.toString !== a.toString)
      return a.toString() === b.toString();

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const prop of keysA) {
      if (prop in b && compareIt(a[prop], b[prop])) {
        continue;
      } else {
        return false;
      }
    }

    return true;
  }

  return a !== a && b !== b && a !== b;
}
