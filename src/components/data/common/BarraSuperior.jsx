export default function BarraSuperior({ titulo, usuario, onSalir }) {
  return (
    <div className="barra-superior">
      <span className="titulo-app">{titulo}</span>

      <div className="info-usuario">
        <span>{usuario}</span>

        <button className="btn-salir" onClick={onSalir}>
          ↪ Salir
        </button>
      </div>
    </div>
  );
}