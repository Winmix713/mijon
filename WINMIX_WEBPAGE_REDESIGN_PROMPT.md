# WinMix Product Webpage Redesign – Comprehensive Design Implementation Prompt

## Executive Summary

This document serves as the authoritative design specification for the WinMix product webpage redesign. WinMix TipsterHub is an end-to-end AI-powered football analytics and prediction platform that combines automated data ingestion, advanced ML models, cross-league intelligence, and collaborative market insights. This redesign focuses on delivering a premium, user-centered experience that clearly communicates WinMix's value proposition while showcasing its sophisticated capabilities through engaging, interactive components.

---

## I. Context & Value Proposition

### What is WinMix?

WinMix TipsterHub is an intelligent sports analytics platform that empowers football enthusiasts, professional tipsters, and data analysts to:

1. **Generate AI-Powered Predictions**: Leverage advanced pattern recognition algorithms to predict match outcomes with high confidence intervals
2. **Analyze Cross-League Intelligence**: Discover meta-patterns, correlation heatmaps, and strategic insights across multiple football leagues
3. **Monitor System Health**: Track model performance, data freshness, and prediction accuracy in real-time
4. **Collaborate on Market Intelligence**: Blend crowd wisdom with machine learning through Phase 9's temporal decay weighting and self-improving feedback loops
5. **Manage ML Governance**: Execute champion/challenger model comparisons, promotion workflows, and continuous retraining pipelines

### Core Value Drivers

- **Speed**: From match selection to detailed AI predictions in under 30 seconds
- **Accuracy**: ML models trained on years of historical football data with continuous feedback loops
- **Intelligence**: Cross-league analysis revealing patterns invisible to traditional methods
- **Transparency**: Full audit trails, confidence metrics, and explainable predictions
- **Community**: Collaborative features that improve predictions through collective market participation

### Target Audiences

1. **Professional Tipsters**: Seeking competitive advantage through AI-enhanced analysis
2. **Data Analysts**: Looking to explore football patterns across multiple leagues
3. **Football Enthusiasts**: Want deeper insights and better prediction accuracy
4. **Institutional Players**: Need governance, monitoring, and market intelligence integration

---

## II. Required UI Components & Design Specifications

### 1. ArcSuite-Style Hero Section

**Purpose**: Establish brand presence and immediately communicate core value proposition

**Layout & Structure**:
- Full viewport height (h-screen)
- Responsive: Single-column mobile, dual-column layout on desktop (md: 50-50 split)
- Animated background with dynamic gradients and particle effects

**Left Column (Content - Desktop)**:
- Primary headline: "AI-Powered Football Predictions" (h1, font-size responsive 2.5rem→3.5rem, font-weight 700, line-height 1.2)
- Subheading: Supporting tagline describing core capability (h2, font-size 1.125rem→1.5rem, color muted-foreground, line-height 1.6)
- Body text: 2-3 sentences explaining the unique value proposition (p, font-size 1rem, max-width 42ch, color foreground/90%)
- CTA button: Primary action (see Animated Shiny CTA section)
- Secondary CTA: "Learn More" button (variant: outline, minimal style)

**Right Column (Visual - Desktop)**:
- Animated background element (3D football visualization, gradient mesh, or animated neural network diagram)
- SVG or WebGL-based animation that responds to scroll position (parallax effect)
- Must maintain visual balance without overwhelming text content
- Subtle motion that doesn't distract from message

**Responsive Behavior (Mobile)**:
- Stacked layout: Visual element above text
- Visual height reduced to 45vh on mobile
- Touch-friendly CTA buttons with larger tap targets (min 48px height)
- Adjusted typography: Headlines scale down proportionally

