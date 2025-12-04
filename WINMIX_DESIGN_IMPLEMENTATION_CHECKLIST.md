# WinMix Webpage Redesign – Implementation Checklist & Developer Guide

## Quick Reference

This document complements the comprehensive design prompt. Use this as a developer-focused checklist during implementation.

---

## Phase 1: Setup & Preparation (Week 1)

### [ ] Component Structure
- [ ] Create `/src/components/homepage/` directory
- [ ] Create component files:
  - [ ] `HeroSection.tsx`
  - [ ] `AnimatedCTA.tsx`
  - [ ] `CommunityHero.tsx`
  - [ ] `FeatureShowcase.tsx`
  - [ ] `IntegrationsShowcase.tsx`
  - [ ] `TestimonialCarousel.tsx`
- [ ] Create component-specific hooks in `/src/hooks/`:
  - [ ] `useCarouselAnimation.ts`
  - [ ] `useMarqueeScroll.ts`
  - [ ] `useRevealOnScroll.ts`
- [ ] Create utilities in `/src/lib/`:
  - [ ] `animation-utils.ts` (timing functions, easing presets)
  - [ ] `asset-loader.ts` (image optimization, srcset generation)

### [ ] Assets Organization
- [ ] Create directory structure in `/public/`:
  - [ ] `/images/hero/` (background images)
  - [ ] `/images/avatars/` (community photos)
  - [ ] `/images/integrations/` (logo SVGs)
  - [ ] `/images/sections/` (dividers, secondary backgrounds)
- [ ] Create placeholder SVGs for all components (temporary)
- [ ] Set up image optimization pipeline (Squoosh, TinyPNG, or similar)

### [ ] Design Tokens & CSS
- [ ] Verify Tailwind theme tokens are present in `tailwind.config.ts`
- [ ] Review existing utilities in `src/index.css`:
  - [ ] `.glass-card` utility exists
  - [ ] Animation keyframes defined (fade-in, slide-in-right, etc.)
  - [ ] Custom properties (--transition-base, --transition-slow, etc.)
- [ ] Create new CSS animations if needed (shimmer, pop-in, stagger)
- [ ] Document color variables for easy theming

### [ ] TypeScript Definitions
- [ ] Create `/src/types/homepage.ts`:
  ```typescript
  export interface HeroProps { ... }
  export interface AvatarData { ... }
  export interface TestimonialData { ... }
  export interface FeatureData { ... }
  export interface IntegrationData { ... }
  ```
- [ ] Ensure strict TypeScript mode enabled in `tsconfig.json`
- [ ] No `any` types allowed

---

## Phase 2: Component Development (Weeks 1–2)

### HeroSection Component

- [ ] **Basic Structure**
  - [ ] Semantic HTML with proper heading hierarchy (h1, h2)
  - [ ] Responsive grid: 1 column mobile, 2 columns desktop
  - [ ] Proper max-width constraints

- [ ] **Content Layer**
  - [ ] H1 with gradient text class
  - [ ] H2 subheading with muted-foreground color
  - [ ] Paragraph with max-width 42ch
  - [ ] Primary CTA button integration (use AnimatedCTA component)
  - [ ] Secondary outline CTA button

- [ ] **Visual Layer**
  - [ ] Background image or animated SVG
  - [ ] Parallax scroll effect (at least 20px offset on desktop)
  - [ ] Fade-in animation on mount
  - [ ] Fallback background gradient if image fails

- [ ] **Responsive Behavior**
  - [ ] Mobile: Stacked layout, 100% width buttons
  - [ ] Tablet: 2-column, buttons side-by-side
  - [ ] Desktop: Full effects enabled
  - [ ] Typography scales properly (use responsive text classes)

- [ ] **Accessibility**
  - [ ] Semantic HTML (`<header>`, `<h1>`)
  - [ ] Color contrast 7:1 minimum
  - [ ] Focus states visible
  - [ ] ARIA labels on buttons with icons only

- [ ] **Testing**
  - [ ] Renders without errors
  - [ ] Props interface typed correctly
  - [ ] Animations respect `prefers-reduced-motion`
  - [ ] No layout shift on load (CLS < 0.1)

