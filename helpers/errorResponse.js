export function getErrorResponse(status, fields, code) {
  return {
    status,
    error: {
      fields,
      code,
    },
  };
}
