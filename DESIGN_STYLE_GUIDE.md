# WinMix Design Style Guide
**Visual Design Standards & Implementation Guidelines**

---

## Quick Reference

### Color Palette

```
PRIMARY (Trust & Growth)
├─ Emerald (#10b981) – Main CTAs, Success, Positive
├─ RGB: 16, 185, 129
└─ HSL: 160° 84% 39%

SECONDARY (Innovation & Premium)
├─ Violet (#a855f7) – Secondary Actions, Features
├─ RGB: 168, 85, 247
└─ HSL: 280° 85% 56%

ACCENT (Attention & Highlights)
├─ Amber (#f97316) – Alerts, Important, Highlights
├─ RGB: 249, 115, 22
└─ HSL: 38° 92% 53%

INFO (Informational)
├─ Cyan (#06b6d4) – System Messages, Hints
├─ RGB: 6, 182, 212
└─ HSL: 187° 97% 43%

SEMANTIC
├─ Error (Red): #ef4444
├─ Success (Emerald): #10b981
├─ Warning (Amber): #f97316
└─ Info (Cyan): #06b6d4

NEUTRAL
├─ Background: #050505 (Pure Dark)
├─ Card: #0f1729 (Dark Blue-Gray)
├─ Foreground: #f1f5f9 (Near-White)
├─ Muted: #6b7280 (Warm Gray)
└─ Border: #1f2937 (Dark Gray)
```

### Typography

```
FONT FAMILY
├─ Primary: Inter (system-ui fallback)
├─ Weight Range: 100-900
└─ Letter Spacing: -0.01em

SCALE (Desktop)
├─ H1: 2.5rem (40px) | weight 700 | line-height 1.2
├─ H2: 1.875rem (30px) | weight 600 | line-height 1.3
├─ H3: 1.25rem (20px) | weight 600 | line-height 1.4
├─ Body: 1rem (16px) | weight 400 | line-height 1.6
├─ Small: 0.875rem (14px) | weight 400 | line-height 1.5
└─ Tiny: 0.75rem (12px) | weight 500 | line-height 1.4

SCALE (Mobile - Reduce 15-20%)
├─ H1: 2rem (32px)
├─ H2: 1.5rem (24px)
├─ Body: 0.875rem (14px)
└─ Small: 0.75rem (12px)
```

### Spacing Scale

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### Border Radius

```
sm: 0.375rem (6px)
md: 0.75rem (12px)
lg: 1rem (16px)
xl: 1.5rem (24px)
2xl: 2rem (32px)

Default for premium feel: lg (1rem)
Buttons: lg (1rem)
Cards: xl (1.5rem)
Hero sections: 3xl (2rem)
Avatars: Full circle (50%)
```

### Shadows

```
card: 0 8px 20px rgba(0,0,0,0.4)
card-lg: 0 20px 40px rgba(0,0,0,0.5)
glow-emerald: 0 0 60px rgba(34,197,94,0.3)
glow-violet: 0 0 60px rgba(168,85,247,0.3)
```

---

## Component Specifications

### Buttons

**Primary Button**
```
Background: Emerald (#10b981)
Foreground: White (#f1f5f9)
Padding: 0.5rem 2rem (h-12 = 48px height)
Border Radius: 1rem
Font Weight: 600
Font Size: 1rem

States:
├─ Default: bg-emerald-500
├─ Hover: bg-emerald-600 + scale(1.02) + shadow-lg
├─ Active: bg-emerald-700 + scale(0.98)
├─ Disabled: opacity-50 + cursor-not-allowed
└─ Loading: show spinner, disable interactions
```

**Secondary Button**
```
Background: Violet (#a855f7)
Otherwise: Same as Primary
```

**Outline Button**
```
Background: Transparent
Border: 1px solid border color
Text Color: Foreground
Hover: bg-white/5 + border brightens
```

**Ghost Button**
```
Background: Transparent
Text Color: Foreground or primary
Hover: bg-white/5
```

### Cards

**Glass Card (Default)**
```
Background: rgba(255,255,255,0.05)
Border: 1px solid rgba(255,255,255,0.1)
Backdrop Filter: blur(20px)
Border Radius: 1.5rem
Padding: 1.5rem
Transition: all 200ms ease-out

Hover (if interactive):
├─ Background: rgba(255,255,255,0.1)
├─ Border: rgba(255,255,255,0.2)
└─ Shadow: 0 8px 32px rgba(0,0,0,0.3)
```

**Status Card**
```
Same as Glass Card, plus:
├─ Left border: 4px (status color)
├─ Status dot: 8px circle (top-right)
└─ If critical: animate pulse on border
```

### Form Elements

**Input Field**
```
Background: hsl(215 20% 17%)
Border: 1px solid border color
Border Radius: 0.75rem
Padding: 0.5rem 1rem
Font Size: 1rem
Line Height: 1.5

Focus:
├─ Border: primary color
├─ Box Shadow: 0 0 0 3px rgba(16,185,129,0.1)
└─ Background: slightly lighter

Disabled:
├─ Background: hsl(215 20% 10%)
├─ Text Color: muted-foreground
└─ Cursor: not-allowed
```

