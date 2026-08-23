/* Domo — carrito + pedido por WhatsApp */

function CartDrawer({ items, config, onClose, onInc, onDec, onRemove, onClear }) {
  const [name, setName] = React.useState("");
  const [entrega, setEntrega] = React.useState("envio");

  React.useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const umbral = Number(config.envioGratisDesde) || 0;
  const gratis = umbral > 0 && subtotal >= umbral;
  const envio = entrega === "retiro" || gratis ? 0 : (Number(config.envioCosto) || 0);
  const total = subtotal + envio;
  const count = items.reduce((s, it) => s + it.qty, 0);

  function checkout() {
    const lines = ["¡Hola Domo! Quiero hacer este pedido:", ""];
    items.forEach((it) => lines.push(`• ${it.qty}x ${it.name} — ${Shop.money(it.price * it.qty)}`));
    lines.push("", `Subtotal: ${Shop.money(subtotal)}`);
    lines.push(`Entrega: ${entrega === "retiro" ? "Retiro en persona (sin cargo)" : envio === 0 ? "Envío a domicilio (gratis)" : "Envío a domicilio (" + Shop.money(envio) + ")"}`);
    lines.push(`Total: ${Shop.money(total)}`);
    if (name.trim()) lines.push(`Soy: ${name.trim()}`);
    lines.push("", "¿Me confirman disponibilidad y forma de pago?");
    const num = String(config.whatsapp || "").replace(/[^\d]/g, "");
    const base = num ? `https://wa.me/${num}` : "https://wa.me/";
    window.open(`${base}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
  }

  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="drawer__top">
          <h2 className="drawer__title">Tu pedido {count > 0 && <span className="drawer__count">{count}</span>}</h2>
          <button className="xbtn" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="drawer__body">
          {items.length === 0 ? (
            <div className="drawer__empty">
              <BagIcon />
              <p>Tu pedido está vacío.<br />Entrá a un rubro y sumá productos.</p>
            </div>
          ) : (
            <div className="drawer__items">
              {items.map((it) => (
                <div className="ci" key={it.id}>
                  <div className="ci__media"><Photo src={it.foto} alt={it.name} contain /></div>
                  <div className="ci__info">
                    <span className="ci__name">{it.name}</span>
                    <span className="ci__price">{Shop.money(it.price)}</span>
                  </div>
                  <div className="ci__right">
                    <div className="qty qty--sm">
                      <button className="qty__btn" onClick={() => onDec(it)}>−</button>
                      <span className="qty__n">{it.qty}</span>
                      <button className="qty__btn" onClick={() => onInc(it)}>+</button>
                    </div>
                    <button className="ci__del" onClick={() => onRemove(it)}>Quitar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer__foot">
            <div className="fld">
              <label className="fld__label">Entrega</label>
              <div className="segrow">
                <button className={"seg" + (entrega === "envio" ? " seg--on" : "")} onClick={() => setEntrega("envio")}>Envío a domicilio</button>
                <button className={"seg" + (entrega === "retiro" ? " seg--on" : "")} onClick={() => setEntrega("retiro")}>Retiro sin cargo</button>
              </div>
              {entrega === "envio" && umbral > 0 && (
                <p className="note">{gratis ? "✓ Tu pedido tiene envío gratis." : `Te faltan ${Shop.money(umbral - subtotal)} para envío gratis.`}</p>
              )}
            </div>
            <div className="fld">
              <label className="fld__label">Tu nombre (opcional)</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cómo te llamás" />
            </div>
            <div className="lines">
              <div className="line"><span>Subtotal</span><span>{Shop.money(subtotal)}</span></div>
              <div className="line"><span>Envío</span><span>{entrega === "retiro" ? "Retiro" : envio === 0 ? "Gratis" : Shop.money(envio)}</span></div>
            </div>
            <div className="totalrow"><span>Total</span><strong>{Shop.money(total)}</strong></div>
            <button className="btn btn--wa btn--lg btn--block" onClick={checkout}>Enviar pedido por WhatsApp</button>
            <button className="linkbtn" onClick={onClear}>Vaciar pedido</button>
          </div>
        )}
      </aside>
    </div>
  );
}

Object.assign(window, { CartDrawer });
