export default function Notificacion({ mensaje, tipo = "exito" }) {
  return (
    <div className={`notificacion notificacion-${tipo}`}>
      {tipo === "error" ? "⚠" : "✓"} {mensaje}
    </div>
  );
}
