// Dates from the API look like 2026-10-10T00:00:00.000Z, so show only 2026-10-10
export const formatDate = (value) => (value ? String(value).slice(0, 10) : '');