**Color Scheme**:
- Background: Dark gradient (emerald-dark preset: #0f172a)
- Primary text: #f1f5f9 (foreground)
- Accent colors: Emerald primary (#10b981) for highlights and links
- Border accent: Subtle emerald glow around featured elements

**Animation & Motion**:
- Fade-in animation on page load (duration: 600ms, ease: ease-out)
- Subtle float animation on visual elements (duration: 3s, infinite)
- Background gradient shift (animated hue rotation, duration: 20s, infinite)
- Parallax scroll effect on desktop (20px vertical translation at 50% viewport)

**Accessibility**:
- Semantic HTML (h1 for main title, proper heading hierarchy)
- Color contrast ratio minimum 7:1 for text on background
- No motion that exceeds 3 seconds per cycle (respects prefers-reduced-motion)
- ARIA labels for interactive elements

---

### 2. Animated Shiny Call-To-Action (CTA) Button

**Purpose**: Drive user engagement and conversion with a distinctive, premium interactive element

**Properties**:
- Display: Inline-flex button with responsive padding
- Minimum height: 48px (mobile accessibility)
- Width: Auto with horizontal padding (0.875rem–1.5rem depending on screen)
- Border radius: 0.75rem (matches design system radius)

**Visual Styling**:
- Base background: Linear gradient (primary color #10b981 → emerald-500)
- Text color: Primary-foreground white (#f1f5f9)
- Border: 1px solid primary (emerald-500)
- Box shadow: Glow effect using `shadow-glow-emerald: 0 0 60px rgba(34, 197, 94, 0.3)`
- Hover state: 
  - Background lightens (+10% luminosity)
  - Shadow expands (0 0 80px)
  - Border color brightens
  - Slight scale increase (1.02x)

**Shiny Animation Layer**:
- Overlay span with `absolute inset-0` positioning
- Initial state: Translate -100% on X-axis
- Animation triggers on:
  - Page load (after 1s delay, duration 500ms)
  - Hover/focus (immediate, duration 500ms)
  - Tab focus (immediate, duration 500ms)
- Shine effect: `linear-gradient(110deg, transparent, rgba(255,255,255,0.4), transparent)`
- Background size: 200% 100%
- Motion easing: cubic-bezier(0.4, 0, 0.2, 1)

**Responsive Behavior**:
- Mobile: Full width in hero (100% - padding), then width-auto elsewhere
- Tablet (md): Auto width with minimum 120px
- Desktop (lg): Auto width with min 140px
- Font size: Scales from 0.875rem (mobile) to 1rem (desktop)

**Interactive States**:
- **Default**: Baseline shadow + glow
- **Hover**: Enhanced shadow, expanded glow, shine animation triggers, cursor pointer
- **Active/Pressed**: Slight inset shadow, glow reduces
- **Focus**: 2px outline ring with primary color, offset 2px
- **Disabled**: Opacity 0.5, cursor not-allowed, no hover effects

**Icon Integration**:
- Optional right-aligned icon (e.g., ArrowRight)
- Icon size: 1.25rem
- Gap between text and icon: 0.5rem
- Icon responds to hover: Translate +0.25rem on X-axis

**Copy Examples**:
- Primary: "Create Predictions Now"
- Secondary: "Start Analysis Free"
- Action: "Get AI Insights"
- Urgency: "Join 500+ Tipsters Today"

---

### 3. Community Hero Section (Scrolling Photo Marquee)

**Purpose**: Build social proof and showcase platform community through authentic user-generated content

**Layout & Structure**:
- Full width section
- Height: 500–600px (responsive 300–400px on mobile)
- Background: Dark with subtle gradient overlay
- Section title: "Trusted by Professional Tipsters" (font-size 2rem→2.5rem, font-weight 700, text-center, color gradient emerald→violet)

**Marquee Component**:
- Horizontal scrolling carousel with continuous loop
- 6–8 avatar/photo items in viewport at desktop
- 3–4 items in viewport at tablet
- 1.5–2 items in viewport on mobile
- Auto-scroll direction: Left to right
- Scroll speed: Adjustable (12–15 seconds per full rotation)
- Pause on hover: Yes (desktop only)

**Individual Avatar/Photo Tiles**:
- Size: 120px × 120px (desktop), 100px × 100px (tablet), 80px × 80px (mobile)
- Border radius: 50% for circular avatars
- Border: 2px solid emerald-500 with opacity-fade effect
- Box shadow: `0 0 40px rgba(34, 197, 94, 0.2)`
- Hover effect:
  - Scale: 1.08x
  - Shadow expands: `0 0 60px rgba(34, 197, 94, 0.4)`
  - Rotation: 2° subtle tilt
  - Duration: 300ms ease-out

**Data Integration Points**:
- Pull avatar images from `/public/avatars/` directory
- Fallback to generated gradient avatars with initials
- Optional overlay: Small badges (e.g., "Top Predictor", "500+ Wins")
- Accessibility: alt text for each image (e.g., "Community member John D., 89% accuracy")

**Photo Categories** (WinMix Data-Driven):
- Winning prediction screenshots (anonymized)
- Community achievement milestones
- International football league representatives
- Testimonial video thumbnails

**Animation Details**:
- Seamless loop: Duplicate items appended to end (CSS-based infinite scroll)
- Momentum-based scroll on mobile (touch-friendly)
- GPU acceleration: `will-change: transform`, `transform: translateZ(0)`
- No-reduce-motion: Pause on user preference

**Responsive Behavior**:
- Desktop: Full 6–8 items, auto-scroll enabled
- Tablet: 4 items, slower scroll speed
- Mobile: 2 items, tap-to-pause option instead of hover

---

### 4. Feature Showcase Grid with Integrated CTA

**Purpose**: Highlight WinMix's core capabilities in an organized, visually compelling grid

**Grid Structure**:
- Desktop: 3-column grid (gap: 1.5rem)
- Tablet (md): 2-column grid
- Mobile: 1-column grid
- Grid container max-width: 1200px, centered on page

**Feature Card Components**:
- Base: Glass morphism card (glass-card utility)
- Dimensions: Aspect ratio 1 (square) on desktop, auto-height on mobile
- Padding: 2rem (responsive 1.5rem on mobile)
- Border radius: 0.75rem
- Transition: All properties 300ms ease-out

**Card Content Layers**:
1. **Icon/Visual** (top):
   - Lucide icon (48px × 48px) or custom SVG
   - Color: Primary (emerald-500)
   - Animation on load: Fade-in + slight up translation (300ms offset)
   - Optional background: Semi-transparent circle `bg-emerald-500/10`

2. **Title** (h3):
   - Font-size: 1.25rem
   - Font-weight: 600
   - Color: Foreground
   - Margin bottom: 0.75rem

3. **Description** (p):
   - Font-size: 0.875rem
   - Color: Muted-foreground
   - Line-height: 1.6
   - Margin bottom: 1.5rem

4. **Metrics/Stats** (optional):
   - Small pill-shaped badges: `inline-flex items-center gap-0.5rem px-3 py-1.5 bg-emerald-500/10 rounded-full text-xs font-medium`
   - Examples: "Real-time Analysis", "AI-Powered", "500+ Predictions"

5. **Learn More Link** (bottom):
   - Style: Text link with hover underline
   - Color: Primary (emerald-500)
   - Icon: ChevronRight (16px)
   - Hover: Translate +2px on X-axis

**Feature List** (Examples):

| Icon | Title | Description |
|------|-------|-------------|
| ⚡ | AI-Powered Analysis | Advanced pattern recognition trained on years of football data |
| 🎯 | Real-time Predictions | Generate detailed match predictions in seconds |
| 📊 | Cross-League Intelligence | Discover meta-patterns across 50+ international leagues |
| 🏆 | Confidence Metrics | View explainable confidence scores and win probabilities |
| 🔄 | Continuous Learning | Models improve daily through our feedback loop system |
| 📈 | Market Integration | Blend market odds with AI predictions for sharper edges |

**Card Hover States**:
- Background color shift: +5% opacity (to 0.1)
- Border color brightens: rgba(255,255,255,0.2)
- Icon color: Add subtle glow-emerald shadow
- Slight elevation: `box-shadow: 0 20px 40px rgba(0,0,0,0.3)` (from 0 8px 20px)
- Transform: translateY(-4px)

**Integrated CTA Section**:
- Position: Below grid on desktop, sticky-bottom on mobile
- Layout: Full-width card with dual-button arrangement
- Left button: "View All Features"
- Right button: "Start Free Trial" (primary style)
- Background: Gradient emerald-to-violet
- Text color: Foreground (white)
- Padding: 2rem
- Border radius: 1rem
- Responsive: Stack buttons on mobile (full width each)

---

### 5. Animated Integrations Showcase

**Purpose**: Demonstrate WinMix's connectivity and ecosystem partnerships

**Section Layout**:
- Full width
- Background: Subtle gradient overlay on dark background
- Section title: "Integrations & Ecosystem" (centered, font-size 2rem)
- Subtitle: "Seamlessly connect to your favorite tools" (optional, muted-foreground)

**Integration Grid/Showcase Format** (2 options):

#### Option A: Horizontal Carousel
- 8–10 integration logos in a scrollable container
- Auto-scroll every 5 seconds (left-to-right loop)
- Pause on hover
- Each item: 120px × 120px, contain mode
- Grayscale by default, color on hover (with 300ms transition)
- Border: 1px solid rgba(255,255,255,0.1), becomes emerald-500 on hover

#### Option B: Animated Grid (Recommended)
- 3×3 grid on desktop, 2×2 on tablet, 1×2 on mobile
- Each logo housed in a glass-morphism card (100×100px)
- Cards stagger-animate in on page load (150ms offset per item)
- Hover animation:
  - Scale: 1.1x
  - Rotation: 360° (full spin, duration: 600ms)
  - Shadow: glow-emerald expands to 0 0 60px

**Logo Specifications**:
- Format: SVG preferred, PNG acceptable
- Size: 80px × 80px contained within 120px × 120px card
- Color mode: Black/white primary, colored on interaction
- Accessibility: Each logo wrapped in `<figure>` with `<figcaption>` for screen readers

**Supported Integrations** (Examples):
- Supabase (database/auth)
- GitHub (data pipelines)
- Slack (notifications)
- Linear (issue tracking)
- n8n (workflow automation)
- Stripe (payments)
- Analytics providers
- Data brokers

**Interactive Elements**:
- Click behavior: Redirect to integration detail page (or show modal with setup instructions)
- Tooltip on hover: Integration name + "Click to learn more"
- Status indicator: Small dot (green=active, gray=available) positioned top-right of logo
- Loading state: Skeleton shimmer while fetching integration status

**Status Integration**:
- Real-time status fetched from `/integrations` API endpoint
- Polling interval: 30 seconds (or use WebSocket for live updates)
- Visual indicators:
  - Green (✓): Connected and healthy
  - Yellow (⚠): Connected but degraded
  - Gray (○): Available but not yet connected
  - Red (✗): Connection error

---

### 6. Interactive Quote Reveal Testimonials

**Purpose**: Build trust through authentic user testimonials with engaging reveal mechanics

**Section Layout**:
- Full viewport height (or min-h-screen)
- Background: Dark with overlaid animated gradient mesh
- Centered content area

**Testimonial Card Structure**:
- Single large card displayed at a time (carousel/slider)
- Card dimensions: Max-width 600px, centered on screen
- Aspect ratio: Variable (content-driven)
- Padding: 3rem (responsive 2rem on mobile)
- Border radius: 1rem
- Box shadow: `0 20px 60px rgba(0,0,0,0.5)`
- Background: Glass morphism with slight color tint based on speaker role

**Content Layers** (Reveal Animation):

1. **Quote Text** (initial reveal):
   - Font-size: 1.5rem→2rem (responsive)
   - Font-weight: 600
   - Font-style: Italic
   - Line-height: 1.8
   - Color: Emerald gradient text
   - Animation: Fade-in + letter-spacing increase (300ms)
   - Text animation: Character-by-character reveal (optional, 50ms per character)

2. **Quotation Marks** (decorative):
   - Large opening quote: `"` (font-size: 4rem, opacity: 0.1, color: primary)
   - Position: Absolute, top-left, z-index: -1
   - Animation: Fade-in delayed 100ms

3. **Author Name** (reveals after 1s):
   - Font-size: 1.125rem
   - Font-weight: 600
   - Color: Foreground
   - Animation: Fade-in + slide-in-right (300ms)

4. **Author Role/Title** (reveals after 1.3s):
   - Font-size: 0.875rem
   - Color: Muted-foreground
   - Format: "Professional Tipster, London"
   - Animation: Fade-in (300ms)

5. **Star Rating** (optional, reveals after 1.6s):
   - 5 stars (lucide icons: Star filled = primary, empty = muted)
   - Size: 1.25rem
   - Animation: Stagger-fade each star (100ms offset)

6. **Metric Highlight** (optional):
   - Emerald-bordered pill badge
   - Text: "89% Prediction Accuracy" or similar
   - Animation: Pop-in effect (scale 0 → 1, 300ms cubic-bezier)

**Navigation Controls**:
- Dot indicators (3–5 testimonials max)
- Previous/Next arrow buttons (positioned left/right or below)
- Keyboard navigation: Arrow keys + Escape
- Auto-advance: Every 8 seconds (pausable on hover/focus)
- Touch swipe: Detect swipe-left/right to advance

**Testimonial Examples**:

```
"WinMix's AI transformed how I analyze matches. 
I've gone from 65% to 89% accuracy in just 3 months. 
This is game-changing technology."

— Maria Chen, Professional Tipster, Shanghai

★★★★★ "89% Accuracy"
```

**Responsive Behavior**:
- Desktop: Full height card with decorative elements
- Tablet: Reduced height, simplified layout
- Mobile: Vertical stack, smaller typography, navigation below card

**Accessibility**:
- ARIA live region for testimonial updates
- Keyboard controls fully documented
- Pause auto-advance on focus
- Screen reader announces quote + author + rating

---

## III. Design System & Visual Language

### Color Palette

**Primary Color System** (Emerald-based):
```
Emerald Primary: #10b981 (hsl(160 84% 39%))
Emerald Light: #34d399 (hsl(160 89% 54%))
Emerald Dark: #059669 (hsl(160 95% 35%))
Emerald Glow: rgba(34, 197, 94, 0.3)
```

**Secondary Color System** (Violet for accents):
```
Violet Secondary: #a855f7 (hsl(280 85% 56%))
Violet Light: #d8b4fe (hsl(280 89% 72%))
Violet Dark: #9333ea (hsl(280 83% 58%))
Violet Glow: rgba(168, 85, 247, 0.3)
```

**Neutral Palette**:
```
Background: #050505 (hsl(0 0% 1%))
Foreground: #f1f5f9 (hsl(210 40% 98%))
Muted: #3f3f46 (hsl(0 0% 24%))
Muted Foreground: #a1a1aa (hsl(0 0% 63%))
Border: #27272a (hsl(0 0% 15%))
```

**Preset Themes** (as defined in AdminDesign.tsx):

1. **Smaragd Dark (Default)**:
   - Primary: #10b981 (emerald)
   - Secondary: #f97316 (orange)
   - Background: #0f172a
   - Font: Inter

2. **Azure Dark**:
   - Primary: #0ea5e9 (cyan)
   - Secondary: #ec4899 (pink)
   - Background: #0c1117
   - Font: Inter

3. **Violet Dark**:
   - Primary: #a855f7 (violet)
   - Secondary: #06b6d4 (teal)
   - Background: #1a1a2e
   - Font: Inter

### Typography

**Font Family**: Inter (Google Fonts)
- Weights: 100, 200, 300, 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800, 900

**Scale** (Responsive):

| Element | Mobile | Desktop | Weight | Line-height |
|---------|--------|---------|--------|-------------|
| H1 | 2rem | 3.5rem | 700 | 1.2 |
| H2 | 1.5rem | 2.5rem | 700 | 1.3 |
| H3 | 1.25rem | 1.875rem | 600 | 1.4 |
| H4 | 1.125rem | 1.5rem | 600 | 1.5 |
| Body Large | 1rem | 1.125rem | 400 | 1.6 |
| Body Base | 0.875rem | 1rem | 400 | 1.6 |
| Body Small | 0.75rem | 0.875rem | 400 | 1.5 |
| Caption | 0.625rem | 0.75rem | 500 | 1.4 |

**Text Styling Utilities**:
- `.text-gradient-emerald`: Emerald green gradient text
- `.text-gradient-violet`: Violet to pink gradient text
- `.section-title`: 1.5rem→1.875rem gradient emerald→violet

### Spacing System (8px base)

```
xs: 0.25rem (2px)
sm: 0.5rem (4px)
md: 1rem (8px)
lg: 1.5rem (12px)
xl: 2rem (16px)
2xl: 2.5rem (20px)
3xl: 3rem (24px)
4xl: 4rem (32px)
```

### Border Radius

```
sm: calc(var(--radius) - 4px) [0.25rem]
md: calc(var(--radius) - 2px) [0.5rem]
lg: var(--radius) [0.75rem]
full: 9999px (for pills/avatars)
```

### Box Shadows

```
glass: 0 8px 20px rgba(0, 0, 0, 0.4)
glass-lg: 0 20px 40px rgba(0, 0, 0, 0.5)
glow-emerald: 0 0 60px rgba(34, 197, 94, 0.3)
glow-violet: 0 0 60px rgba(168, 85, 247, 0.3)
glow-orange: 0 0 60px rgba(255, 127, 31, 0.2)
```

### Backdrop & Glass Effects

```
backdrop-blur-xl: blur(20px)
backdrop-blur-2xl: blur(40px)
glass-panel: rgba(255,255,255,0.05) bg + 1px white/10 border + blur-20px
glass-card: same as glass-panel
```

### Animation Tokens

**Durations**:
```
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

**Keyframes Available**:
```
fade-in: 500ms (opacity + translateY)
slide-in-bottom: 600ms
slide-in-right: 600ms
float: 3s infinite (translateY)
pulse-subtle: 2s infinite
shimmer: 2s infinite
```

---

## IV. Asset Specifications

### Avatar Images

**Purpose**: Used in community hero marquee and testimonial sections

**Specifications**:
- Format: PNG with transparency (preferred) or JPG
- Dimensions: 120px × 120px minimum (export at 2x for retina: 240px × 240px)
- Color mode: RGB or RGBA
- File size: <30KB each (optimize with TinyPNG or similar)
- Quality: High-resolution headshots or professional photos
- Style: Consistent lighting, neutral background (will be masked to circle)

**Descriptors** (for diverse, representative imagery):

1. **Professional Tipster Avatar Set** (6 diverse individuals):
   - Name: Professional football analyst, diverse ethnicity, 25–45 age range
   - Style: Professional headshot, clean background, natural lighting
   - Examples:
     - "Maria Chen – Female analyst, professional attire, warm lighting"
     - "James O'Brien – Male tipster, casual professional look, modern office"
     - "Priya Patel – Female data scientist, technical background, cool tones"
     - "Ahmed Hassan – Male coach/analyst, stadium background (blurred)"
     - "Sophie Laurent – Female sports journalist, outdoor natural light"
     - "Marcus Johnson – Male statistician, professional studio setup"

2. **Diversity & Inclusion**:
   - Represent different ethnicities, genders, ages
   - Mix of casual and professional dress codes
   - Various geographic origins (names suggest international community)
   - Different lighting conditions (warm, cool, natural, studio)

3. **Avatar Styling**:
   - All avatars will be masked to 50% border-radius (circles)
   - 2px emerald border applied in CSS
   - Subtle drop shadow and glow in hover state
   - No text or branding overlaid in image itself

### Landscape/Hero Images

**Purpose**: Background visuals for hero section and section dividers

**Specifications**:
- Format: WebP (primary), JPEG (fallback) or PNG for animations
- Dimensions: 1920×1080px minimum (export multiple widths: 640, 1024, 1440, 1920)
- Color mode: RGB with color profile sRGB
- File size: <200KB each (use modern compression)
- Quality: Professional photography or high-quality AI-generated imagery

**Image Assets Required**:

1. **Hero Section – Football Analytics Background**:
   - Descriptor: "Modern football stadium with glowing data visualization overlay. Multiple match statistics, heat maps, and winning predictions floating above stadium seats. Dark moody color grading with emerald and violet accent lighting. Subtle particle effects suggesting data flow. Shot composition: Wide stadium angle, 30% sky, 70% field/stands. Lighting: Night match ambiance with LED scoreboard glowing."
   - Mood: Futuristic, professional, data-driven
   - Dominant colors: Dark grays, blacks with emerald and violet accents
   - Composition: Landscape 16:9 aspect ratio

2. **Community Section – Global Football Network**:
   - Descriptor: "Interconnected globe visualization with football pitch patterns. Global stadium icons marking different continents. Network nodes connecting stadiums with glowing lines. World map overlay with heat map showing prediction accuracy by region. Cool color palette (blues, cyans, emeralds). Subtle motion paths visible in visualization. Shot angle: Isometric or 3D perspective looking down at globe."
   - Mood: Global, connected, intelligent
   - Dominant colors: Dark blue/black with cyan and emerald highlights
   - Composition: Square or landscape format, can be slightly abstract

3. **Features Section Divider – Data Flow**:
   - Descriptor: "Abstract visualization of data flowing through geometric shapes. Emerald and violet streams of light moving through the composition. Multiple layers of depth with foreground, middle ground, background elements. Minimal text overlay space (center 40% clear). Subtle noise texture overlay for organic feel. Lighting: Glowing neon style with dark background."
   - Mood: Modern, technological, dynamic
   - Dominant colors: Black background with emerald and violet accents
   - Composition: Full-width divider, 400–600px height

4. **Integrations Showcase – Connected Ecosystem**:
   - Descriptor: "Nested concentric circles of interconnected technology icons (database, API, analytics, automation). Central focus on WinMix branding. Emerald and violet color coding for different integration categories. Network visualization with subtle particle effects. Dark background with subtle gradient. Clean, symmetrical composition."
   - Mood: Technical, connected, ecosystem-focused
   - Dominant colors: Dark with emerald and violet system colors
   - Composition: Square or circular crop friendly

5. **Testimonials Section – Success Metrics**:
   - Descriptor: "Upward trending graph with multiple data lines in emerald and violet. Floating cards showing 89% accuracy, 500+ predictions, 5-star ratings. Stadium crowd celebrating in background (blurred). Golden hour lighting mixed with data visualization glow. Composition: Diagonal angle suggesting growth and momentum. Space for quote text overlay (left 50% of image)."
   - Mood: Successful, celebratory, data-proof
   - Dominant colors: Warm gold/orange with emerald accents on dark background
   - Composition: Landscape with left-side text space

### Fallback & Default Imagery

If custom images unavailable:
- Use SVG illustrations (Tailwind/custom-drawn)
- Leverage Unsplash/Pexels/Pixabay images with appropriate attribution
- Generate placeholder gradients with CSS animations
- Implement skeleton loaders during image fetch

---

## V. Interaction & Motion Guidelines

### Core Principles

1. **Purposeful Motion**: Every animation serves user feedback or emotional engagement
2. **Micro-interactions**: Subtle, refined motion (100–600ms duration range)
3. **Accessibility First**: All animations respect `prefers-reduced-motion`
4. **Performance**: GPU-accelerated transforms only (`transform: translate`, `scale`, `rotate`)
5. **Consistency**: Reuse animation patterns across components

### Animation Patterns

#### A. Entrance Animations

**Fade-In**:
- Duration: 300–500ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Properties: `opacity` + `transform: translateY(10px)`
- Usage: Default for all content sections

**Slide-In-Right**:
- Duration: 400–600ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Properties: `opacity` + `transform: translateX(-30px)`
- Usage: Text content, titles, descriptive elements

**Stagger Animation** (for lists/grids):
- Child offset: 50–100ms per item
- Parent uses `display: grid` or flex for layout
- Each child animated independently
- Usage: Feature cards, testimonial carousel, integration logos

**Pop-In** (for interactive elements):
- Duration: 300ms
- Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55) (bounce easing)
- Properties: `scale: 0 → 1` + `opacity: 0 → 1`
- Usage: CTA buttons on first load, metric pills

#### B. Hover/Interactive Animations

**Button Hover**:
- Duration: 200ms
- Properties: 
  - Background color shift
  - Box-shadow expansion
  - Slight scale increase (1.02–1.05x)
  - Icon translate (+2–4px)
- Easing: ease-out

**Card Lift**:
- Duration: 300ms
- Properties:
  - Transform: translateY(-4px)
  - Box-shadow: enhance (increase blur + offset)
  - Opacity increase (if applicable)
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

**Link Underline**:
- Duration: 200ms
- Direction: Left-to-right or full-expand
- Properties: `width: 0% → 100%`
- Easing: ease-in-out

**Icon Rotation**:
- Duration: 400–600ms
- Properties: `rotate: 0deg → 360deg` (for refresh/loading indicators)
- Easing: linear (for continuous; cubic-bezier for single)

#### C. Scroll-Based Animations

**Parallax Effect**:
- Used on hero section backgrounds
- Offset: 20–50px based on scroll position
- Easing: Linear mapping of scroll % to pixel offset
- Direction: Vertical (translateY)

**Reveal-on-Scroll**:
- Intersection Observer API triggers fade-in when 20% visible
- Duration: 400–600ms
- Used for all major sections below fold

**Marquee Scroll** (continuous):
- Smooth infinite scroll animation
- Speed: 60–80px/s (adjustable)
- Direction: Left-to-right looping
- Pause on: Hover (desktop), tap-and-hold (mobile)

#### D. Loader & Transition Animations

**Shimmer Skeleton**:
- Duration: 2s infinite
- Properties: `background-position: -1000px → 1000px`
- Direction: Left-to-right
- Opacity: 0.5–1.0 wave effect

**Pulse Subtle**:
- Duration: 2s infinite
- Properties: `opacity: 1 → 0.6 → 1`
- Used for: Active indicators, status pills

**Spinner/Loading**:
- Duration: 1s infinite linear
- Properties: `rotate: 0deg → 360deg`
- Used for: Async operations, data fetching

### Accessibility in Motion

**Respecting Motion Preferences**:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Guidelines**:
- No autoplaying animations longer than 3 seconds (WCAG compliance)
- Provide pause/control for infinite animations
- Ensure no flashing content > 3 Hz (seizure risk mitigation)
- Keyboard navigation fully supported without animation dependency

### Responsive Animation Behavior

| Device | Parallax | Auto-scroll | Hover States | Duration |
|--------|----------|-------------|--------------|----------|
| Mobile | Disabled (no parallax) | Slower (2x) | Touch feedback only | +50ms slower |
| Tablet | Subtle (10px offset) | Standard | Partial (scale only) | Standard |
| Desktop | Full (20–50px) | Standard | Full effects | Standard |

---

## VI. Component Integration & Implementation Patterns

### Frontend Stack & Technologies

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 4 (with PostCSS plugin for alpha support)
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Icons**: lucide-react
- **State**: React hooks (useState, useEffect, useCallback)
- **Data Fetching**: TanStack Query (for server state)
- **Routing**: React Router v6

### Component Architecture

**Layered Approach**:

1. **Base Components** (`src/components/ui/`):
   - Button, Card, Input, Select, Tabs, etc.
   - Leverage shadcn/ui defaults with custom theming

2. **Domain Components** (`src/components/`):
   - HeroSection.tsx
   - CommunityHero.tsx
   - FeatureShowcase.tsx
   - IntegrationsShowcase.tsx
   - TestimonialCarousel.tsx

3. **Page/Route Components** (`src/pages/`):
   - Index.tsx (landing page)
   - WinmixProPage.tsx (admin prototype)

### Props & TypeScript Interfaces

**HeroSection.tsx**:
```typescript
interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  backgroundImage?: string;
  animationDelay?: number;
}
```

**CommunityHero.tsx**:
```typescript
interface CommunityHeroProps {
  avatars: Array<{
    id: string;
    src: string;
    alt: string;
    badge?: string;
  }>;
  autoScrollSpeed?: number;
  pauseOnHover?: boolean;
}
```

**FeatureCard.tsx**:
```typescript
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  metrics?: string[];
  href?: string;
}
```

**TestimonialCarousel.tsx**:
```typescript
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  rating?: number;
  metric?: string;
  delay?: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoAdvance?: boolean;
  advanceInterval?: number;
}
```

### CSS Class Naming & Structure

Follow BEM-adjacent pattern with Tailwind utilities:

```tsx
// Component scoping with data attributes
<div data-component="hero-section" className="...">
  <div data-section="content" className="...">
    <h1 data-element="title" className="...">
  </div>
  <div data-section="visual" className="...">
</div>

// Responsive classes
className="
  px-4 md:px-8 lg:px-12  // Padding
  text-2xl md:text-4xl  // Typography
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  // Layout
"
```

### State Management Patterns

**Local State** (preferred for UI):
```typescript
const [isHovered, setIsHovered] = useState(false);
const [activeTab, setActiveTab] = useState(0);
const [testimonialIndex, setTestimonialIndex] = useState(0);
```

**Derived State**:
```typescript
const isAutoScrollEnabled = !isPaused && !isHovered;
const displayTestimonial = testimonials[testimonialIndex];
```

**Side Effects & Animations**:
```typescript
useEffect(() => {
  if (!isAutoScrollEnabled) return;
  
  const timer = setInterval(() => {
    setTestimonialIndex(prev => (prev + 1) % testimonials.length);
  }, advanceInterval);
  
  return () => clearInterval(timer);
}, [isAutoScrollEnabled, advanceInterval, testimonials.length]);
```

### Performance Optimization

1. **Code Splitting**: Each major section in separate component for lazy loading
2. **Image Optimization**: 
   - Use `<picture>` element with multiple format sources
   - Implement native lazy loading: `loading="lazy"`
   - Serve WebP with JPEG fallback
3. **Animation Performance**:
   - Use `will-change: transform` for animated elements
   - Leverage `transform: translateZ(0)` for GPU acceleration
   - Avoid animating `top`/`left`/`width`/`height` (use transform instead)
4. **Asset Caching**:
   - Images cached via service worker
   - Cache-busting via query params or hash versioning

### Responsive Design Breakpoints

```typescript
// Tailwind defaults
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Strategy**:
- **Mobile-first**: Design for 320px minimum
- **Tablet**: Optimize layout at 768px (hero 2-column, grid 2-col, marquee reduced)
- **Desktop**: Full-featured experience at 1024px+

---

## VII. Accessibility & Inclusive Design

### WCAG 2.1 Compliance (Level AA)

**Color Contrast**:
- Text-to-background: Minimum 4.5:1 (normal text), 3:1 (large text)
- UI components: Minimum 3:1
- Testing: Use WebAIM contrast checker

**Semantic HTML**:
- Proper heading hierarchy (h1 → h2 → h3)
- Landmark elements: `<header>`, `<main>`, `<section>`, `<footer>`
- Native form controls (no custom unlabeled inputs)
- ARIA labels for icon-only buttons: `aria-label="Previous testimonial"`

**Keyboard Navigation**:
- All interactive elements reachable via Tab
- Visible focus indicators (min 2px outline)
- Logical tab order (left-to-right, top-to-bottom)
- Escape key closes modals/overlays
- Arrow keys control carousels

**Screen Reader Support**:
- Alt text for all images: `alt="Maria Chen, professional tipster"`
- ARIA live regions for dynamic content updates: `aria-live="polite" aria-atomic="true"`
- Announce carousel position: `aria-label="Testimonial 2 of 5"`
- Form labels associated: `<label htmlFor="email">`

**Motion & Animation**:
- Respect `prefers-reduced-motion` media query
- Provide pause controls for auto-advancing content
- No flashing/strobing effects (> 3 Hz threshold)
- Auto-play videos with muted attribute only

### Internationalization (i18n)

**Structure**:
- Store all text in locale JSON files: `public/locales/en.json`, `public/locales/es.json`, etc.
- Use i18n library (e.g., i18next) for dynamic translation
- Support: English, Spanish, Hungarian (as evidenced by AdminDesign.tsx)

**Key Phrases to Translate**:
```json
{
  "hero.title": "AI-Powered Football Predictions",
  "hero.cta": "Create Predictions Now",
  "community.title": "Trusted by Professional Tipsters",
  "features.title": "Core Capabilities",
  "testimonials.title": "Success Stories"
}
```

---

## VIII. Acceptance Criteria & Validation Checklist

### Component Deliverables

- [ ] **HeroSection.tsx**: Full-featured with animated background, gradient text, dual CTA buttons
- [ ] **AnimatedCTA.tsx**: Shiny button with glow, hover shine animation, responsive sizing
- [ ] **CommunityHero.tsx**: Scrolling marquee with avatars, configurable speed, pause on hover
- [ ] **FeatureShowcase.tsx**: 3-column grid (responsive), cards with icons, integrated CTA
- [ ] **IntegrationsShowcase.tsx**: 3×3 grid or carousel with animated logos, status indicators
- [ ] **TestimonialCarousel.tsx**: Full reveal animation, auto-advance, keyboard controls, quote animations

### Visual & UX Standards

- [ ] All components use design tokens (colors, spacing, typography from tailwind.config.ts)
- [ ] Responsive behavior tested on: 320px, 768px, 1024px, 1440px widths
- [ ] Glass morphism applied consistently (backdrop blur + semi-transparent bg + border)
- [ ] Animations smooth at 60fps (use Chrome DevTools Performance tab)
- [ ] No layout shift (CLS < 0.1) verified with Web Vitals
- [ ] Images optimized and lazy-loaded
- [ ] All interactive elements have clear focus states (visible 2px outline)

### Accessibility Verification

- [ ] Lighthouse Accessibility score: 95+
- [ ] WAVE tool audit: 0 errors, <3 warnings
- [ ] Keyboard navigation: All features fully accessible via Tab + Arrow + Enter
- [ ] Screen reader tested: VoiceOver (Mac), NVDA (Windows), or both
- [ ] Color contrast ratio: 7:1 minimum for text (verified with contrast checker)
- [ ] Motion preferences respected: `prefers-reduced-motion` disables animations
- [ ] No layout-thrashing (DevTools Performance shows smooth 60fps for scroll/interaction)

### Performance Benchmarks

- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] First Input Delay (FID): < 100ms (or Interaction to Next Paint < 200ms)
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] JavaScript bundle size: < 50KB gzipped (for homepage code-split bundle)
- [ ] CSS bundle size: < 20KB gzipped
- [ ] Image total size: < 200KB (across hero, avatars, integrations)