**Select Dropdown**
```
Same as Input Field
├─ Arrow icon: right side
├─ Option items: 100% width
└─ Hover state on options: bg-primary/10
```

### Tables

**Table Header**
```
Background: hsl(215 20% 13%)
Text: muted-foreground
Font Weight: 600
Font Size: 0.875rem
Padding: 1rem
Border Bottom: 1px solid border
```

**Table Row**
```
Padding: 1rem
Border Bottom: 1px solid border

Hover:
├─ Background: rgba(255,255,255,0.02)
├─ Transition: 200ms ease-out
└─ Cursor: pointer (if clickable)

Alternate Row (optional):
└─ Background: rgba(255,255,255,0.01)
```

---

## Animation Guidelines

### Timing Scale

```
Instant: 0ms (no animation)
Micro: 100-150ms (button hover, input focus)
UI: 200-300ms (page transitions, card expand)
Page: 400-600ms (section reveal, parallax)
Complex: 800ms+ (hero animations, tutorials)
```

### Easing Functions

```
Entrance (ease-out):
cubic-bezier(0.0, 0.0, 0.58, 1.0)

Standard (ease-in-out):
cubic-bezier(0.42, 0.0, 0.58, 1.0)

Exit (ease-in):
cubic-bezier(0.42, 0.0, 1.0, 1.0)

Spring (bounce):
cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Common Animations

**Fade In (Default)**
```
Duration: 600ms
Easing: ease-out
Transform: opacity 0→1
```

**Slide In (Bottom)**
```
Duration: 600ms
Easing: ease-out
Transform: translateY 20px→0 + fade
```

**Scale In (Emphasis)**
```
Duration: 500ms
Easing: ease-out
Transform: scale(0.95)→1 + fade
```

**Pulse (Status/Loading)**
```
Duration: 2000ms
Easing: ease-in-out
Transform: opacity 1→0.5→1
```

**Shimmer (CTA emphasis)**
```
Duration: 3000ms
Easing: linear
Background: slides left to right
Shadow: grows and shrinks
```

---

## Visual Patterns

### Hero Section Pattern

```
Layout:
├─ Background: Gradient orbs + grid pattern
├─ Content:
│  ├─ Headline: H1 gradient text
│  ├─ Subheading: H3 muted
│  ├─ CTAs: 2-button row (Primary + Outline)
│  ├─ Feature grid: 3 columns (icon + title + desc)
│  ├─ Hero image: 16:9 aspect, stadium/dramatic
│  └─ Floating stats: Bottom overlay card
└─ Animations: Staggered entrance (200ms delays)

Mobile Adjustments:
├─ Stack buttons vertically
├─ Feature grid: 1 column
├─ Hero image: Adjust height
└─ Floating stats: Full width with padding
```

### Card Grid Pattern

```
Desktop: 3-column grid
Tablet: 2-column grid
Mobile: 1-column grid
Gap: 1.5rem
```

### Data Table Pattern

```
Sticky header: Yes
Alternating rows: Optional
Hover highlight: Yes (subtle)
Sortable headers: Yes (↑/↓ indicators)
Pagination: Bottom, centered
Row height: 3rem (48px minimum)
```

### Status Indicator Pattern

```
Healthy: 🟢 Emerald
├─ Pulse animation (optional)
├─ Text: "Online" or "Healthy"
└─ Brightness: 100%

Warning: 🟡 Amber
├─ Steady (no pulse)
├─ Text: "Degraded" or "Warning"
└─ Brightness: 90%

Critical: 🔴 Red
├─ Pulse animation (1s)
├─ Text: "Critical" or "Error"
└─ Brightness: 100%
```

---

## Responsive Design

### Breakpoints

```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px

Tailwind Prefixes:
├─ sm: 640px
├─ md: 768px
├─ lg: 1024px
├─ xl: 1280px
└─ 2xl: 1536px
```

### Mobile-First Approach

Start with mobile styles, then enhance:
```
/* Mobile (default) */
.card { p-4, text-sm }

/* Tablet */
@media (min-width: 768px) {
  .card { p-6, text-base }
}

/* Desktop */
@media (min-width: 1024px) {
  .card { p-8, text-lg }
}
```

### Images Sizing

```
Hero: 1280×720px (16:9)
Team Logos: 256×256px (1:1)
Avatars: 64×64px minimum (1:1)
Feature Icons: 48×48px (1:1)
Backgrounds: 2560×1600px (4K)

