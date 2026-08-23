/* Domo — datos y utilidades */
(function () {
  const CART_KEY = "domo_cart_v1";
  const ROOT = (function () { const p = location.pathname; return p.slice(0, p.lastIndexOf("/") + 1); })();

  function asset(p) {
    if (!p) return "";
    if (/^(https?:|data:|\/)/.test(p)) return p;
    return ROOT + String(p);
  }

  function money(n) {
    return "$" + Math.round(Number(n) || 0).toLocaleString("es-AR");
  }

  /* Precio efectivo: primero el % de descuento; si no, el precio anterior tachado. */
  function priceOf(p) {
    const base = Number(p.price) || 0;
    const off = Math.max(0, Math.min(90, Number(p.off) || 0));
    if (off > 0) {
      return { final: Math.round((base * (1 - off / 100)) / 100) * 100, list: base, off };
    }
    const old = Number(p.old) || 0;
    if (old > base) return { final: base, list: old, off: Math.round((1 - base / old) * 100) };
    return { final: base, list: 0, off: 0 };
  }

  function slug(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function photos(p) {
    const g = Array.isArray(p.gallery) ? p.gallery.map((x) => (typeof x === "string" ? x : x && x.src)) : [];
    return [p.img, ...g].filter(Boolean).map(asset);
  }

  function normalize(data) {
    const cfg = data.config || {};
    const items = (data.items || []).map((p, i) => ({
      ...p,
      key: String(p.id != null ? p.id : slug(p.name) + "-" + i),
      cat: p.cat || "Otros",
      catId: slug(p.cat || "otros"),
      desc: p.desc || "",
      stock: p.stock !== false,
      fotos: photos(p),
    }));
    const rubros = (data.rubros || []).map((r) => ({
      cat: r.cat, catId: slug(r.cat), blurb: r.blurb || "", img: asset(r.img),
      products: items.filter((p) => p.cat === r.cat),
    })).filter((r) => r.cat);
    /* rubros que existan en productos pero no estén declarados */
    items.forEach((p) => {
      if (!rubros.some((r) => r.catId === p.catId)) {
        rubros.push({ cat: p.cat, catId: p.catId, blurb: "", img: "", products: items.filter((x) => x.catId === p.catId) });
      }
    });
    const slides = (data.slides || []).map((s) => ({ ...s, img: asset(s.img) }));
    return { config: cfg, items, rubros, slides };
  }

  async function loadData() {
    try {
      const res = await fetch(asset("products.json"), { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      return normalize(await res.json());
    } catch (e) {
      return normalize({ config: {}, items: [], rubros: [], slides: [] });
    }
  }

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
  }
  function saveCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
  }

  window.Shop = { asset, money, priceOf, slug, loadData, loadCart, saveCart, ROOT };
})();