### AnimatedCTA Component

- [ ] **Base Button Styling**
  - [ ] Height 48px minimum (accessibility)
  - [ ] Padding responsive (0.875rem–1.5rem)
  - [ ] Border radius 0.75rem
  - [ ] Gradient background (primary color)
  - [ ] Box-shadow with glow effect

- [ ] **Shiny Animation**
  - [ ] Overlay span with absolute positioning
  - [ ] Gradient from transparent → white/40% → transparent
  - [ ] Translate animation X-axis: -100% → 0%
  - [ ] Trigger on load (1s delay) and hover
  - [ ] Duration: 500ms cubic-bezier(0.4, 0, 0.2, 1)

- [ ] **Hover States**
  - [ ] Background color lightens
  - [ ] Box-shadow expands (0 0 80px)
  - [ ] Scale slightly (1.02x)
  - [ ] Shine animation triggers immediately
  - [ ] Duration: 200ms smooth transition

- [ ] **Icon Integration**
  - [ ] Optional right-aligned icon
  - [ ] Icon translates +0.25rem on hover
  - [ ] Gap between text and icon: 0.5rem

- [ ] **Accessibility**
  - [ ] Minimum 48px height/width for touch targets
  - [ ] Focus outline visible (2px)
  - [ ] Active/disabled states clear
  - [ ] Keyboard navigation works (Enter/Space to activate)

- [ ] **Testing**
  - [ ] Shimmer animation timing correct (500ms)
  - [ ] Hover state smooth and responsive
  - [ ] Works on touch devices (no hover state)
  - [ ] Disabled state prevents interaction

### CommunityHero Component

- [ ] **Marquee Setup**
  - [ ] Horizontal scrolling container
  - [ ] CSS-based infinite animation (no JS scroll)
  - [ ] Duplicate items in DOM for seamless loop
  - [ ] Direction: left-to-right

- [ ] **Avatar Items**
  - [ ] 120px × 120px circles (desktop)
  - [ ] Responsive scaling: 100px (tablet), 80px (mobile)
  - [ ] 2px emerald border
  - [ ] `box-shadow: 0 0 40px rgba(34, 197, 94, 0.2)`

- [ ] **Hover Animation**
  - [ ] Scale: 1.08x
  - [ ] Shadow expands: 0 0 60px
  - [ ] Rotate 2° subtle tilt
  - [ ] Duration: 300ms ease-out

- [ ] **Pause on Hover**
  - [ ] Desktop only (not on mobile)
  - [ ] Pause animation via `animation-play-state: paused`
  - [ ] Resume on mouse leave

- [ ] **Data Integration**
  - [ ] Accept avatar array as prop
  - [ ] Pull from `/public/avatars/`
  - [ ] Fallback gradient + initials if image missing
  - [ ] Lazy load images

- [ ] **Responsive Behavior**
  - [ ] Desktop: 6–8 items visible, full speed
  - [ ] Tablet: 4 items visible, 1.5x slower
  - [ ] Mobile: 2 items visible, pause on tap

- [ ] **Accessibility**
  - [ ] Alt text on all avatar images
  - [ ] ARIA label describing purpose
  - [ ] No animation if `prefers-reduced-motion: reduce`

- [ ] **Performance**
  - [ ] GPU-accelerated with `will-change: transform`
  - [ ] Image lazy loading enabled
  - [ ] Optimized image sizes

- [ ] **Testing**
  - [ ] Marquee scrolls continuously (no jumps)
  - [ ] Pause on hover works
  - [ ] Avatars display at correct sizes
  - [ ] No layout shift on image load

### FeatureShowcase Component

- [ ] **Grid Structure**
  - [ ] Desktop: 3 columns, gap 1.5rem
  - [ ] Tablet: 2 columns
  - [ ] Mobile: 1 column
  - [ ] Max-width 1200px, centered

