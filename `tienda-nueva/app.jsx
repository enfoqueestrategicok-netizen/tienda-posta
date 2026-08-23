/* Domo — app */

function parseHash() {
  const h = window.location.hash || "";
  let m = h.match(/^#\/r\/(.+)$/);
  if (m) return { view: "rubro", id: decodeURIComponent(m[1]) };
  m = h.match(/^#\/p\/(.+)$/);
  if (m) return { view: "prod", id: decodeURIComponent(m[1]) };
  return { view: "home" };
}

function App() {
  const [data, setData] = React.useState(null);
  const [route, setRoute] = React.useState(parseHash);
  const [cart, setCart] = React.useState(Shop.loadCart);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef(null);

  React.useEffect(() => { Shop.loadData().then(setData); }, []);
  React.useEffect(() => { Shop.saveCart(cart); }, [cart]);
  React.useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const cfg = (data && data.config) || {};
  const rubros = (data && data.rubros) || [];
  const items = (data && data.items) || [];

  function goHome() { window.location.hash = ""; setRoute({ view: "home" }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function openRubro(id) { window.location.hash = "#/r/" + id; setRoute({ view: "rubro", id }); }
  function openProduct(p) { window.location.hash = "#/p/" + p.key; setRoute({ view: "prod", id: p.key }); }
  function scrollToId(id) {
    if (route.view !== "home") { goHome(); setTimeout(() => scrollToId(id), 380); return; }
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  }
  function focusSearch() {
    if (route.view !== "home") { goHome(); setTimeout(focusSearch, 420); return; }
    const el = searchRef.current;
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
    const input = el.querySelector("input");
    if (input) setTimeout(() => input.focus(), 420);
  }

  function waOpen(msg) {
    const num = String(cfg.whatsapp || "").replace(/[^\d]/g, "");
    const base = num ? `https://wa.me/${num}` : "https://wa.me/";
    window.open(`${base}?text=${encodeURIComponent(msg || "")}`, "_blank");
  }
  const onConsultar = () => waOpen(cfg.waConsulta || "Hola Domo, quiero hacer una consulta.");
  function onConsultarProducto(p) {
    waOpen(`Hola Domo, quiero consultar por «${p.name}» (${Shop.money(Shop.priceOf(p).final)}).`);
  }

  const cartMap = React.useMemo(() => {
    const m = {}; cart.forEach((it) => { m[it.id] = it.qty; }); return m;
  }, [cart]);
  const cartCount = cart.reduce((s, it) => s + it.qty, 0);

  function addToCart(p) {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === p.key);
      if (i >= 0) { const n = [...c]; n[i] = { ...n[i], qty: n[i].qty + 1 }; return n; }
      return [...c, { id: p.key, name: p.name, price: Shop.priceOf(p).final, foto: p.fotos[0] || "", qty: 1 }];
    });
  }
  const idOf = (p) => (p.key != null ? p.key : p.id);
  function incCart(p) { const id = idOf(p); setCart((c) => c.map((x) => x.id === id ? { ...x, qty: x.qty + 1 } : x)); }
  function decCart(p) { const id = idOf(p); setCart((c) => c.flatMap((x) => x.id === id ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x])); }
  function removeCart(p) { const id = idOf(p); setCart((c) => c.filter((x) => x.id !== id)); }
  function clearCart() { setCart([]); }

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter((p) => (p.name + " " + p.desc + " " + p.cat).toLowerCase().includes(q));
  }, [query, items]);

  if (!data) {
    return <div className="boot"><Logo /><p>Cargando la tienda…</p></div>;
  }

  const rubro = route.view === "rubro" ? rubros.find((r) => r.catId === route.id) : null;
  const prod = route.view === "prod" ? items.find((p) => p.key === route.id) : null;
  const related = prod ? items.filter((p) => p.cat === prod.cat && p.key !== prod.key).slice(0, 4) : [];

  return (
    <div className="site">
      <TopBar text={cfg.cintillo || "Envíos a todo el país"} />
      <NavBar onHome={goHome} onNav={scrollToId} onSearch={focusSearch} rubros={rubros}
        onRubro={openRubro} cartCount={cartCount} onCart={() => setCartOpen(true)} />

      {prod ? (
        <ProductPage product={prod} qty={cartMap[prod.key] || 0} onBack={() => openRubro(prod.catId)}
          onAdd={addToCart} onInc={incCart} onDec={decCart} onConsultar={onConsultarProducto}
          onCart={() => setCartOpen(true)} cartCount={cartCount} related={related} onOpen={openProduct} />
      ) : rubro ? (
        <RubroPage rubro={rubro} cartMap={cartMap} onHome={goHome} onAdd={addToCart} onInc={incCart}
          onDec={decCart} onOpen={openProduct} onCart={() => setCartOpen(true)} cartCount={cartCount} />
      ) : route.view !== "home" ? (
        <main className="page"><div className="wrap">
          <button className="back" onClick={goHome}>← Volver</button>
          <p className="empty">No encontramos esa página.</p>
        </div></main>
      ) : (
        <React.Fragment>
          <HeroCarousel slides={data.slides} onVer={() => scrollToId("rubros")} onConsultar={onConsultar} />
          <section className="section section--search">
            <div className="wrap">
              <SearchBar value={query} onChange={setQuery} innerRef={searchRef} results={results.length} />
              {query.trim() && (results.length === 0
                ? <p className="empty">No encontramos productos para «{query}».</p>
                : <ProductGrid products={results} cartMap={cartMap} onAdd={addToCart} onInc={incCart} onDec={decCart} onOpen={openProduct} />)}
            </div>
          </section>
          {!query.trim() && (
            <React.Fragment>
              <Rubros rubros={rubros} onOpen={openRubro} />
              <section className="section section--alt">
                <div className="wrap">
                  <div className="shead">
                    <p className="kicker kicker--dark">Recién llegados</p>
                    <h2 className="stitle">Lo más buscado</h2>
                  </div>
                  <ProductGrid products={items.filter((p) => p.nuevo || Shop.priceOf(p).off > 0).slice(0, 4)}
                    cartMap={cartMap} onAdd={addToCart} onInc={incCart} onDec={decCart} onOpen={openProduct} />
                </div>
              </section>
              <Envios envioGratisDesde={cfg.envioGratisDesde} />
            </React.Fragment>
          )}
          <FooterCTA onWhats={onConsultar} />
        </React.Fragment>
      )}

      <div className="foot">
        <Logo onClick={goHome} small light />
        <span>Tu casa, bajo control · Hogar · Mascotas · Seguridad</span>
      </div>

      <WhatsFloat onClick={onConsultar} />

      {cartOpen && (
        <CartDrawer items={cart} config={cfg} onClose={() => setCartOpen(false)}
          onInc={incCart} onDec={decCart} onRemove={removeCart} onClear={clearCart} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
