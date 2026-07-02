export function toupper(input) {
  if (input === null || input === undefined) return "";
  return String(input).toUpperCase();
}

export function tolower(input) {
  if (input === null || input === undefined) return "";
  return String(input).toLowerCase();
}

export function toFirstWordUpper(input) {
  if (input === null || input === undefined) return "";
  const s = String(input).trim();
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default {
  toupper,
  tolower,
  toFirstWordUpper,
};
