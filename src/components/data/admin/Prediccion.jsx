import { useCallback, useEffect, useState } from "react";
import carrito_compras from "../icons/carrito-compras.png";
import { prediccionService } from "../../../services/resourceServices";
import { limaDateKey } from "../../../utils/limaDate";
import { combinarSemanaConPedidosHoy, ventasPorHoraSemanaActual } from "../../../utils/predictionData";

const PREDICTION_CACHE_KEY = "chicken-prediction-panel";
const PREDICTION_CACHE_DURATION = 5 * 60 * 1000;
const REQUEST_TIMEOUT = 10000;

function withTimeout(request, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), REQUEST_TIMEOUT);
  });
  return Promise.race([request, timeout]).finally(() => clearTimeout(timeoutId));
}

function readPredictionCache() {
  try {
    const cache = JSON.parse(sessionStorage.getItem(PREDICTION_CACHE_KEY));
    return cache && Date.now() - cache.savedAt < PREDICTION_CACHE_DURATION ? cache : null;
  } catch {
    return null;
  }
}

let predictionCache = readPredictionCache();

function updatePredictionCache(data) {
  predictionCache = { ...(predictionCache || {}), ...data, savedAt: Date.now() };
  try {
    sessionStorage.setItem(PREDICTION_CACHE_KEY, JSON.stringify(predictionCache));
  } catch {
    // El panel funciona sin caché si el navegador bloquea el almacenamiento.
  }
}

