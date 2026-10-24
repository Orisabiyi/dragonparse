export function checkDifferentBoolConstruct(value) {
  if (typeof value !== "string") {
    throw new Error("value is not a string")
  }

  const normalizedValue = value.toLowerCase();

  if ((normalizedValue === "true" || normalizedValue === "false") && value !== normalizedValue) {
    return "error";
  }

  return null
}

export function checkDifferentNullConstruct(value) {
    if (typeof value !== "string") {
    throw new Error("value is not a string")
  }

  const normalizedValue = value.toLowerCase();

  if (normalizedValue === 'null' && value !== normalizedValue) {
    return "error";
  }
}