export function capitalizeStatement(sentence) {
  return typeof sentence === "string"
    ? sentence.replace(/(^|\.\s+)([a-z])/g, (match) => match.toUpperCase())
    : "";
}
