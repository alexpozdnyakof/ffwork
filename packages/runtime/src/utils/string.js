export function isNotEmptyString(str) {
  return str.length > 0;
}

export function isNotBlankOrEmptyString(str) {
  return isNotEmptyString(str.trim());
}
