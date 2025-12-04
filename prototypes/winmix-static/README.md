# WinMix Static Prototype - Interaktivitási Réteg

Az interaktív WinMix prototípus egy teljes körű, JavaScript alapú implementáció, amely a design specifikáció összes interaktív komponensét valósítja meg. Statikus HTML-ből indul, de szuperítatív JavaScript modulokkal bővül az animációkhoz és az interaktivitáshoz.

## 📋 Tartalom

- `index.html` - Statikus HTML struktúra (JS nélkül is működik)
- `styles.css` - Komprehenzív stilusok és animációk
- `prototype.js` - Interaktivitási réteg (fő modul)
- `mock-data.js` - Mock adatok (avatárok, feature-k, testimonial-ok, integrációk)

## 🚀 Gyors start

```bash
# Nyisd meg a prototípust egy webszerver segítségével
cd /docs/prototypes/winmix-static
python3 -m http.server 8000
# vagy
npx http-server
```

Majd nyisd meg a `http://localhost:8000` oldalt a böngészőben.

## 🎯 Implementált Komponensek

### 1. Animated Shiny CTA Button

**Jellemzők:**
- Hover/click eseményekre újraindul a shimmer animáció
- 1000ms késleltetéssel az oldal betöltésekor automatikus shimmer
- Teljes körű keyboard navigáció (Tab, Enter, Space)
- ARIA attribútumok az akadálymentesítéshez

**Testreszabás:**
```html
<button class="btn-cta" aria-label="Saját akció">
  Saját CTA Text
  <span class="btn-cta-shine"></span>
</button>
```

### 2. Community Marquee (Végtelenített Avatar Görgetés)

**Jellemzők:**
- Automatikus végtelenített görgetés a duplikált sorokkal
- Sebesség: `data-speed` attribútummal beállítható (alapértelmezett: 30s)
- Pause on hover (desktop) / tap-to-pause (mobile)
- GPU acceleráció (`will-change`, `transform: translateZ(0)`)
- Responsive: Desktop 8 item, tablet 4 item, mobile 2 item

**Testreszabás:**
```html
<div class="marquee-container" data-speed="20" data-pause-on-hover="true">
  <div class="marquee">
    <!-- Automatikusan generálódik a mock-data.js-ből -->
  </div>
</div>
```

**Data attribútumok:**
- `data-speed`: Forgás időtartama másodpercben (alapértelmezett: 30)
- `data-pause-on-hover`: Felfüggesztés hover-on (alapértelmezett: true)

### 3. Feature Grid - IntersectionObserver Scroll Trigger

**Jellemzők:**
- Stagger-fade animáció a scroll trigger-re
- Mindegyik kártya egyénileg késleltetett késleltetéssel (`data-stagger-delay`)
- IntersectionObserver: 10% threshold, 50px root margin
- CSS class `.revealed` az aktív animáció jelzésére

**Testreszabás:**
```html
<div class="features-grid" data-threshold="0.1" data-stagger-delay="100">
  <!-- Automatikusan generálódik -->
</div>
```

**Data attribútumok:**
- `data-threshold`: IntersectionObserver threshold (alapértelmezett: 0.1)
- `data-stagger-delay`: Ms késleltetés az egyes kártyák között (alapértelmezett: 100)

### 4. Integration Grid - Status Jelzők és Hover Animációk

**Jellemzők:**
- Mock státusz indikátorok (active/connecting)
- Glow-pulse animáció a status jelzőkön
- Teljes keyboard navigáció (Tab, Enter, Space)
- Hover effect: skálázás + glow shadow
- Dinamikus ARIA attribútumok

**Testreszabás:**

Az integrációs kártyák az `MOCK_INTEGRATIONS` tömbből generálódnak:

```javascript
// mock-data.js-ben
export const MOCK_INTEGRATIONS = [
  { id: 1, name: 'Platform Neve', logo: '📊', status: 'active', color: '#10b981' },
  // ... további elemek
];
```

### 5. Quote/Testimonial Carousel

**Jellemzők:**
- Auto-advance: 8000ms (alapértelmezett)
- Manual navigation: nyilak + pontok
- Pause on hover / focus
- Keyboard vezérlés: `←` (előző), `→` (következő)
- Teljes ARIA szerepek és élő régiók

**Testreszabás:**
```html
<div class="carousel" 
     data-auto-advance="true" 
     data-interval="8000" 
     data-enable-keyboard="true">
  <!-- Automatikusan generálódik -->
</div>
```