export default function Prediccion({ pedidos = [] }) {
  const [resultado, setResultado] = useState(() => predictionCache?.resultado?.hoy ? predictionCache.resultado : null);
  const [estado, setEstado] = useState(() => predictionCache?.estado || null);
  const [cargando, setCargando] = useState(false);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  const obtenerDatosFecha = useCallback((diasDesdeHoy) => {
    const [year, month, day] = limaDateKey().split("-").map(Number);
    const fecha = new Date(Date.UTC(year, month - 1, day + diasDesdeHoy, 12));
    return {
      dia_semana_num: fecha.getUTCDay() === 0 ? 6 : fecha.getUTCDay() - 1,
      mes: fecha.getUTCMonth() + 1,
      dia: fecha.getUTCDate(),
      es_feriado: 0,
    };
  }, []);

  const cargarEstado = useCallback(async () => {
    const data = await prediccionService.estado();
    setEstado(data);
    updatePredictionCache({ estado: data });
    return data;
  }, []);

  const actualizarPanel = useCallback(async (forzar = false) => {
    if (!forzar && predictionCache?.resultado?.hoy && predictionCache?.resultado?.manana && predictionCache?.estado) return;

    try {
      setCargando(true);
      const cargarPrediccion = (nombre, diasDesdeHoy) => withTimeout(
        prediccionService.obtener(obtenerDatosFecha(diasDesdeHoy)),
        `La predicción de ${nombre === "hoy" ? "hoy" : "mañana"} no respondió a tiempo.`,
      ).then((prediction) => {
        setResultado((previous) => {
          const predictions = { ...(previous || {}), [nombre]: prediction };
          updatePredictionCache({ resultado: predictions });
          return predictions;
        });
        return prediction;
      });

      const results = await Promise.allSettled([
        cargarPrediccion("hoy", 0),
        cargarPrediccion("manana", 1),
        cargarEstado(),
      ]);
      const errors = results
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason?.message || String(result.reason));
      if (errors.length) console.warn("Servicio de predicción no disponible:", errors);
    } finally {
      setCargando(false);
    }
  }, [cargarEstado, obtenerDatosFecha]);

  useEffect(() => {
    actualizarPanel();
  }, [actualizarPanel]);

  useEffect(() => {
    let cancelado = false;
    let temporizador;

    const actualizarAutomaticamente = async () => {
      try {
        await actualizarPanel(true);
      } catch (err) {
        console.warn("No se pudo actualizar automáticamente la predicción:", err);
      } finally {
        if (!cancelado) temporizador = setTimeout(actualizarAutomaticamente, 30000);
      }
    };

    temporizador = setTimeout(actualizarAutomaticamente, 30000);
    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
  }, [actualizarPanel]);

  const horas = ventasPorHoraSemanaActual(pedidos);
  const maxVentas = Math.max(1, ...horas.map((item) => Number(item.ventas)));
  const datosSemana = combinarSemanaConPedidosHoy(estado?.datos_semana_actual || [], pedidos);
  const datoHora = horas.find((item) => item.hora === horaSeleccionada);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 24 }}>
        <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Predicción y entrenamiento de IA</h5>
        <button className="btn-secundario" onClick={() => actualizarPanel(true)} disabled={cargando}>Actualizar panel</button>
      </div>

      <div style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
        <PredictionDay title="Predicción de hoy" prediction={resultado?.hoy} loading={cargando && !resultado?.hoy} />
        <PredictionDay title="Predicción de mañana" prediction={resultado?.manana} loading={cargando && !resultado?.manana} />
      </div>

      <div>
        <section className="panel-pedido prediction-card">
          <div className="prediction-card-header">
            <div>
              <h3>Estado del entrenamiento</h3>
              <span className={`training-status training-${estado?.estado || "sin-conexion"}`}>{estado?.estado || "Sin conexión"}</span>
            </div>
          </div>
          <div className="training-stage">{estado?.etapa || "Esperando conexión con la IA"}</div>
          <div className="training-progress"><div style={{ width: `${estado?.progreso || 0}%` }} /></div>
          <div className="training-meta">
            <Info label="Progreso" value={`${estado?.progreso || 0}%`} />
            <Info label="Filas utilizadas" value={estado?.filas_utilizadas ?? "--"} />
            <Info label="Ventas esta semana" value={estado?.ventas_semana_actual ?? "--"} />
            <Info label="Próximo entrenamiento" value={formatDateTime(estado?.proxima_ejecucion)} />
            <Info label="Último entrenamiento" value={formatDateTime(estado?.ultimo_entrenamiento)} />
            <Info label="Rango del modelo" value={estado?.rango_datos ? `${estado.rango_datos.desde} a ${estado.rango_datos.hasta}` : "--"} />
          </div>
          {estado?.error && <div className="prediction-error">{estado.error}</div>}
        </section>
      </div>

      <section className="panel-pedido prediction-card" style={{ marginTop: 20 }}>
        <h3>Ventas reales por hora - semana actual</h3>
        <div className="interactive-hour-chart" role="img" aria-label="Ventas por hora">
          {horas.map((item) => (
            <button key={item.hora} className={`hour-column ${horaSeleccionada === item.hora ? "selected" : ""}`} onClick={() => setHoraSeleccionada(item.hora)} title={`${item.hora}:00 - ${item.ventas} ventas`}>
              <span className="hour-value">{item.ventas}</span>
              <span className="hour-bar" style={{ height: `${Math.max(5, (Number(item.ventas) / maxVentas) * 150)}px` }} />
              <span className="hour-label">{item.hora}</span>
            </button>
          ))}
        </div>
        <div className="chart-selection">{datoHora ? `${datoHora.hora}:00 registró ${datoHora.ventas} venta(s)` : "Seleccione una barra para ver el detalle"}</div>
      </section>

      <section className="panel-pedido prediction-card" style={{ marginTop: 20 }}>
        <h3>Datos que alimentarán el próximo entrenamiento</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="tabla-datos">
            <thead><tr><th>Fecha</th><th>Delivery</th><th>Recojo</th><th>Total</th></tr></thead>
            <tbody>
              {datosSemana.map((item) => <tr key={item.fecha}><td>{item.fecha}</td><td>{item.delivery}</td><td>{item.recojo}</td><td>{Number(item.delivery) + Number(item.recojo)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return <div className="tarjeta-stat"><div className="etiqueta">{label}</div><div className="valor" style={{ fontSize: "1.8rem", display: "flex", gap: 8 }}>{icon && <img src={icon} alt="" style={{ width: 32, height: 32 }} />}{value}</div></div>;
}

function PredictionDay({ title, prediction, loading }) {
  return (
    <section style={{ flex: "1 1 520px" }}>
      <h3 style={{ margin: "0 0 12px", fontSize: "1.05rem" }}>{title}</h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Stat label="Pedidos Delivery" value={loading ? "..." : prediction?.delivery ?? "--"} />
        <Stat label="Pedidos Recojo" value={loading ? "..." : prediction?.recojo ?? "--"} />
        <Stat label="Pedidos previstos" value={loading ? "..." : prediction?.total ?? "--"} icon={carrito_compras} />
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return <div className="training-info"><span>{label}</span><strong>{value}</strong></div>;
}

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("es-PE");
}
