# Informe Completo UX/UI — Sitio Fjord (E-Commerce Framer Template)
**Para replicar con ClaudeCode — Estilo Escandinavo Minimalista Premium**

---

## 1. IDENTIDAD VISUAL Y CONCEPTO DE DISEÑO

**Estilo general:** Escandinavo minimalista de alta gama. El diseño prioriza el espacio en blanco, la fotografía de producto como elemento central, y una tipografía limpia. La paleta es casi monocromática (blanco + negro profundo), lo que hace que los productos destaquen solos.

**Filosofía de diseño:** "Menos es más". Cada elemento en pantalla tiene un propósito. Nada compite visualmente con el producto.

---

## 2. PALETA DE COLORES

| Rol | Color | Hex / RGB |
|---|---|---|
| Fondo principal | Blanco puro | `#FFFFFF` |
| Texto principal | Negro profundo | `#0E1011` (rgb 14, 16, 17) |
| Texto secundario / muted | Negro con 60% opacidad | `rgba(14, 16, 17, 0.6)` |
| Fondo sección oscura (benefits bar) | Negro profundo | `#0E1011` |
| Fondo sección light (shop header) | Gris muy claro | `#F6F6F6` |
| Fondo hover / variante | Gris claro | `#ECECEC` |
| Badges (50% OFF) | Negro profundo `#0E1011` | texto blanco |

**Regla clave para ClaudeCode:** Solo 2 colores reales en todo el sitio — `#0E1011` y `#FFFFFF`. Los grises son derivados con opacidad. No usar colores de acento ni colores de marca secundarios.

---

## 3. TIPOGRAFÍA

**Font principal:** `DM Sans` (Google Fonts) — usada en todo el UI.  
**Font secundaria:** `Times New Roman` — usada en contados elementos decorativos (se ve en 35 instancias, posiblemente como placeholder de texto editorial).

### Escala tipográfica:
| Elemento | Font | Tamaño | Peso | Line Height |
|---|---|---|---|---|
| H2 Hero / Headings grandes | DM Sans | `32px` | `400` (regular, no bold) | `38.4px` (1.2) |
| Texto de cuerpo principal | DM Sans | `15px` | `400` | `18px` (1.2) |
| Labels / Metadata | DM Sans | `14px` | `400` | `16.8px` |
| Texto de descripción secundario | DM Sans | `16px` | `400` | `25.6px` (1.6 — más espaciado) |
| Nav links | DM Sans | `15px` | `500` | `18px` |

**Regla tipográfica:** Los headings NO usan bold. Usan `font-weight: 400` con tamaño grande. Esto da la elegancia minimalista. Muy importante replicar esto.

---

## 4. ESTRUCTURA DE NAVEGACIÓN

### Announcement Bar (barra superior)
- **Background:** `#0E1011` (negro profundo)
- **Border-radius:** `12px` (cápsula redondeada)
- **Padding:** `10px 24px`
- **Texto:** Blanco, DM Sans 15px, weight 400
- **Contenido:** Ticker/marquee animado con texto repetido: "Save 20% on your first order"
- **Comportamiento:** Separada visualmente del nav, flotante con borde redondeado

### Navbar (pill flotante)
- **Forma especial:** El logo+nav tiene `border-radius: 0px 0px 20px` (esquinas inferiores redondeadas) — crea una forma de "pill que cuelga" desde la esquina superior izquierda
- **Fondo:** `#FFFFFF`
- **Padding:** `4px 16px 12px`
- **Width:** ~415px (compacto, no full-width)
- **El carrito/iconos del lado derecho** tienen su propio contenedor con `border-radius: 0px 0px 0px 18px` (espejo)
- **Dark mode toggle:** Pequeño pill `#ECECEC` con `border-radius: 500px`, padding `6px`, contiene un dot negro de `8px` con `border-radius: 100%`
- **Logo:** Círculo negro sólido + texto "Fjord" en DM Sans

### Items del nav:
- Links: Shop, Collections+, About+, Blog
- Los "+" indican dropdowns
- Right side: ícono de lupa (search) + carrito `(0)`