**Data attribútumok:**
- `data-auto-advance`: Auto-advance engedélyezése (alapértelmezett: true)
- `data-interval`: Auto-advance intervallum ms-ben (alapértelmezett: 8000)
- `data-enable-keyboard`: Billentyűzet navigáció (alapértelmezett: true)
- `data-enable-arrows`: Nyíl gombok megjelenítése (alapértelmezett: true)
- `data-enable-dots`: Pont gombok megjelenítése (alapértelmezett: true)

## ♿ Akadálymentesítés (a11y)

### WCAG 2.1 AA Conformity

- ✅ **Keyboard Navigation**: Minden interaktív elem elérhető Tab-bal
- ✅ **Focus Indicators**: Jól látható fokusz körök az összes gombón
- ✅ **ARIA Labels**: `aria-label`, `aria-live`, `aria-selected`, `aria-roledescription`
- ✅ **Screen Reader Support**: Semantic HTML, alt textek, role attribútumok
- ✅ **Color Contrast**: 7:1 minimum kontrasztratio az összes szöveghez
- ✅ **prefers-reduced-motion**: Teljes támogatás - animációk leállnak

### Prefers-Reduced-Motion Támogatás

Az oldal automatikusan detektálja a felhasználó `prefers-reduced-motion` preferenciáját:

```javascript
// prototype.js-ben
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
```

Amikor aktív:
- Marquee: Leáll a görgetés
- Feature cards: Nincsenek stagger animációk
- Carousel: Nincsenek auto-advance
- CTA button: Shimmer effect kikapcsolt

### Minimum Touch Target Méret

- Összes gomb: min 48px × 48px
- Marquee avatárok: 80px-120px
- Carousel nyilak: 44px × 44px
- Carousel pontok: 10px-24px

## 🎨 Testreszabás

### Szín Séma

Az összes szín a CSS változókban van definiálva az `index.html` fájlban:

```css
:root {
  --color-primary: #10b981;           /* Emerald */
  --color-secondary: #a855f7;         /* Violet */
  --color-background: #050505;        /* Dark */
  --color-foreground: #f1f5f9;        /* Light */
  --color-muted: #94a3b8;             /* Gray */
}
```

Módosítsd ezeket az `styles.css` fájlban.

### Animáció Sebessége

```css
:root {
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
}
```

### Marquee Sebesség Módosítása

```html
<!-- Helyileg gyorsabb (20 másodperc) -->
<div class="marquee-container" data-speed="20">
  <!-- ... -->
</div>
```

### Feature Card Stagger Delay

```html
<!-- Nagyobb késleltetés az egyes kártyák között -->
<div class="features-grid" data-stagger-delay="150">
  <!-- ... -->
</div>
```

### Carousel Auto-Advance Intervallum

```html
<!-- 5 másodperces intervallum -->
<div class="carousel" data-interval="5000">
  <!-- ... -->
</div>
```

## 📊 Mock Adatok Módosítása

### Avatar-ok

Az `mock-data.js` fájlban szerkeszd az `MOCK_AVATARS` tömböt:

```javascript
export const MOCK_AVATARS = [
  {
    id: '1',
    name: 'Maria Chen',
    role: 'Professional Tipster',
    src: 'https://example.com/avatar.jpg',  // SVG vagy URL
    badge: 'Top Predictor'
  },
  // ... továbbiItemek
];
```

### Feature-k

```javascript
export const MOCK_FEATURES = [
  {
    icon: '⚡',
    title: 'AI-Powered Analysis',
    description: 'Leírás...',
    metrics: ['Real-time', 'ML-Driven']
  },
  // ... további elemek
];
```

### Testimonial-ok

```javascript
export const MOCK_TESTIMONIALS = [
  {
    id: '1',
    quote: 'Az idézet szövege...',
    author: 'Szerző Neve',
    role: 'Szerep',
    location: 'Hely',
    rating: 5,
    metric: 'Metrika'
  },
  // ... további elemek
];
```

### Integrációk

```javascript
export const MOCK_INTEGRATIONS = [
  {
    id: 1,
    name: 'Platform Neve',
    logo: '📊',
    status: 'active' | 'connecting',
    color: '#10b981'
  },
  // ... további elemek
];
```

## 🔧 Fejlesztői Info

### Modul Struktúra

**prototype.js** az alábbi manager osztályokat exportálja:

