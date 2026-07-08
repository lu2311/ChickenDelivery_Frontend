export const LIMA_TIME_ZONE = "America/Lima";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;
const TIME_ZONE_PATTERN = /(Z|[+-]\d{2}:?\d{2})$/i;

export function limaDateKey(value = new Date()) {
  if (typeof value === "string" && !TIME_ZONE_PATTERN.test(value)) {
    return value.match(DATE_ONLY_PATTERN)?.slice(1).join("-") || null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LIMA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function esVentaDeHoyEnLima(venta, ahora = new Date()) {
  return limaDateKey(venta?.fechaVenta) === limaDateKey(ahora);
}

