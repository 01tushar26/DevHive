// Extract a human-readable message from a backend error response
// (same helper the Materials dashboard uses, plus DevHive's data.message shape)
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (data) {
    if (data.error?.message) return data.error.message;
    if (typeof data.error === "string") return data.error;
    if (data.data?.message) return data.data.message;
  }

  if (error?.message) return error.message;

  return fallback;
}