### Browser Compatibility

- [ ] Chrome/Edge 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] CSS Grid & Flexbox support verified
- [ ] CSS custom properties (CSS variables) fully supported
- [ ] WebP image format with JPEG fallback tested

### Code Quality

- [ ] TypeScript strict mode enabled: All types defined, no `any` used
- [ ] ESLint passes without warnings
- [ ] Prettier formatting applied
- [ ] No console errors/warnings in production build
- [ ] React DevTools Profiler shows no unnecessary re-renders
- [ ] Custom hooks follow naming convention: `use[Name]`
- [ ] Component prop interfaces exported for reusability

### Testing (Optional but Recommended)

- [ ] Vitest unit tests for animation timing (e.g., verify 500ms fade-in)
- [ ] Playwright E2E test: Verify marquee scrolls, testimonial carousel advances, buttons clickable
- [ ] Visual regression testing: Screenshots at key breakpoints stored in version control
- [ ] Accessibility automation: Axe-core scan passes in CI

---

## IX. Asset Delivery Format

### File Organization

```
public/
├── images/
│   ├── hero/
│   │   ├── hero-bg.webp
│   │   ├── hero-bg.jpg
│   │   ├── hero-bg-small.webp
│   ├── avatars/
│   │   ├── avatar-1.jpg
│   │   ├── avatar-2.jpg
│   │   ├── ... (6-8 avatars)
│   ├── integrations/
│   │   ├── supabase.svg
│   │   ├── github.svg
│   │   ├── ... (8-10 logos)
│   └── sections/
│       ├── community-bg.webp
│       ├── features-divider.webp
│       ├── testimonials-bg.webp
src/
├── components/
│   ├── HeroSection.tsx
│   ├── AnimatedCTA.tsx
│   ├── CommunityHero.tsx
│   ├── FeatureShowcase.tsx
│   ├── IntegrationsShowcase.tsx
│   ├── TestimonialCarousel.tsx
│   └── ...
├── pages/
│   └── Index.tsx (updated landing page)
```