```javascript
export {
  CTAButtonManager,        // CTA button shimmer
  MarqueeManager,          // Avatar marquee
  FeatureGridManager,      // Feature cards scroll reveal
  IntegrationGridManager,  // Integration status + hover
  TestimonialCarousel,     // Quote carousel
  FeatureCTAManager        // Feature section CTA
};
```

Mindegyik osztály automatikusan inicializálódik a DOMContentLoaded eseményre.

### Keyboard Vezérlés

| Gomb | Funkció |
|------|---------|
| Tab | Navigáció az interaktív elemek között |
| Enter / Space | Gombok aktiválása |
| ← (Bal nyíl) | Előző testimonial |
| → (Jobb nyíl) | Következő testimonial |

### Touch Interakciók

- **Marquee**: Tap-to-pause 3 másodperces szünettel
- **Carousel**: Swipe támogatás (opcionális, jelenleg nem implementálva)

### CSS Class Megnevezések

- `.shimmer` - CTA button shimmer animáció aktív
- `.paused` - Marquee szünetelt
- `.revealed` - Feature card scroll-trigger után
- `.active` - Carousel slide vagy dot aktív

## 🧪 Tesztelés

### Önálló HTML Fájl

Nincs build folyamat szükséges! Az `index.html`-t közvetlenül megnyithatod egy webszerver segítségével:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

### Tesztelési Checklist

- [ ] Marquee végtelenített és szünetel hover-on
- [ ] Feature kártyák scroll-on megjelennek
- [ ] CTA button shimmerez hover/click-on
- [ ] Integration status jelzők pulzálnak
- [ ] Carousel auto-advance és manual nav működik
- [ ] Keyboard navigáció működik (Tab, Enter, nyilak)
- [ ] Fokusz indikátorok láthatók
- [ ] prefers-reduced-motion: animációk leállnak
- [ ] Mobile-on (320px) minden működik
- [ ] Tablet-en (768px) minden működik
- [ ] Desktop-on (1024px+) minden működik

### Chrome DevTools Testing

1. **Accessibility Audit**: F12 → Lighthouse → Accessibility
2. **Motion Testing**: F12 → Rendering → Emulate CSS media feature prefers-reduced-motion
3. **Mobile Testing**: F12 → Device Toolbar (Ctrl+Shift+M)
4. **Network Throttling**: F12 → Network → Slow 3G

## 🐛 Conhecidos Korlátok

1. **Marquee nem szinkronizálódik a csoportos képernyőn** - CSS alapú megoldás (a JS-ből érkező duplikálással működik)
2. **Carousel swipe nem implementálva** - Nyilak és pontok navigációval működik
3. **Egyedi avatár képek** - Jelenleg SVG gradient alapú avatárok (SVG-ből vagy képekből módosítható)
4. **Progress bar** - Nincs visual progress a carousel-nál (csak pontok)

## 📈 Performance

### Target Metrics

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **JS Bundle**: < 20KB gzipped (prototype.js + mock-data.js)
- **CSS Bundle**: < 15KB gzipped

### Optimizációk

- CSS3 animációk helyett GPU-accelerált `transform`-ot használunk
- `will-change` a marquee-n a smooth scrollinghez
- `lazy` loading az avatár képekhez
- IntersectionObserver a feature cards scroll-trigger-hez

## 📝 Aktualizálási Napló

### v1.0 (2024-12)

- ✅ Shimmer CTA button implementáció
- ✅ Végtelenített marquee avatar görgetés
- ✅ Scroll-based feature card reveal
- ✅ Integration status grid
- ✅ Testimonial auto-advance carousel
- ✅ Teljes WCAG 2.1 AA akadálymentesítés
- ✅ prefers-reduced-motion támogatás
- ✅ Keyboard navigáció
- ✅ Mock data management
- ✅ Responsive design (mobile-first)

## 📄 License

Minden kód a WinMix projekt része és a projekthez tartozó licenc alatt kerül felhasználásra.

## 🙋 Támogatás

Kérdéseid vagy bugjelentéseid? Nyiss egy GitHub issue-t vagy vedd fel a kapcsolatot a fejlesztési csapattal.

---

**Készült a design specifikáció alapján:**
- WINMIX_WEBPAGE_REDESIGN_PROMPT.md
- WINMIX_DESIGN_CODE_EXAMPLES.md
- WINMIX_DESIGN_IMPLEMENTATION_CHECKLIST.md
