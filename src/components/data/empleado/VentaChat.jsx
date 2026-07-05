import { useMemo, useRef, useState, useEffect } from "react";
import { registrarVentaCompleta } from "../../../services/orderRegistration";
import { mergeSaleItems, normalizeSaleText, parseCatalogItems } from "../../../utils/salesChatParser";

const initialDraft = () => ({
  dni: "",
  cliente: null,
  anonima: false,
  items: [],
  tipoEntrega: "",
  metodoPago: "",
  canalVenta: "",
  direccionEntrega: "",
  productoPendiente: null,
});

function extractFields(text, current, productos, clientes) {
  const plain = normalizeSaleText(text);
  const next = { ...current };
  const dni = text.match(/\b\d{8}\b/)?.[0];

  if (dni) {
    next.dni = dni;
    next.cliente = clientes.find((cliente) => cliente.dni === dni) || null;
    next.anonima = false;
    if (next.cliente?.direccion) next.direccionEntrega = next.cliente.direccion;
  }

  if (/\bdelivery\b|\ba domicilio\b/.test(plain)) next.tipoEntrega = "Delivery";
  if (/\brecojo\b|\brecoger\b|\btienda\b/.test(plain)) next.tipoEntrega = "Recojo";
  if (/\befectivo\b/.test(plain)) next.metodoPago = "Efectivo";
  if (/\byape\b/.test(plain)) next.metodoPago = "Yape";
  if (/\btarjeta\b/.test(plain)) next.metodoPago = "Tarjeta";
  if (/\bwhatsapp\b/.test(plain)) next.canalVenta = "WhatsApp";
  else if (/\btelefono\b|\btelefonica\b|\bllamada\b/.test(plain)) next.canalVenta = "Telefono";
  else if (/\bpresencial\b|\bmostrador\b/.test(plain)) next.canalVenta = "Presencial";

  const addressMatch = text.match(/(?:direcci[oó]n|enviar a|entregar en)\s*(?:es|:)?\s*(.+?)(?=\s+(?:pago|por\s+yape|en\s+efectivo|con\s+tarjeta|canal|delivery|recojo)\b|$)/i);
  if (addressMatch?.[1]?.trim()) next.direccionEntrega = addressMatch[1].trim().replace(/[\s,;.-]+$/, "");

  const parsed = parseCatalogItems(text, productos.filter((producto) => producto.estado));
  if (parsed.items.length) next.items = mergeSaleItems(next.items, parsed.items);
  next.productoPendiente = parsed.unresolved[0] || null;

  return next;
}

