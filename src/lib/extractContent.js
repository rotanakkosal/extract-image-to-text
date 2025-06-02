// Combine content from NDJSON response objects
export function extractContents(objects) {
  return objects
    .map(obj => obj.message?.content)
    .filter(Boolean)
    .join("");
}
