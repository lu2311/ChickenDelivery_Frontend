import { esVentaDeHoyEnLima, limaDateKey } from "./limaDate";

export function combinarSemanaConPedidosHoy(datosSemana, pedidos, ahora = new Date()) {
  const fechaHoy = limaDateKey(ahora);
  const pedidosHoy = pedidos.filter((pedido) => esVentaDeHoyEnLima(pedido, ahora));
  const filaHoy = {
    fecha: fechaHoy,
    delivery: pedidosHoy.filter((pedido) => pedido.tipoEntrega?.toLowerCase() === "delivery").length,
    recojo: pedidosHoy.filter((pedido) => pedido.tipoEntrega?.toLowerCase() === "recojo").length,
  };

  return [
    ...datosSemana.filter((item) => item.fecha !== fechaHoy),
    filaHoy,
  ].sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
}

function fechaYHoraLima(value) {
  if (typeof value === "string" && !/(Z|[+-]\d{2}:?\d{2})$/i.test(value)) {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2})/);
    return match ? { fecha: match[1], hora: Number(match[2]) } : null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return { fecha: `${part("year")}-${part("month")}-${part("day")}`, hora: Number(part("hour")) };
}

export function ventasPorHoraSemanaActual(pedidos, ahora = new Date()) {
  const [year, month, day] = limaDateKey(ahora).split("-").map(Number);
  const today = new Date(Date.UTC(year, month - 1, day, 12));
  const daysFromMonday = today.getUTCDay() === 0 ? 6 : today.getUTCDay() - 1;
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - daysFromMonday);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const start = monday.toISOString().slice(0, 10);
  const end = sunday.toISOString().slice(0, 10);
  const totals = new Map(Array.from({ length: 12 }, (_, index) => [index + 9, 0]));

  pedidos.forEach((pedido) => {
    const dateTime = fechaYHoraLima(pedido.fechaVenta);
    if (dateTime && dateTime.fecha >= start && dateTime.fecha <= end && totals.has(dateTime.hora)) {
      totals.set(dateTime.hora, totals.get(dateTime.hora) + 1);
    }
  });

  return Array.from(totals, ([hora, ventas]) => ({ hora, ventas }));
}