### Image Export Specifications

**Export Formats & Sizes**:

1. **Hero Background**:
   - WebP: 1920×1080 (primary), 1024×576 (tablet), 640×360 (mobile)
   - JPEG: Same sizes as fallback
   - File sizes: <180KB each

2. **Avatars** (all formats):
   - PNG/JPG: 240×240px (2x for retina)
   - Total per avatar: <40KB

3. **Integration Logos**:
   - SVG preferred (crisp at any size)
   - Fallback PNG: 120×120px (2x)
   - File sizes: <20KB each

4. **Section Dividers/Backgrounds**:
   - WebP: Full-width responsive variants
   - JPEG fallback
   - File sizes: <150KB each

### Metadata & Accessibility

Every image must include:
- Meaningful `alt` text
- `src` and `srcSet` for responsive delivery
- `loading="lazy"` for below-fold images
- Dimensions specified to prevent layout shift

---

## X. Deployment & Go-Live Checklist

### Pre-Launch Verification

- [ ] All components integrated into Index.tsx
- [ ] No hardcoded URLs (use environment variables for API endpoints)
- [ ] Feature flags tested (if components are behind flags)
- [ ] Analytics events implemented (Google Analytics or Mixpanel)
- [ ] Error boundaries in place (Suspense fallbacks, error pages)
- [ ] Security: No sensitive data in client-side code