Formats:
├─ Primary: WebP
├─ Fallback: JPEG
├─ Animated: GIF/MP4
└─ Icons: SVG
```

---

## Accessibility Standards

### Color Contrast

Minimum WCAG AAA:
```
Body text on background: 7:1
Headers on background: 4.5:1
UI components: 4.5:1
Interactive elements: 3:1
```

### Focus States

```
Keyboard navigation: Visible ring
Ring color: Primary emerald
Ring width: 2px
Ring offset: 2px
Example: focus:ring-2 focus:ring-primary focus:ring-offset-2
```

### Semantic HTML

```
Use <button> for actions
Use <a> for navigation
Use <input> for forms
Use <header>, <nav>, <main>, <footer>
Never use divs for semantic content
Use aria-label for icon-only buttons
```

### Motion Preferences

```
Respect prefers-reduced-motion:
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Best Practices

### Color Usage

✅ **Do:**
- Use emerald for primary actions (most important)
- Use violet for secondary/feature highlights
- Use amber for attention/alerts
- Use semantic colors (red=error, green=success)
- Maintain contrast ratios ≥ 4.5:1

❌ **Don't:**
- Overuse multiple colors (max 3 per section)
- Use colors as only status indicator (pair with text/icon)
- Rely on color alone for information (color-blind users)
- Use default system colors

### Typography Usage

✅ **Do:**
- Use H1 once per page
- Maintain hierarchy (H1 > H2 > H3 > body)
- Limit font sizes to 4-5 distinct sizes
- Use weight for emphasis (don't just change color)
- Line-height ≥ 1.5 for body text

❌ **Don't:**
- Use small text for important content
- Skip heading levels (H1 → H3 breaks semantics)
- Justify text on web (hard to read)
- Use all caps for body text
- Underline non-link text

### Spacing Usage

✅ **Do:**
- Use spacing scale consistently
- Add breathing room around interactive elements
- Stack margins (use margin-bottom, not margin-top)
- Align items to grid (8px base unit)

❌ **Don't:**
- Mix arbitrary pixel values with scale
- Use margin for text alignment (use text-align)
- Create spacing through padding alone
- Inconsistent gaps in grids

---

## Component Dos & Don'ts

### Buttons

✅ **Do:**
- Distinguish primary vs secondary visually
- Show loading state during async actions
- Provide feedback on click (scale/color change)
- Use clear, action-oriented text ("Save" not "OK")

❌ **Don't:**
- Disable buttons without explanation
- Use color alone to indicate state
- Make buttons too large (>64px height)
- Place destructive actions as primary buttons

### Cards

✅ **Do:**
- Provide clear hierarchy within cards
- Use consistent padding across cards
- Add hover state for interactive cards
- Include clear call-to-action

❌ **Don't:**
- Nest cards too deeply (max 2 levels)
- Use dark backgrounds on dark cards
- Overload cards with information
- Use generic card layouts

### Forms

✅ **Do:**
- Label every input clearly
- Show validation feedback inline
- Auto-focus first input (if appropriate)
- Group related fields

❌ **Don't:**
- Use placeholder text as label
- Disable inputs without reason
- Place error messages far from input
- Submit forms on field change

---

## Design Decision Framework

When making design choices, prioritize in this order:

1. **Accessibility** - WCAG standards, keyboard nav, screen readers
2. **Usability** - Clear hierarchy, intuitive flows, feedback
3. **Performance** - Fast load times, smooth interactions (60 FPS)
4. **Brand** - Consistent colors, fonts, patterns
5. **Beauty** - Delightful animations, polish, visual appeal

---

## Tools & Resources

### Design Tools
- Figma (design files)
- Storybook (component documentation)
- Lighthouse (performance)
- Axe DevTools (accessibility)

### Color Tools
- Contrast Ratio Checker
- Color Blindness Simulator
- Material Design Color Tool

### Animation Tools
- Framer Motion (React animations)
- CSS Animations (pure CSS)
- Lottie (JSON animations)

---

## Examples

### Example: Creating a New Feature Card

```tsx
<div className="glass-card rounded-xl p-6 hover:scale-105 transition-transform duration-200">
  {/* Icon */}
  <div className="p-3 rounded-lg bg-emerald-500/10 w-fit mb-4">
    <Icon className="w-6 h-6 text-emerald-500" />
  </div>

  {/* Title */}
  <h3 className="text-lg font-semibold text-foreground mb-2">
    Feature Title
  </h3>

  {/* Description */}
  <p className="text-sm text-muted-foreground mb-4">
    Brief description of the feature
  </p>

  {/* CTA */}
  <button className="text-sm font-semibold text-primary hover:text-primary/80 transition">
    Learn More →
  </button>
</div>
```

### Example: Status Badge

```tsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10">
  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
  <span className="text-xs font-semibold text-emerald-400">Online</span>
</div>
```

### Example: Confidence Indicator

```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="font-semibold">Confidence</span>
    <span className="text-emerald-400">87%</span>
  </div>
  <div className="h-2 rounded-full bg-muted overflow-hidden">
    <div
      className="h-full bg-emerald-500 rounded-full transition-all"
      style={{ width: '87%' }}
    />
  </div>
</div>
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial style guide creation |

---

**Document Status:** Active Design System
**Last Updated:** December 2024
**Maintained By:** Design System Team

