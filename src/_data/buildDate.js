// Build timestamp as a UTC date string. Deliberately not toISOString() on a
// local-midnight Date — that lands on the previous day in negative-offset zones.
export default () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
};