---

## 5. LAYOUT Y SECCIONES — HOME PAGE

### Sección 1: Hero Slideshow (Full screen)
- **Altura:** 100vh (~855px)
- **Layout:** Imagen full-bleed (ocupa todo el ancho, bordes redondeados en la parte inferior ~12px)
- **Slideshow:** 3 slides con paginación (3 dots + flechas prev/next)
- **Flechas nav:** Circulares, blancas con fondo semitransparente, posicionadas en los bordes laterales
- **Hotspots interactivos:** Círculos blancos con `+` en el centro — clickables sobre el producto para ver detalles
- **Card de texto (hero overlay):**
  - Posición: absoluta, inferior izquierda
  - Background: `#FFFFFF`
  - `border-radius: 10px`
  - `padding: 40px`
  - `width: 400px`, `height: 264px`
  - `gap: 32px` entre elementos internos
  - Contiene: H2 (32px, weight 400) + Descripción (14-15px) + Link "View Product" con underline

### Sección 2: Benefits Bar
- **Background:** `#0E1011`
- **border-radius:** `12px`
- **padding:** `24px 48px`
- **Layout:** Flex row, gap 64px
- **Items:** 4 beneficios con ícono + texto blanco
- Contenido: Free Shipping over 500€ / Worldwide Shipping / Free Returns / 5-Year Warranty

### Sección 3: "Our Favorites" — Product Carousel
- **Heading:** "Our Favorites" — H2 estilo (32px, DM Sans, weight 400)
- **Layout:** Carousel horizontal con scroll, 8 productos
- **Product Cards:** Sin fondo (transparente), gap 20px entre imagen y metadata
- **Imagen de producto:** Sobre fondo gris claro (`#F6F6F6`), `border-radius: 12-16px` en las imágenes, ratio ~3:4
- **Info del producto:** Nombre (arriba de la card, fuera de la imagen) + precio + botón "View"
- **Botón "View":** Texto underline sin background, en negro. El precio tachado aparece cuando hay descuento.
- **Badges "50% OFF":** Pill negro pequeño, posicionado absolute dentro de la imagen, esquina inferior

### Sección 4: Collections
- **3 colecciones:** Wood / Dark / Modern
- **Layout:** Grid o flex, imágenes grandes con texto overlay
- **Cada card:** Imagen editorial full-bleed + heading + descripción breve + "View Collection" link con underline
- **Nombres:** Wood, Dark, Modern

### Sección 5: About Us
- **Split layout:** 50/50 — Texto izquierda + Imagen derecha (o viceversa)
- **Heading:** "About Us" label pequeño + H2 grande: "Designing Spaces, Inspiring Connection"
- **CTA:** "More About Us" — link underline, no botón

### Footer
- **Estructura multi-columna:** Logo + descripción | Pages | Help | CMS | Newsletter
- **Newsletter:** Input de email + botón "Subscribe" (formulario simple)
- **Social:** Twitter, Instagram, Pinterest, Behance
- **Tagline:** "Scandinavian furniture, meticulously handcrafted to bring warmth and elegance into your home."
- **Copyright:** © Made by Gola Templates

---

## 6. PÁGINA DE PRODUCTO (PDP)

**Layout:** Split 60/40 — Galería izquierda + Detalles derecha

### Galería izquierda:
- Imagen principal grande, fondo blanco/gris muy claro
- 3 thumbnails debajo (cuadradas, ~80px, border-radius leve)
- La imagen ocupa ~57% del ancho total

### Panel derecho de detalles:
- Precio normal + precio tachado + badge "50% OFF" (negro, pill)
- H1 del producto: muy grande, DM Sans weight 400
- Descripción breve en texto gris/muted
- **Selector de variante:** "Material" label + pills/chips (Oak / Teak) — fondo blanco, border `1px solid #ececec`, `border-radius: 6-8px`, padding `8px 16px`
- **Cantidad:** Botones `-` y `+` + número central
- **Botón Add to Cart:** Full-width, fondo oscuro `#0E1011`, texto blanco, `border-radius: 8px` ó rectangular
- **Mini benefits ticker:** Repetición de los 4 beneficios en marquee negro
- **Accordions:** Description / Dimensions / Shipping & Returns — con `+` icon, `border-top: 1px solid #ececec`
- **Social sharing:** Pinterest + Instagram links
- **Sección "You might like":** Grid horizontal de 4 productos relacionados

