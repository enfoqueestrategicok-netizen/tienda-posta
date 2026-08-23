/* Domo — componentes públicos */
const { money, priceOf } = Shop;

function feats(desc) {
  if (!desc) return [];
  return String(desc).split(/\n|·/).map((s) => s.trim()).filter(Boolean);
}

function Photo({ src, alt, contain }) {
  if (!src) return <div className="ph ph--empty"><span>Sin foto</span></div>;
  return <img className={"ph" + (contain ? " ph--contain" : "")} src={src} alt={alt || ""} loading="lazy" />;
}

function BagIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2.2l2.1 12.2a1.8 1.8 0 0 0 1.8 1.5h8.7a1.8 1.8 0 0 0 1.8-1.4L21.5 7H6" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" />
    </svg>
  );
}

function Arc({ size, light }) {
  const s = size || 26;
  return (
    <svg className="arc" width={s} height={s} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M4 32a16 16 0 0 1 32 0" stroke={light ? "#fff" : "#16181a"} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M2 36h36" stroke="#ffc53d" strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  );
}

function Logo({ onClick, small, light }) {
  return (
    <a className={"logo" + (small ? " logo--sm" : "") + (light ? " logo--light" : "")} onClick={onClick}>
      <Arc size={small ? 20 : 26} light={light} />
      <span className="logo__main">Domo</span>
    </a>
  );
}

function WhatsFloat({ onClick }) {
  return (
    <button className="wafloat" onClick={onClick} aria-label="Escribinos por WhatsApp">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.42 1.31-1.96 1.36-.5.05-.98.23-3.35-.7-2.86-1.13-4.66-4.07-4.8-4.26-.14-.19-1.13-1.5-1.13-2.86 0-1.36.71-2.03.96-2.31.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.06.62.47.23.55.78 1.9.85 2.04.07.14.11.3.02.49-.09.19-.14.3-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.18 1.53 1.91 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.7-.81.89-1.09.19-.28.37-.23.62-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.33.07.12.07.7-.17 1.38z" />
      </svg>
      <span>WhatsApp</span>
    </button>
  );
}

/* ---------- Cintillo + nav ---------- */
function TopBar({ text }) {
  return <div className="cintillo">{text}</div>;
}

function NavBar({ onHome, onNav, onSearch, cartCount, onCart, rubros, onRubro }) {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <div className="nav__links">
          {rubros.map((r) => <a key={r.catId} onClick={() => onRubro(r.catId)}>{r.cat}</a>)}
        </div>
        <Logo onClick={onHome} light />
        <div className="nav__right">
          <button className="iconbtn" onClick={onSearch} aria-label="Buscar"><SearchIcon /></button>
          <button className="iconbtn" onClick={onCart} aria-label="Ver pedido">
            <BagIcon />
            {cartCount > 0 && <span className="iconbtn__count">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ---------- Portada ---------- */
function HeroCarousel({ slides, onVer, onConsultar }) {
  const [i, setI] = React.useState(0);
  const n = slides.length;
  React.useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(t);
  }, [n]);
  if (!n) return null;
  const s = slides[Math.min(i, n - 1)];
  return (
    <header className="hero" id="top">
      <div className="hero__media">
        <Photo src={s.img} alt="" />
        <div className="hero__scrim" />
      </div>
      <div className="hero__inner">
        <p className="kicker">Domo · Hogar, mascotas y seguridad</p>
        <h1 className="hero__title">{s.title}</h1>
        <p className="hero__sub">{s.sub}</p>
        <div className="hero__actions">
          <button className="btn btn--primary btn--lg" onClick={onVer}>Ver productos</button>
          <button className="btn btn--ghostlight btn--lg" onClick={onConsultar}>Consultar por WhatsApp</button>
        </div>
        {n > 1 && (
          <div className="dots">
            {slides.map((_, k) => (
              <button key={k} className={"dot" + (k === i ? " dot--on" : "")} onClick={() => setI(k)} aria-label={"Portada " + (k + 1)} />
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------- Buscador ---------- */
function SearchBar({ value, onChange, innerRef, results }) {
  return (
    <div className="searchbar" ref={innerRef}>
      <div className="searchbar__field">
        <SearchIcon />
        <input className="searchbar__input" value={value} placeholder="Buscar cámara, collar GPS, alarma…"
          onChange={(e) => onChange(e.target.value)} />
        {value && <button className="searchbar__clear" onClick={() => onChange("")} aria-label="Limpiar">✕</button>}
      </div>
      {value && <span className="searchbar__count">{results} {results === 1 ? "resultado" : "resultados"}</span>}
    </div>
  );
}

/* ---------- Precio y etiquetas ---------- */
function PriceTag({ product, big }) {
  const { final, list, off } = priceOf(product);
  return (
    <div className={"pricebox" + (big ? " pricebox--big" : "")}>
      {list > 0 && <span className="price-old">{money(list)}</span>}
      <span className="price">{money(final)}</span>
      {off > 0 && <span className="tag tag--off">−{off}%</span>}
    </div>
  );
}

function Tags({ product }) {
  const { off } = priceOf(product);
  return (
    <div className="tags">
      {off > 0 && <span className="tag tag--off">Oferta −{off}%</span>}
      {product.nuevo && <span className="tag tag--new">Nuevo</span>}
      {!product.stock && <span className="tag tag--out">Sin stock</span>}
    </div>
  );
}

/* ---------- Rubros ---------- */
function Rubros({ rubros, onOpen }) {
  return (
    <section className="section" id="rubros">
      <div className="wrap">
        <div className="shead">
          <p className="kicker kicker--dark">Nuestros rubros</p>
          <h2 className="stitle">Elegí por rubro</h2>
        </div>
        <div className="rub-grid">
          {rubros.map((r) => (
            <article className="rub" key={r.catId} onClick={() => onOpen(r.catId)}>
              <div className="rub__media"><Photo src={r.img} alt={r.cat} /></div>
              <div className="rub__body">
                <h3 className="rub__name">{r.cat}</h3>
                <p className="rub__desc">{r.blurb}</p>
                <div className="rub__foot">
                  <span>{r.products.length} productos</span>
                  <span className="rub__cta">Ver →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Producto ---------- */
function ProductCard({ product, qty, onAdd, onInc, onDec, onOpen }) {
  const out = !product.stock;
  return (
    <article className={"card" + (out ? " card--out" : "")}>
      <div className="card__media" onClick={() => onOpen(product)}>
        <Photo src={product.fotos[0]} alt={product.name} contain />
        <Tags product={product} />
      </div>
      <div className="card__body">
        <span className="card__cat">{product.cat}</span>
        <h3 className="card__name" onClick={() => onOpen(product)}>{product.name}</h3>
        <PriceTag product={product} />
        <div className="card__foot">
          {out ? (
            <span className="outnote">Sin stock</span>
          ) : qty > 0 ? (
            <div className="qty">
              <button className="qty__btn" onClick={() => onDec(product)}>−</button>
              <span className="qty__n">{qty}</span>
              <button className="qty__btn" onClick={() => onInc(product)}>+</button>
            </div>
          ) : (
            <button className="btn btn--primary btn--sm btn--block" onClick={() => onAdd(product)}>Agregar</button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ products, cartMap, onAdd, onInc, onDec, onOpen }) {
  return (
    <div className="cards">
      {products.map((p) => (
        <ProductCard key={p.key} product={p} qty={cartMap[p.key] || 0}
          onAdd={onAdd} onInc={onInc} onDec={onDec} onOpen={onOpen} />
      ))}
    </div>
  );
}

/* ---------- Página de rubro ---------- */
function RubroPage({ rubro, cartMap, onHome, onAdd, onInc, onDec, onOpen, onCart, cartCount }) {
  const [q, setQ] = React.useState("");
  React.useEffect(() => { window.scrollTo(0, 0); }, [rubro.catId]);
  const list = q.trim()
    ? rubro.products.filter((p) => (p.name + " " + p.desc).toLowerCase().includes(q.trim().toLowerCase()))
    : rubro.products;
  return (
    <main className="page">
      <div className="wrap">
        <button className="back" onClick={onHome}>← Volver al inicio</button>
        <div className="phead">
          <p className="kicker kicker--dark">{rubro.cat}</p>
          <h1 className="ptitle">{rubro.cat}</h1>
          {rubro.blurb && <p className="plead">{rubro.blurb}</p>}
        </div>
        <SearchBar value={q} onChange={setQ} results={list.length} />
        {list.length === 0
          ? <p className="empty">No encontramos productos con ese nombre.</p>
          : <ProductGrid products={list} cartMap={cartMap} onAdd={onAdd} onInc={onInc} onDec={onDec} onOpen={onOpen} />}
      </div>
      {cartCount > 0 && <CartBar count={cartCount} onCart={onCart} />}
    </main>
  );
}

function CartBar({ count, onCart }) {
  return (
    <button className="cartbar" onClick={onCart}>
      <BagIcon /> Ver mi pedido · {count} {count === 1 ? "ítem" : "ítems"}
    </button>
  );
}

/* ---------- Ficha ---------- */
function ProductPage({ product, qty, onBack, onAdd, onInc, onDec, onConsultar, onCart, cartCount, related, onOpen }) {
  const [a, setA] = React.useState(0);
  React.useEffect(() => { window.scrollTo(0, 0); setA(0); }, [product.key]);
  const fotos = product.fotos.length ? product.fotos : [""];
  const out = !product.stock;
  const f = feats(product.desc);
  return (
    <main className="page">
      <div className="wrap">
        <button className="back" onClick={onBack}>← Volver a {product.cat}</button>
        <div className="pdp">
          <div className="pdp__gal">
            <div className="pdp__main">
              <Photo src={fotos[Math.min(a, fotos.length - 1)]} alt={product.name} contain />
              <Tags product={product} />
            </div>
            {fotos.length > 1 && (
              <div className="pdp__thumbs">
                {fotos.map((src, k) => (
                  <button key={k} className={"pdp__thumb" + (k === a ? " pdp__thumb--on" : "")} onClick={() => setA(k)}>
                    <Photo src={src} alt="" contain />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="pdp__info">
            <p className="kicker kicker--dark">{product.cat}</p>
            <h1 className="pdp__title">{product.name}</h1>
            <PriceTag product={product} big />
            <p className={"pdp__stock" + (out ? " pdp__stock--out" : "")}>
              {out ? "Sin stock por ahora — consultanos por reposición" : "Disponible · Entrega en 48/72 h"}
            </p>
            {f.length > 0 && <ul className="pdp__feats">{f.map((x, k) => <li key={k}>{x}</li>)}</ul>}
            <div className="pdp__actions">
              {out ? (
                <button className="btn btn--outline btn--lg" disabled>Sin stock</button>
              ) : qty > 0 ? (
                <div className="qty qty--lg">
                  <button className="qty__btn" onClick={() => onDec(product)}>−</button>
                  <span className="qty__n">{qty}</span>
                  <button className="qty__btn" onClick={() => onInc(product)}>+</button>
                </div>
              ) : (
                <button className="btn btn--primary btn--lg" onClick={() => onAdd(product)}>Agregar al pedido</button>
              )}
              <button className="btn btn--wa btn--lg" onClick={() => onConsultar(product)}>Consultar por WhatsApp</button>
            </div>
            <div className="pdp__trust">
              <span>Envío a todo el país</span><span>Pagás al recibir</span><span>Soporte por WhatsApp</span>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="related">
            <h2 className="stitle stitle--sm">También de {product.cat}</h2>
            <div className="cards">
              {related.map((p) => (
                <ProductCard key={p.key} product={p} qty={0} onOpen={onOpen}
                  onAdd={onAdd} onInc={onInc} onDec={onDec} />
              ))}
            </div>
          </div>
        )}
      </div>
      {cartCount > 0 && <CartBar count={cartCount} onCart={onCart} />}
    </main>
  );
}

/* ---------- Cómo comprar / envíos ---------- */
function Comprar() {
  const steps = [
    ["01", "Elegí el rubro", "Tecnología para el hogar, mascotas o seguridad familiar."],
    ["02", "Armá tu pedido", "Sumá al carrito lo que necesites."],
    ["03", "Enviás el pedido", "Se abre WhatsApp con todo el detalle listo."],
    ["04", "Recibís en 48/72 h", "Envío a todo el país o retiro sin cargo."],
  ];
  return (
    <section className="section section--alt" id="comprar">
      <div className="wrap">
        <div className="shead">
          <p className="kicker kicker--dark">Simple y directo</p>
          <h2 className="stitle">Cómo comprar</h2>
        </div>
        <div className="steps">
          {steps.map(([n, t, d]) => (
            <div className="step" key={n}>
              <span className="step__n">{n}</span>
              <h3 className="step__t">{t}</h3>
              <p className="step__d">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Envios({ envioGratisDesde }) {
  const items = [
    ["Buscá el producto", "Entrá al rubro o usá el buscador y mirá la ficha con todas las fotos."],
    ["Ponelo en el carrito y envialo", "Sumás lo que quieras y tocás enviar: se arma el pedido con el detalle y el total."],
    ["Nos comunicamos por WhatsApp", "Te confirmamos disponibilidad, forma de pago y la entrega."],
  ];
  return (
    <section className="section" id="envios">
      <div className="wrap">
        <div className="shead">
          <p className="kicker kicker--dark">Cómo comprar</p>
          <h2 className="stitle">Comprar es simple</h2>
        </div>
        <div className="vals">
          {items.map(([t, d]) => (
            <div className="val" key={t}>
              <span className="val__bar" />
              <h3 className="val__t">{t}</h3>
              <p className="val__d">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA({ onWhats }) {
  return (
    <footer className="fcta">
      <div className="fcta__inner">
        <p className="kicker kicker--light">Atención personalizada</p>
        <h2 className="fcta__title">¿No sabés qué elegir?</h2>
        <p className="fcta__sub">Contanos qué necesitás y te recomendamos el producto justo.</p>
        <button className="btn btn--wa btn--lg" onClick={onWhats}>Escribinos por WhatsApp</button>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Photo, BagIcon, SearchIcon, Logo, TopBar, NavBar, HeroCarousel, SearchBar, PriceTag, Tags,
  Rubros, ProductCard, ProductGrid, RubroPage, ProductPage, CartBar, Comprar, Envios, FooterCTA, feats, Arc, WhatsFloat,
});
