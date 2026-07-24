# Tienda — Admin real con Netlify + Decap CMS

Esto te deja un **panel de administración de verdad** en `tusitio.netlify.app/admin`, donde
editás **precios, textos y fotos**, y al guardar se **publica para todos** (y las fotos quedan
hosteadas, así sirven para el preview de los links).

No hace falta servidor propio: Decap CMS guarda los cambios en tu repositorio de GitHub y
Netlify republica solo.

---

## Qué hay en el proyecto

| Archivo | Para qué sirve |
|---|---|
| `Tienda.dc.html` | La tienda. Al abrir, lee `products.json` para mostrar el catálogo. |
| `products.json` | El catálogo (productos + textos de portada). **Esto es lo que edita el admin.** |
| `admin/index.html` | El panel de administración (Decap CMS). |
| `admin/config.yml` | La configuración del panel (qué campos se editan). |
| `images/uploads/` | Donde se guardan las fotos que subís desde el admin. |

---

## Pasos para dejarlo andando (una sola vez)

1. **Subí el proyecto a un repositorio de GitHub** (público o privado).
2. En **Netlify** → *Add new site* → *Import an existing project* → elegí ese repo.
   - *Build command*: dejalo vacío. *Publish directory*: la raíz (`.`).
3. En el sitio de Netlify, andá a **Site configuration → Identity** y tocá **Enable Identity**.
4. En **Identity → Registration**, ponelo en **Invite only** (para que nadie más se registre).
5. En **Identity → Services → Git Gateway**, tocá **Enable Git Gateway**.
6. En **Identity**, tocá **Invite users** e invitá tu propio mail. Te llega un mail para crear la clave.
7. Entrá a **`tusitio.netlify.app/admin`**, iniciá sesión con ese mail y… ¡listo!

> Si tu rama principal no se llama `main`, cambiá `branch: main` en `admin/config.yml`.

---

## Cómo se usa el día a día

- Entrás a `/admin`, editás un precio / texto / foto, tocás **Publish**.
- Netlify republica en ~1 minuto y **todos** ven el cambio.
- Las fotos subidas quedan en `images/uploads/` dentro del repo.

---

## Preview al compartir el link (WhatsApp, redes)

En `Tienda.dc.html` ya están las etiquetas `og:image` apuntando a `./share.jpg`.
Subí una imagen llamada **`share.jpg`** a la raíz del repo (1200×630 px va perfecto) y esa
va a ser la que aparezca cuando compartas el link.

---

## Nota

El botón **⚙ Admin** que está dentro de la tienda es un **borrador local** (sirve para
probar en tu navegador). El admin **real y compartido** es `/admin`. Lo que edites ahí es
lo que ve todo el mundo.
