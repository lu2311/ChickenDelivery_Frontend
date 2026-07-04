import { useCallback, useEffect, useState } from "react";
import carrito_compras from "../icons/carrito-compras.png";
import { prediccionService } from "../../../services/resourceServices";

export default function Prediccion() {
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [entrenando, setEntrenando] = useState(false);
  const [error, setError] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  const obtenerDatosManana = useCallback(() => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return {
      dia_semana_num: manana.getDay() === 0 ? 6 : manana.getDay() - 1,
      mes: manana.getMonth() + 1,
      dia: manana.getDate(),
      es_feriado: 0,
    };
  }, []);

  const cargarEstado = useCallback(async () => {
    const data = await prediccionService.estado();
    setEstado(data);
    setEntrenando(data.estado === "entrenando");
    return data;
  }, []);

  const actualizarPanel = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      const [prediction] = await Promise.all([
        prediccionService.obtener(obtenerDatosManana()),
        cargarEstado(),
      ]);
      setResultado(prediction);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servicio de predicción. Verifique que la API de IA esté ejecutándose en el puerto 8000.");
    } finally {
      setCargando(false);
    }
  }, [cargarEstado, obtenerDatosManana]);

  const iniciarEntrenamiento = async () => {
    try {
      setError("");
      setEntrenando(true);
      await prediccionService.entrenar();
      await cargarEstado();
    } catch (err) {
      setEntrenando(false);
      setError(String(err));
    }
  };

  useEffect(() => {
    actualizarPanel();
  }, [actualizarPanel]);

  useEffect(() => {
    if (!entrenando) return undefined;
    const interval = setInterval(cargarEstado, 2000);
    return () => clearInterval(interval);
  }, [cargarEstado, entrenando]);

  const horas = estado?.ventas_por_hora || [];
  const maxVentas = Math.max(1, ...horas.map((item) => Number(item.ventas)));
  const datosSemana = estado?.datos_semana_actual || [];
  const metricas = estado?.metricas || {};
  const datoHora = horas.find((item) => item.hora === horaSeleccionada);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 24 }}>
        <h5 style={{ fontWeight: 800, margin: 0, fontSize: "1.3rem" }}>Predicción y entrenamiento de IA</h5>
        <button className="btn-secundario" onClick={actualizarPanel} disabled={cargando}>Actualizar panel</button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <Stat label="Pedidos Delivery" value={cargando ? "..." : resultado?.delivery ?? "--"} />
        <Stat label="Pedidos Recojo" value={cargando ? "..." : resultado?.recojo ?? "--"} />
        <Stat label="Pedidos previstos" value={cargando ? "..." : resultado?.total ?? "--"} icon={carrito_compras} />
      </div>

      {error && <div className="prediction-error">{error}</div>}

      <div className="prediction-grid">
        <section className="panel-pedido prediction-card">
          <div className="prediction-card-header">
            <div>
              <h3>Estado del entrenamiento</h3>
              <span className={`training-status training-${estado?.estado || "sin-conexion"}`}>{estado?.estado || "Sin conexión"}</span>
            </div>
            <button className="btn-primario" onClick={iniciarEntrenamiento} disabled={entrenando || !estado}>
              {entrenando ? "ENTRENANDO..." : "ENTRENAR AHORA"}
            </button>
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

        <section className="panel-pedido prediction-card">
          <h3>Métricas del modelo</h3>
          <div className="training-meta">
            <Info label="MAE Delivery" value={metricas.mae_delivery ?? "--"} />
            <Info label="MAE Recojo" value={metricas.mae_recojo ?? "--"} />
            <Info label="R² Delivery" value={metricas.r2_delivery ?? "--"} />
            <Info label="R² Recojo" value={metricas.r2_recojo ?? "--"} />
          </div>
          <p className="prediction-help">MAE indica el error promedio en pedidos. R² cercano a 1 indica mejor ajuste.</p>
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

function Info({ label, value }) {
  return <div className="training-info"><span>{label}</span><strong>{value}</strong></div>;
}

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("es-PE");
}
