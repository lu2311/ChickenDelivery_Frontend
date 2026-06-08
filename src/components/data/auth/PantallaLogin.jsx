import { useState } from "react";
import pollo from '../icons/pollo.png';

export default function PantallaLogin({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const manejarSubmit = () => {
if (contrasena === "admin") {
  onLogin({
    nombre: usuario,
    rol: "admin"
  });
} else if (contrasena === "empleado") {
  onLogin({
    nombre: usuario,
    rol: "empleado"
  });
}
  };

return (
  <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div className="tarjeta-login" style={{ width: "380px", padding: "32px", borderRadius: "16px" }}>
      <div className="icono-login"><img src={pollo} alt="Pollo" style={{ width: '60px', height: '60px'}} /> </div>
      <div style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: 4 }}>Ikigai Deli Express</div>
      <div style={{ fontSize: "0.95rem", color: "#888", marginBottom: 28 }}>Sistema de Gestión de Pedidos</div>

      <input
        className="campo-texto"
        placeholder="Usuario*"
        value={usuario}
        onChange={e => { setUsuario(e.target.value); setError(""); }}
        style={{ marginBottom: 12, padding: "12px", fontSize: "1rem", width: "100%" }}
        onKeyDown={e => e.key === "Enter" && manejarSubmit()}
      />

      <input
        className="campo-texto"
        type="password"
        placeholder="Contraseña*"
        value={contrasena}
        onChange={e => { setContrasena(e.target.value); setError(""); }}
        style={{ marginBottom: 12, padding: "12px", fontSize: "1rem",width: "100%" }}
        onKeyDown={e => e.key === "Enter" && manejarSubmit()}
      />

      {error && <div style={{ color: "#c0392b", fontSize: "0.9rem", marginBottom: 10 }}>{error}</div>}

      <button className="btn-primario" style={{ width: "100%", padding: "14px", fontSize: "1rem" }} onClick={manejarSubmit}>
        INICIAR SESIÓN
      </button>

      <div style={{ marginTop: 16, fontSize: "0.85rem", color: "#aaa" }}>
        admin/admin · empleado/empleado
      </div>
    </div>
  </div>

  
);
}