### QA & Testing Sign-Off

- [ ] Functional testing on real devices (not just browser emulation)
- [ ] Cross-browser testing completed
- [ ] Accessibility audit passed
- [ ] Performance lighthouse score 95+
- [ ] Load testing: Component behavior under slow network (throttle to 3G)

### Deployment Steps

1. Merge feature branch to main/staging
2. Run CI/CD pipeline (lint, test, build)
3. Deploy to staging environment for stakeholder review
4. Gather feedback and iterate
5. Deploy to production with monitoring enabled
6. Monitor Core Web Vitals and error rates in production
7. Rollback plan in place (if needed)

---

## XI. Future Enhancements & Extensibility

### Planned Additions

1. **Video Components**: Explainer videos in feature section (with captions)
2. **Interactive Demos**: "Try Demo" buttons that show live prediction example
3. **Blog/Case Studies**: Testimonials linked to detailed success stories
4. **Newsletter Signup**: Integrated form below testimonials
5. **Dark/Light Mode Toggle**: Theme switcher (already supported in design system)
6. **Language Selector**: i18n dropdown for multi-language support
7. **A/B Testing**: Analytics-driven CTA copy/design variations

### Backend Integration Points

- **Images**: Upload to Supabase Storage bucket `public/winmix-assets/`
- **Testimonials**: Fetch from Supabase `testimonials` table (with caching)
- **Integration Status**: Real-time status from `/integrations` API endpoint
- **Analytics**: Track button clicks, form submissions, video watches

