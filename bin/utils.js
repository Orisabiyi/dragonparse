export function checkDifferentBoolConstruct(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.toLowerCase();

  if ((normalizedValue === "true" || normalizedValue === "false") && value !== normalizedValue) {
    return "error";
  }

  return null
}
