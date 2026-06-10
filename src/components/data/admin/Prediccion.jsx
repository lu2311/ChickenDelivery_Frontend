import { useEffect, useState } from "react";
import carrito_compras from "../icons/carrito-compras.png";

export default function Prediccion() {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const alturas = [45, 35, 62, 55, 75, 80, 45, 70, 68, 50, 40, 65];
  const maxAltura = Math.max(...alturas);

  const obtenerDatosManana = () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);

    let diaSemana = manana.getDay(); 
    diaSemana = diaSemana === 0 ? 7 : diaSemana;

    return {
      dia_semana_num: diaSemana,
      mes: manana.getMonth() + 1,
      dia: manana.getDate(),
      es_feriado: 0,
    };
  };

  const obtenerPrediccion = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await fetch("http://localhost:8080/api/prediccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obtenerDatosManana()),
      });

      if (!response.ok) {
        throw new Error("Error al obtener la predicción");
      }

      const data = await response.json();
      setResultado(data);
    } catch (error) {
      console.error(error);
      setError("No se pudo conectar con la predicción.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPrediccion();
  }, []);

  return (
    <div>
      <h5 style={{ fontWeight: 800, marginBottom: 26, fontSize: "1.3rem" }}>
        Predicción de venta para el día de mañana
      </h5>

      <div style={{ display: "flex", gap: 16, marginBottom: 26, flexWrap: "wrap" }}>
        <div className="tarjeta-stat">
          <div className="etiqueta">Pedidos Delivery</div>
          <div className="valor" style={{ fontSize: "1.8rem" }}>
            {cargando ? "..." : resultado ? resultado.delivery : "--"}
          </div>
        </div>

        <div className="tarjeta-stat">
          <div className="etiqueta">Pedidos Recojo</div>
          <div className="valor" style={{ fontSize: "1.8rem" }}>
            {cargando ? "..." : resultado ? resultado.recojo : "--"}
          </div>
        </div>

        <div className="tarjeta-stat">
          <div className="etiqueta">Pedidos previstos</div>
          <div
            className="valor"
            style={{
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src={carrito_compras}
              alt="Carro_compras"
              style={{ width: "35px", height: "35px" }}
            />
            {cargando ? "..." : resultado ? resultado.total : "--"}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ color: "red", fontWeight: 700, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <button
        onClick={obtenerPrediccion}
        style={{
          marginBottom: 20,
          padding: "10px 16px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Actualizar predicción
      </button>

      <div className="panel-pedido" style={{ maxWidth: 700, padding: 16 }}>
        <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, color: "#555" }}>
          Distribución por hora
        </div>

        <div className="prediccion-barra" style={{ height: 120 }}>
          {alturas.map((h, i) => (
            <div
              key={i}
              className="col"
              style={{ height: `${(h / maxAltura) * 110}px` }}
              title={`${i + 9}:00`}
            />
          ))}
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "0.85rem", color: "#999" }}>
              {i + 9}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, fontSize: "0.85rem", color: "#888" }}>
          Hora del día (horas)
        </div>
      </div>
    </div>
  );
}