---

## 7. PÁGINA DE SHOP (Listing)

- **Header:** H1 "Shop" grande + descripción en gris, sobre fondo `#F6F6F6`
- **Filtros de categoría:** Tabs horizontales — Dark / Modern / Wood — con línea indicadora activa (underline negro)
- **Grid de productos:** 4 columnas, `gap: 12px`
- **Product Tile:** Imagen grande (4:5 ratio) con `border-radius: 16px` + nombre del producto arriba (fuera del card) + precio + botón "View"
- **Badge descuento:** Pill negro dentro de la imagen, esquina inferior izquierda

---

## 8. PÁGINA ABOUT

- **Hero:** Split layout — Imagen editorial izquierda (personas en estudio) + H1 + texto descriptivo derecha
- **Sección misión:** H3 label "Our Mission" + H2 + body text en 2 columnas
- **Logos bar:** Acme, Kanba, Goldline, Asgard — en gris, horizontal, sin color
- **Team:** 4 personas en grid — foto circular + nombre + cargo

---

## 9. PÁGINA DE BLOG

- **Layout asimétrico:** Post featured grande (60% ancho, imagen + título overlay) + grid 2 col de posts secundarios (40% ancho)
- **Badges:** Pill "New" negro sobre la imagen del post
- **Títulos:** DM Sans, 20-24px, weight 400, sobre fondo blanco semi-transparente en la parte inferior de la imagen
- **CTA:** "Read" link con underline

---

## 10. SISTEMA DE COMPONENTES UI

### Botones y CTAs:
| Tipo | Estilo |
|---|---|
| CTA primario ("Add to Cart") | Background `#0E1011`, texto blanco, `border-radius: 8px`, padding `14px 24px`, full-width |
| CTA secundario ("View Product", "View Collection") | Solo texto con `border-bottom: 1px solid currentColor`, sin fondo, DM Sans 14px |
| "More About Us" | Igual que secundario |

### Pills / Badges:
- Background `#0E1011`, texto blanco, `border-radius: 500px`, `padding: 4px 10px`, font-size 12-13px
- Usados para: "50% OFF", "54% OFF", "New"

### Variant Selectors:
- Pills con border, fondo blanco, texto negro
- Estado activo: fondo negro, texto blanco

### Accordions:
- Línea divisora `1px solid #ececec` (gris muy claro)
- Texto del label a la izquierda, `+` a la derecha
- Sin animación agresiva — simple expand

### Cards de colección:
- Imágenes full-bleed con overlay de texto en la parte inferior
- `border-radius: 16px` en el contenedor de imagen

---

## 11. ANIMACIONES Y MICRO-INTERACCIONES

- **Entrada de secciones:** Fade-in + ligero translate-Y hacia arriba al entrar en viewport (Framer Motion scroll-triggered)
- **Hero slideshow:** Auto-play con transición suave (fade o slide)
- **Announcement bar ticker:** Scroll horizontal continuo (marquee infinito)
- **Benefits bar ticker:** Igual al announcement, scroll horizontal infinito sobre fondo oscuro
- **Hotspot dots:** Pulso/pulse animation en los `+` circulares sobre el hero
- **Hover en productos:** Ligero scale o cambio de cursor — muy sutil
- **Dark mode toggle:** Switch animado

---

## 12. ESPACIADO Y GRID

- **Max-width del contenido:** ~1477px (casi full-width con padding lateral)
- **Gutter / gap entre secciones:** `12px` (muy compacto entre secciones)
- **Padding lateral del body:** `~12px` a cada lado
- **Gap entre productos en carousel:** `20px` vertical (entre imagen y precio), `12px` horizontal entre cards
- **Padding del hero card overlay:** `40px` en todos los lados
- **Section padding:** La mayoría `12px 0px` vertical

