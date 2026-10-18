// Only allow http(s) URLs and blob: previews as <img src>; anything else
// (javascript:, data:, malformed) falls back to an empty string.
export const safeImageSrc = (value) => {
  if (typeof value !== "string" || value === "") return "";
  try {
    const { protocol } = new URL(value, window.location.origin);
    return ["http:", "https:", "blob:"].includes(protocol) ? value : "";
  } catch {
    return "";
  }
};