export default function VentaChat({ clientes, productos, usuario, setPedidos, mostrarNotificacion }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hola, soy Kira. Escríbeme la venta completa o empieza indicándome el DNI del cliente." },
  ]);
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState(initialDraft);
  const [waiting, setWaiting] = useState("free");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const activeProducts = useMemo(() => productos.filter((producto) => producto.estado), [productos]);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const addBot = (text, actions = []) => {
    setMessages((previous) => [...previous, { from: "bot", text, actions }]);
  };

  const total = (data) => data.items.reduce(
    (sum, item) => sum + Number(item.precio) * item.cantidad,
    data.tipoEntrega === "Delivery" ? 3 : 0
  );

  const askNext = (data) => {
    if (!data.cliente && !data.anonima) {
      if (data.dni.length === 8) {
        setWaiting("dniDecision");
        addBot(`No encontré un cliente con DNI ${data.dni}. ¿Deseas corregirlo o continuar como venta anónima?`, ["CORREGIR DNI", "VENTA ANÓNIMA"]);
      } else {
        setWaiting("dni");
        addBot("¿Cuál es el DNI del cliente? Debe tener 8 dígitos.");
      }
      return;
    }
    if (data.productoPendiente) {
      setWaiting("productChoice");
      const pending = data.productoPendiente;
      if (pending.options.length) {
        addBot(`“${pending.description}” coincide con varios productos. ¿Cuál deseas agregar?`, pending.options.map((product) => product.nombre));
      } else {
        addBot(`No encontré “${pending.description}” en el catálogo actual. Escribe el nombre como aparece en Productos.`);
      }
      return;
    }
    if (!data.items.length) {
      setWaiting("products");
      const examples = activeProducts.slice(0, 4).map((product) => product.nombre).join(", ");
      addBot(`¿Qué productos y cantidades deseas agregar? Por ejemplo: “2 ${activeProducts[0]?.nombre || "productos"}”. Disponibles: ${examples}.`);
      return;
    }
    if (!data.tipoEntrega) {
      setWaiting("deliveryType");
      addBot("¿El pedido será delivery o recojo?", ["DELIVERY", "RECOJO"]);
      return;
    }
    if (data.tipoEntrega === "Delivery" && !data.direccionEntrega.trim()) {
      setWaiting("address");
      addBot("¿Cuál es la dirección de entrega? Puede ser temporal para esta venta.");
      return;
    }
    if (!data.metodoPago) {
      setWaiting("payment");
      addBot("¿Cómo pagará: efectivo, Yape o tarjeta?", ["EFECTIVO", "YAPE", "TARJETA"]);
      return;
    }
    if (!data.canalVenta) {
      setWaiting("channel");
      addBot("¿Por qué canal llegó la venta?", ["PRESENCIAL", "WHATSAPP", "TELÉFONO"]);
      return;
    }

    setWaiting("confirm");
    const itemSummary = data.items.map((item) => `${item.cantidad}× ${item.nombre}`).join(", ");
    const address = data.tipoEntrega === "Delivery" ? `\nDirección: ${data.direccionEntrega}` : "";
    addBot(`Revisa antes de registrar:\nCliente: ${data.cliente?.nombre || "Venta anónima"}\nProductos: ${itemSummary}\nEntrega: ${data.tipoEntrega}${address}\nPago: ${data.metodoPago}\nCanal: ${data.canalVenta}\nTotal: S/ ${total(data).toFixed(2)}`, ["CONFIRMAR VENTA", "CANCELAR"]);
  };

  const resetConversation = () => {
    setDraft(initialDraft());
    setWaiting("free");
    addBot("Listo. Puedes escribir una nueva venta cuando quieras.");
  };

  const processMessage = async (rawText) => {
    const text = rawText.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((previous) => [...previous, { from: "user", text }]);
    const plain = normalizeSaleText(text);

    if (waiting === "confirm") {
      if (/cancelar|no|cambiar/.test(plain)) {
        resetConversation();
        return;
      }
      if (!/confirmar|si|registrar/.test(plain)) {
        addBot("Confirma la venta o cancélala para empezar nuevamente.", ["CONFIRMAR VENTA", "CANCELAR"]);
        return;
      }
      setSending(true);
      try {
        const newOrder = await registrarVentaCompleta({
          usuario,
          cliente: draft.cliente,
          items: draft.items,
          tipoEntrega: draft.tipoEntrega,
          metodoPago: draft.metodoPago,
          canalVenta: draft.canalVenta,
          direccionEntrega: draft.direccionEntrega,
        });
        setPedidos((previous) => [...previous, newOrder]);
        mostrarNotificacion("Venta registrada correctamente");
        setDraft(initialDraft());
        setWaiting("free");
        addBot(`¡Venta #${newOrder.id} registrada por S/ ${newOrder.total.toFixed(2)}! Ya aparece en el historial.`, ["NUEVA VENTA"]);
      } catch (error) {
        addBot(`No pude registrar la venta: ${String(error)}. Puedes intentar confirmar nuevamente.`);
      } finally {
        setSending(false);
      }
      return;
    }

    if (/nueva venta|reiniciar|cancelar/.test(plain)) {
      resetConversation();
      return;
    }

    let next = { ...draft };
    if (waiting === "productChoice" && draft.productoPendiente) {
      const selected = activeProducts.find((product) => normalizeSaleText(product.nombre) === plain);
      if (!selected) {
        addBot("Selecciona uno de los productos sugeridos o escribe su nombre exacto.", draft.productoPendiente.options.map((product) => product.nombre));
        return;
      }
      next.items = mergeSaleItems(next.items, [{ ...selected, cantidad: draft.productoPendiente.quantity }]);
      next.productoPendiente = null;
    } else if (waiting === "dniDecision") {
      if (/anonima/.test(plain)) {
        next = { ...next, cliente: null, anonima: true, dni: "" };
      } else {
        const correctedDni = text.match(/\b\d{8}\b/)?.[0];
        if (!correctedDni) {
          setWaiting("dni");
          addBot("Escribe el DNI correcto de 8 dígitos.");
          return;
        }
        next = extractFields(correctedDni, next, activeProducts, clientes);
      }
    } else if (waiting === "address" && !/(?:direcci[oó]n|entregar en|enviar a)/i.test(text)) {
      next.direccionEntrega = text;
    } else {
      next = extractFields(text, next, activeProducts, clientes);
    }

    setDraft(next);
    if (next.cliente && next.dni !== draft.dni) {
      addBot(`Cliente encontrado: ${next.cliente.nombre}${next.cliente.direccion ? `. Dirección registrada: ${next.cliente.direccion}.` : "."}`);
    }
    askNext(next);
  };

  return (
    <section className="sales-chat-card" aria-label="Asistente para registrar ventas">
      <div className="sales-chat-header">
        <div className="sales-chat-avatar">K</div>
        <div>
          <h2>Venta rápida</h2>
          <span><i /> Asistente disponible</span>
        </div>
        <button type="button" onClick={resetConversation} title="Nueva conversación">↻</button>
      </div>

      <div className="sales-chat-messages" aria-live="polite">
        {messages.map((message, index) => (
          <div className={`sales-chat-row ${message.from}`} key={`${message.from}-${index}`}>
            <div className="sales-chat-bubble">
              {message.text.split("\n").map((line, lineIndex) => <span key={lineIndex}>{line}</span>)}
              {!!message.actions?.length && index === messages.length - 1 && (
                <div className="sales-chat-actions">
                  {message.actions.map((action) => (
                    <button type="button" key={action} onClick={() => processMessage(action)} disabled={sending}>{action}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {sending && <div className="sales-chat-row bot"><div className="sales-chat-bubble sales-chat-typing"><b /><b /><b /></div></div>}
        <div ref={bottomRef} />
      </div>

      <form className="sales-chat-input" onSubmit={(event) => { event.preventDefault(); processMessage(input); }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ej: DNI 12345678, 2 pollos, delivery..." disabled={sending} />
        <button type="submit" disabled={!input.trim() || sending} aria-label="Enviar mensaje">➤</button>
      </form>
      <p className="sales-chat-hint">Comprueba siempre el resumen antes de confirmar.</p>
    </section>
  );
}