---

## 13. INSTRUCCIONES ESPECÍFICAS PARA CLAUDECODE

```
STACK Y TECNOLOGÍA:
- HTML + CSS (Tailwind CSS recomendado para replicar la velocidad)
- JavaScript vanilla o React para el carousel/slideshow
- Google Fonts: importar "DM Sans" (weights: 400, 500)

COLORES (variables CSS):
--color-primary: #0E1011;
--color-bg: #FFFFFF;
--color-muted: rgba(14, 16, 17, 0.6);
--color-gray-light: #F6F6F6;
--color-border: #ECECEC;
--color-text-on-dark: #FFFFFF;

TIPOGRAFÍA:
- Todos los headings: font-family 'DM Sans', sans-serif; font-weight: 400; (¡NO bold!)
- H1/H2 de hero: font-size: 32px; line-height: 1.2;
- Body text: font-size: 15px; line-height: 1.2;
- Descripción larga: font-size: 16px; line-height: 1.6;

NAV PILL (componente especial):
- El contenedor izquierdo del nav tiene: background: white; border-radius: 0 0 20px 0;
  (solo esquina inferior derecha redondeada)
- El contenedor derecho (carrito) tiene: background: white; border-radius: 0 0 0 18px;
  (solo esquina inferior izquierda redondeada)
- Ambos "flotan" desde arriba con position: fixed o sticky

HERO OVERLAY CARD:
- position: absolute; bottom: 40px; left: 40px;
- background: white; border-radius: 10px; padding: 40px;
- width: 400px; max-width: 90%;

BENEFITS BAR:
- background: #0E1011; border-radius: 12px;
- padding: 24px 48px; margin: 12px;
- display: flex; gap: 64px; align-items: center;
- Ticker con animation marquee para los beneficios

PRODUCT CARDS:
- Sin background en el card wrapper
- Imagen con border-radius: 16px; background: #F6F6F6;
- Nombre del producto ENCIMA de la imagen (fuera del card visual)
- Precio + botón "View" debajo de la imagen

BOTONES:
- Primario: background: #0E1011; color: white; border-radius: 8px; 
  padding: 14px 24px; font-family: 'DM Sans'; font-weight: 400;
- Secundario: background: transparent; border-bottom: 1px solid #0E1011;
  padding: 0 0 2px 0; (solo underline inferior)

BADGES/PILLS:
- background: #0E1011; color: white; border-radius: 500px;
  padding: 4px 10px; font-size: 12px;

ANIMACIONES DE ENTRADA:
- Usar Intersection Observer para trigger
- opacity: 0 → 1 con transform: translateY(20px) → translateY(0)
- transition: 0.6s ease

IMÁGENES:
- Usar fotografía editorial de producto sobre fondos neutros (blanco/gris)
- Sin sombras agresivas en las imágenes
- aspect-ratio: 3/4 para product tiles en el shop grid
- aspect-ratio: 16/9 o full-screen para heroes
```

---

## 14. PÁGINAS QUE DEBE TENER EL SITIO

1. **Home** — Hero slider, benefits bar, product carousel, collections grid, about teaser
2. **Shop** — Header con título, filtros por categoría, product grid
3. **Product Detail (PDP)** — Galería + detalles + accordions + related products
4. **Collections (Category)** — Similar al shop pero filtrada
5. **About** — Story + misión + logos + team
6. **Blog** — Layout asimétrico con featured post
7. **Blog Post** — Artículo individual
8. **FAQ** — Preguntas con accordions
9. **Contact** — Formulario simple
10. **Terms / Licensing / 404** — Páginas utilitarias

---

Este informe tiene todo lo necesario para que ClaudeCode replique fielmente el estilo y sistema de diseño Fjord. La clave del look es: **tipografía liviana (weight 400 siempre), paleta bicolor, mucho espacio blanco, fotografía como protagonista, y el nav pill flotante como elemento de marca distintivo**.