### Component Library Expansion

- Extract components to monorepo `@winmix/ui` package
- Storybook documentation for each component
- Design tokens as JSON (for Figma sync)
- Exported CSS variables for theme customization

---

## XII. References & Inspiration

### Design Systems
- **shadcn/ui**: Modern component library with Tailwind integration
- **Vercel Design**: Minimalist, performance-focused web design
- **Arc.dev / ArcSuite**: Premium hero sections with animated backgrounds
- **Framer**: Motion design patterns and micro-interactions

### Animation Libraries (Optional)
- **Framer Motion**: React animation library (if needed beyond Tailwind)
- **GSAP**: For complex, timeline-based animations
- **React Spring**: Physics-based animations
- **Note**: Start with Tailwind keyframes; only add libraries if needed

### Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

## Summary

This prompt provides a comprehensive, actionable roadmap for the WinMix product webpage redesign. It encompasses:

✅ **Strategic Context**: Clear value proposition and target audience alignment
✅ **Design Specifications**: Detailed component descriptions, properties, and responsive behavior
✅ **Visual System**: Color palette, typography, spacing, and glass morphism design tokens
✅ **Animation Guidelines**: Entrance, interaction, and scroll-based animation patterns
✅ **Asset Descriptors**: Precise image briefs for avatars and landscapes
✅ **Accessibility**: WCAG 2.1 AA compliance with inclusive design practices
✅ **Implementation Details**: TypeScript interfaces, CSS patterns, and component architecture
✅ **Quality Assurance**: Acceptance criteria, performance benchmarks, and testing checklist
✅ **Deployment Strategy**: Go-live checklist and future extensibility

The design prioritizes **user-centered principles**, **performance optimization**, **accessibility**, and **seamless frontend implementation** with **zero backend dependencies**. All specifications are precise enough for immediate implementation while flexible enough to accommodate design evolution and creative interpretation.

---

**Document Version**: 1.0
**Last Updated**: 2024-12-04
**Target Implementation Timeline**: 2–4 weeks
**Deployment Target**: WinMix.com homepage and `/` route