- [ ] **Feature Card Component**
  - [ ] Glass morphism styling (glass-card utility)
  - [ ] Padding: 2rem responsive (1.5rem mobile)
  - [ ] Square aspect ratio (desktop), auto (mobile)
  - [ ] Border radius: 0.75rem

- [ ] **Card Content Layers**
  - [ ] Icon (48px × 48px, primary color)
    - [ ] Semi-transparent background circle
    - [ ] Fade-in animation on load
  - [ ] Title (h3, 1.25rem, font-weight 600)
  - [ ] Description (p, 0.875rem, muted-foreground)
  - [ ] Metric pills (if applicable)
  - [ ] "Learn More" link with ChevronRight icon

- [ ] **Card Hover States**
  - [ ] Background opacity increases
  - [ ] Border becomes emerald-500
  - [ ] Icon gets glow-emerald shadow
  - [ ] Elevation: translateY(-4px)
  - [ ] Shadow expands
  - [ ] Duration: 300ms ease-out

- [ ] **Stagger Animation**
  - [ ] Cards fade-in with stagger (50–100ms offset)
  - [ ] Only on initial load (not on scroll)
  - [ ] Intersection Observer triggers on scroll into view

- [ ] **Integrated CTA Section**
  - [ ] Position: Below grid on desktop, sticky-bottom mobile
  - [ ] Full-width card with gradient background
  - [ ] Dual buttons: "View All Features" + "Start Free Trial"
  - [ ] Buttons stack on mobile

- [ ] **Accessibility**
  - [ ] Semantic card structure
  - [ ] Icon has aria-hidden="true" (decorative)
  - [ ] Links have visible focus states
  - [ ] Color contrast 7:1

- [ ] **Testing**
  - [ ] Cards render in 3-column layout (desktop)
  - [ ] Hover effects smooth (no jank)
  - [ ] Stagger animation timing correct
  - [ ] Responsive grid works at all breakpoints

### IntegrationsShowcase Component

- [ ] **Grid Layout**
  - [ ] Option A: 3×3 grid on desktop
  - [ ] 2×2 on tablet, 1×2 on mobile
  - [ ] Option B: Carousel (if preferred)
  - [ ] Gap: 1.5rem

- [ ] **Logo Items**
  - [ ] 100px × 100px cards
  - [ ] Glass morphism background
  - [ ] SVG or PNG logos (80px × 80px contained)
  - [ ] Grayscale by default

- [ ] **Hover Animation**
  - [ ] Color (remove grayscale filter)
  - [ ] Scale: 1.1x
  - [ ] Rotation: 360° spin (600ms)
  - [ ] Glow shadow expands

- [ ] **Status Indicator**
  - [ ] Small dot (6px) top-right corner
  - [ ] Green (#22c55e) = active
  - [ ] Gray = available
  - [ ] Red = error

- [ ] **Stagger Load**
  - [ ] Cards fade-in with 150ms offset per item
  - [ ] From top-left to bottom-right

- [ ] **Click Behavior**
  - [ ] Redirect to integration detail page (or modal)
  - [ ] Tooltip on hover: "Integration name – Click to learn more"

- [ ] **Data Integration**
  - [ ] Fetch status from `/integrations` API endpoint
  - [ ] Polling every 30 seconds
  - [ ] Cache results

- [ ] **Accessibility**
  - [ ] Each logo in `<figure>` with `<figcaption>`
  - [ ] Links have aria-label
  - [ ] Keyboard navigation works
  - [ ] No animation if `prefers-reduced-motion: reduce`

- [ ] **Testing**
  - [ ] Logos display at correct sizes
  - [ ] Hover animation smooth
  - [ ] Status indicators update (if implemented)
  - [ ] Responsive layout works

### TestimonialCarousel Component

- [ ] **Carousel Structure**
  - [ ] Single testimonial displayed at a time
  - [ ] Dot indicators (3–5 max)
  - [ ] Previous/Next arrow buttons
  - [ ] Auto-advance timer (8 seconds default)
  - [ ] Pause on hover (desktop only)

- [ ] **Testimonial Card**
  - [ ] Glass morphism styling
  - [ ] Max-width 600px, centered
  - [ ] Padding: 3rem responsive (2rem mobile)
  - [ ] Box-shadow: 0 20px 60px rgba(0,0,0,0.5)

- [ ] **Content Reveal Sequence**
  - [ ] Quote text (fade-in, 300ms)
    - [ ] Font-size: 1.5rem→2rem responsive
    - [ ] Font-weight: 600, italic
    - [ ] Emerald gradient text
  - [ ] Quotation marks (fade-in delayed 100ms)
    - [ ] Font-size: 4rem, opacity: 0.1
    - [ ] Absolute positioning, z-index: -1
  - [ ] Author name (fade-in + slide-in-right, delayed 1s)
  - [ ] Author role/location (fade-in, delayed 1.3s)
  - [ ] Star rating (stagger-fade stars, delayed 1.6s)
  - [ ] Metric highlight (pop-in, delayed 1.9s)

- [ ] **Navigation**
  - [ ] Dot indicators clickable
  - [ ] Arrow buttons (previous/next)
  - [ ] Keyboard: Arrow keys + Escape
  - [ ] Touch: Swipe left/right (detect via touch events)
  - [ ] Mobile: Tap indicators or swipe only

- [ ] **Auto-Advance**
  - [ ] Timer: 8 seconds (configurable)
  - [ ] Pause on hover (desktop)
  - [ ] Pause on focus
  - [ ] Resume on blur

- [ ] **Responsive Behavior**
  - [ ] Desktop: Full reveal animations
  - [ ] Tablet: Simplified, smaller typography
  - [ ] Mobile: Vertical stack, touch-friendly controls

- [ ] **Accessibility**
  - [ ] ARIA live region: `aria-live="polite" aria-atomic="true"`
  - [ ] Announce position: `aria-label="Testimonial 2 of 5"`
  - [ ] Keyboard navigation fully supported
  - [ ] No auto-advance if `prefers-reduced-motion: reduce`
  - [ ] Screen reader announces quote + author + rating

- [ ] **Testing**
  - [ ] Reveal animations trigger in correct sequence
  - [ ] Auto-advance timer works (8 seconds)
  - [ ] Navigation (dots, arrows, keyboard) functional
  - [ ] Pause on hover/focus works
  - [ ] Content updates without page reload

---

## Phase 3: Integration & Page Assembly (Week 2–3)

### [ ] Update Index.tsx (Landing Page)

```tsx
// Remove existing HeroSection and section content
// Import new homepage components:
import HeroSection from '@/components/homepage/HeroSection';
import CommunityHero from '@/components/homepage/CommunityHero';
import FeatureShowcase from '@/components/homepage/FeatureShowcase';
import IntegrationsShowcase from '@/components/homepage/IntegrationsShowcase';
import TestimonialCarousel from '@/components/homepage/TestimonialCarousel';

// Combine all sections in proper order:
// 1. HeroSection (with animated background)
// 2. CommunityHero (marquee avatars)
// 3. FeatureShowcase (grid + integrated CTA)
// 4. IntegrationsShowcase (3×3 grid or carousel)
// 5. TestimonialCarousel (quotes + reveals)
// 6. Final CTA section (sign up / trial)
// 7. Footer
```

- [ ] Remove old HeroSection component reference
- [ ] Import all new components
- [ ] Pass data props (avatars, features, testimonials, integrations)
- [ ] Test page renders without errors
- [ ] Verify responsive behavior across breakpoints

### [ ] Data & Props Wiring

- [ ] Create mock/sample data file: `/src/data/homepage.ts`
  ```typescript
  export const SAMPLE_AVATARS = [...]
  export const SAMPLE_FEATURES = [...]
  export const SAMPLE_TESTIMONIALS = [...]
  export const SAMPLE_INTEGRATIONS = [...]
  ```
- [ ] Pass data to components via props
- [ ] (Later) Replace with dynamic data from Supabase if needed

### [ ] Image Asset Management

- [ ] Organize images in `/public/images/` structure
- [ ] Create image loader utility:
  - [ ] Generate responsive srcset
  - [ ] Provide WebP + JPEG fallback
  - [ ] Add lazy loading attributes
  - [ ] Handle broken image fallbacks

- [ ] Implement for:
  - [ ] Hero background image
  - [ ] Avatar photos
  - [ ] Integration logos
  - [ ] Section divider images

### [ ] Animation & Performance Optimization

- [ ] Audit animations using Chrome DevTools Performance:
  - [ ] Verify 60fps target met
  - [ ] Check for paint/composite issues
  - [ ] Optimize slow animations

- [ ] Implement performance enhancements:
  - [ ] Use `will-change: transform` for animated elements
  - [ ] Apply GPU acceleration (`translateZ(0)`)
  - [ ] Lazy load images (native `loading="lazy"`)
  - [ ] Code-split homepage components if needed

- [ ] Measure Core Web Vitals:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms (or INP < 200ms)
  - [ ] CLS < 0.1

### [ ] Responsive Testing Checklist

- [ ] **Mobile (320px)**
  - [ ] Text readable without zooming
  - [ ] Buttons touch-friendly (48px min)
  - [ ] Images scale proportionally
  - [ ] No horizontal scrollbar

- [ ] **Tablet (768px)**
  - [ ] Layout transitions smoothly from mobile
  - [ ] Grid components show 2 columns
  - [ ] Hero section transitions to 2-column
  - [ ] Marquee shows 4 items

- [ ] **Desktop (1024px+)**
  - [ ] Full 3-column grids
  - [ ] All hover effects work
  - [ ] Parallax scrolling active
  - [ ] All animations enabled

---

## Phase 4: Accessibility & QA (Week 3–4)

### [ ] WCAG 2.1 AA Compliance

- [ ] **Contrast Testing**
  - [ ] Run WebAIM contrast checker on all text
  - [ ] Verify 4.5:1 ratio for body text
  - [ ] Verify 3:1 ratio for UI components

- [ ] **Keyboard Navigation**
  - [ ] Tab through all interactive elements
  - [ ] Verify logical tab order (left-to-right, top-to-bottom)
  - [ ] All buttons accessible via Tab + Enter/Space
  - [ ] Escape key closes modals/carousels

- [ ] **Screen Reader Testing**
  - [ ] Test with NVDA (Windows) or VoiceOver (Mac)
  - [ ] All images have alt text
  - [ ] Form labels properly associated
  - [ ] ARIA live regions announce updates
  - [ ] Heading hierarchy correct (h1 → h2 → h3)

- [ ] **Motion & Animation**
  - [ ] Respect `prefers-reduced-motion: reduce`
  - [ ] No flashing/strobing (> 3 Hz threshold)
  - [ ] Auto-play videos muted
  - [ ] Pause controls available

- [ ] **Lighthouse Audit**
  - [ ] Run Lighthouse in Chrome DevTools
  - [ ] Accessibility score: 95+
  - [ ] Performance score: 90+
  - [ ] Best Practices score: 90+

### [ ] Cross-Browser Testing

- [ ] **Desktop Browsers**
  - [ ] Chrome 90+ (latest)
  - [ ] Firefox 88+ (latest)
  - [ ] Safari 14+ (latest)
  - [ ] Edge 90+ (latest)

- [ ] **Mobile Browsers**
  - [ ] iOS Safari (latest)
  - [ ] Chrome Mobile (latest)
  - [ ] Firefox Mobile (latest)

- [ ] **Compatibility Checks**
  - [ ] CSS Grid & Flexbox support
  - [ ] CSS custom properties (vars)
  - [ ] backdrop-filter (glass effect)
  - [ ] SVG rendering
  - [ ] WebP image support

### [ ] Visual Regression Testing (Optional)

- [ ] Capture screenshots at key breakpoints:
  - [ ] 320px (mobile)
  - [ ] 768px (tablet)
  - [ ] 1024px (small desktop)
  - [ ] 1440px (large desktop)

- [ ] Store in version control (or visual testing tool)
- [ ] Compare against expected designs
- [ ] Document any intentional differences

### [ ] Performance Benchmarking

- [ ] **Load Testing**
  - [ ] Measure on 3G throttling (simulated)
  - [ ] Verify LCP < 3s on slow network
  - [ ] Check FID < 200ms on slow network

- [ ] **Bundle Size Analysis**
  - [ ] JavaScript: < 50KB gzipped (for homepage)
  - [ ] CSS: < 20KB gzipped
  - [ ] Images: < 200KB total

- [ ] **Network Request Optimization**
  - [ ] Verify HTTP/2 or HTTP/3 enabled
  - [ ] Check compression (gzip/brotli)
  - [ ] Monitor asset caching headers

### [ ] Functional Testing Checklist

- [ ] **HeroSection**
  - [ ] Displays with correct typography
  - [ ] CTA buttons clickable
  - [ ] Background image loads
  - [ ] Parallax effect works (desktop)
  - [ ] Fade-in animation smooth

- [ ] **CommunityHero**
  - [ ] Marquee scrolls continuously
  - [ ] Pause on hover (desktop)
  - [ ] Avatars display at correct sizes
  - [ ] No layout shift on image load
  - [ ] Responsive at all breakpoints

- [ ] **FeatureShowcase**
  - [ ] Grid displays correct column count
  - [ ] Cards hover effect smooth
  - [ ] Icons visible and colored correctly
  - [ ] "Learn More" links functional
  - [ ] Integrated CTA below grid

- [ ] **IntegrationsShowcase**
  - [ ] Logos display correctly
  - [ ] Hover animation smooth
  - [ ] Status indicators visible
  - [ ] Grid/carousel layout correct
  - [ ] Click navigation works

- [ ] **TestimonialCarousel**
  - [ ] Testimonial displays with correct content
  - [ ] Reveal animation sequence correct timing
  - [ ] Navigation (dots, arrows) works
  - [ ] Auto-advance timer works (8s)
  - [ ] Pause on hover/focus
  - [ ] Keyboard navigation (arrows, escape)

---

## Phase 5: Final Review & Deployment (Week 4)

### [ ] Code Quality

- [ ] TypeScript: No errors or warnings
  ```bash
  npm run type-check
  ```

- [ ] ESLint: No errors
  ```bash
  npm run lint
  ```

- [ ] Prettier: Code formatted
  ```bash
  npm run format
  ```

- [ ] Vitest: Unit tests pass (if added)
  ```bash
  npm run test
  ```

- [ ] Build succeeds
  ```bash
  npm run build
  ```

### [ ] Code Review Checklist

- [ ] All components use TypeScript (no `any` types)
- [ ] Props interfaces exported and documented
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No hardcoded URLs (use environment variables)
- [ ] Error boundaries in place
- [ ] Lazy loading implemented for images and components
- [ ] Accessibility attributes (aria-labels, alt text) present
- [ ] No console errors/warnings in production build

### [ ] Documentation

- [ ] Component prop interfaces documented
- [ ] Usage examples in Storybook (if available)
- [ ] Animation timing documented (durations, easing)
- [ ] Asset paths documented
- [ ] Environment variables documented (if any)

### [ ] Git & Version Control

- [ ] All commits have meaningful messages
- [ ] Feature branch ready for merge
- [ ] No merge conflicts
- [ ] No sensitive data in code

### [ ] Pre-Launch QA

- [ ] [ ] All acceptance criteria from design prompt met
- [ ] [ ] No visual bugs or design deviations
- [ ] [ ] All components responsive and accessible
- [ ] [ ] Performance benchmarks met
- [ ] [ ] Cross-browser testing complete
- [ ] [ ] Lighthouse scores 90+

### [ ] Deployment

- [ ] [ ] Merge to main/staging branch
- [ ] [ ] CI/CD pipeline passes
- [ ] [ ] Deploy to staging for stakeholder review
- [ ] [ ] Gather feedback and iterate (if needed)
- [ ] [ ] Deploy to production
- [ ] [ ] Monitor error rates and Core Web Vitals post-launch
- [ ] [ ] Rollback plan ready (if issues arise)

---

## Quick Component API Reference

### HeroSection
```typescript
<HeroSection
  title="AI-Powered Football Predictions"
  subtitle="Get competitive advantage"
  description="..."
  primaryCTA={{ text: "Create Now", href: "/predictions/new" }}
  backgroundImage="/images/hero-bg.webp"
/>
```

### CommunityHero
```typescript
<CommunityHero
  avatars={[
    { id: "1", src: "/avatars/avatar-1.jpg", alt: "Maria Chen" },
    // ...
  ]}
  autoScrollSpeed={15000}
  pauseOnHover={true}
/>
```

### FeatureShowcase
```typescript
<FeatureShowcase
  features={[
    {
      icon: <Lightning />,
      title: "Real-time Analysis",
      description: "...",
      metrics: ["AI-Powered", "Real-time"]
    },
    // ...
  ]}
/>
```

### IntegrationsShowcase
```typescript
<IntegrationsShowcase
  integrations={[
    { id: "supabase", name: "Supabase", logo: "/logos/supabase.svg", status: "active" },
    // ...
  ]}
/>
```

### TestimonialCarousel
```typescript
<TestimonialCarousel
  testimonials={[
    {
      quote: "WinMix transformed my predictions...",
      author: "Maria Chen",
      role: "Professional Tipster",
      location: "Shanghai",
      rating: 5,
      metric: "89% Accuracy"
    },
    // ...
  ]}
  autoAdvance={true}
  advanceInterval={8000}
/>
```

---

## Debugging Tips

### Animation Not Smooth (Jank)
- [ ] Check DevTools Performance tab (60fps target)
- [ ] Avoid animating `top`, `left`, `width`, `height` (use `transform` instead)
- [ ] Apply `will-change: transform` to animated elements
- [ ] Use `translateZ(0)` for GPU acceleration
- [ ] Reduce shadow/blur effects during animation

### Layout Shift on Image Load
- [ ] Specify width/height attributes on `<img>` tags
- [ ] Use CSS `aspect-ratio` property
- [ ] Implement placeholder skeleton
- [ ] Check CLS score in Lighthouse

### Marquee Jumps/Glitches
- [ ] Ensure duplicated items in DOM
- [ ] Verify animation infinite + linear
- [ ] Check for scroll interference
- [ ] Use `will-change: transform`

### Carousel Controls Not Working
- [ ] Verify focus management (`autoFocus` on elements)
- [ ] Check event listener cleanup in `useEffect` return
- [ ] Test keyboard handlers (keydown vs keyup)
- [ ] Verify tab index attributes

### Accessibility Score Low
- [ ] Run WebAIM contrast checker (aim for 7:1 ratio)
- [ ] Add alt text to all images
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify focus visible on all interactive elements
- [ ] Check heading hierarchy (h1 first, sequential)

---

## Common Pitfalls to Avoid

❌ **Don't**: Hardcode colors (use CSS variables from tailwind.config.ts)
✅ **Do**: Use Tailwind color utilities (text-emerald-500, bg-violet-600)

❌ **Don't**: Animate layout properties (top, left, width, height)
✅ **Do**: Use CSS transforms (translate, scale, rotate)

❌ **Don't**: Forget alt text on images
✅ **Do**: Provide meaningful alt text for all images

❌ **Don't**: Auto-play animations > 3 seconds without pause control
✅ **Do**: Pause on hover/focus, respect prefers-reduced-motion

❌ **Don't**: Use fixed widths for responsive components
✅ **Do**: Use flexible widths with min/max constraints

❌ **Don't**: Import large animation libraries without need
✅ **Do**: Start with CSS/Tailwind animations, add libraries only if necessary

---

## Resources & Quick Links

- **Design Prompt**: `/docs/WINMIX_WEBPAGE_REDESIGN_PROMPT.md`
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Tailwind Docs**: [tailwindcss.com](https://tailwindcss.com/docs)
- **Accessibility**: [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- **Performance**: [Web Vitals](https://web.dev/vitals/)

---

**Document Version**: 1.0
**Last Updated**: 2024-12-04
**Estimated Implementation Time**: 2–4 weeks
