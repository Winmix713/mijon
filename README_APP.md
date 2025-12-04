# WinMix TipsterHub - Application

AI-Powered Football Predictions Platform built with React 18, Vite, TypeScript, Tailwind CSS, and shadcn-ui.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (for backend integration)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_ENV=development
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## 🎨 Design System

The application follows the WinMix design system with:

- **Colors:**
  - Primary: Emerald (#10b981) - Trust & Growth
  - Secondary: Violet (#a855f7) - Innovation & Premium
  - Accent: Amber (#f97316) - Attention & Highlights
  
- **Typography:**
  - Font: Inter (system-ui fallback)
  - Dark theme with glass morphism cards
  
- **Components:**
  - shadcn-ui components with custom styling
  - Responsive design (mobile-first)
  - Accessibility compliant (WCAG 2.1 AA)

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Header, Footer, Layout
│   └── ui/              # shadcn-ui components (Button, Card, etc.)
├── lib/
│   ├── utils.ts         # Utility functions (cn)
│   └── env.ts           # Environment validation
├── pages/               # Route pages
│   ├── Index.tsx        # Landing page
│   ├── Login.tsx        # Authentication
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Predictions.tsx  # Predictions list
│   ├── Jobs.tsx         # Phase 3: Scheduled jobs
│   ├── Analytics.tsx    # Phase 4: Analytics & feedback
│   ├── Models.tsx       # Phase 6: Model management
│   ├── CrossLeague.tsx  # Phase 7: Cross-league intelligence
│   ├── Monitoring.tsx   # Phase 8: System monitoring
│   └── Phase9.tsx       # Phase 9: Collaborative intelligence
├── providers/
│   ├── QueryProvider.tsx   # TanStack Query setup
│   └── ThemeProvider.tsx   # Theme management
├── App.tsx              # Main app with routing
├── main.tsx            # App entry point
└── index.css           # Global styles with Tailwind

```

## 🎯 Features & Routes

### Core Routes
- `/` - Landing page with hero section
- `/login` - User authentication
- `/signup` - User registration
- `/dashboard` - Main dashboard
- `/predictions` - View predictions
- `/predictions/new` - Create new predictions

### Phase-Based Routes (Feature Flagged)

Enable specific features via environment variables:

```env
VITE_FEATURE_PHASE5=true  # Pattern Detection
VITE_FEATURE_PHASE6=true  # Model Evaluation & Jobs
VITE_FEATURE_PHASE7=true  # Cross-League Intelligence
VITE_FEATURE_PHASE8=true  # System Monitoring
VITE_FEATURE_PHASE9=true  # Collaborative Intelligence
```

When enabled, these routes become available:
- `/jobs` - Scheduled jobs control (Phase 3/6)
- `/analytics` - Analytics & feedback loops (Phase 4/6)
- `/models` - Model management (Phase 6)
- `/crossleague` - Cross-league analysis (Phase 7)
- `/monitoring` - System monitoring (Phase 8)
- `/phase9` - Collaborative market intelligence (Phase 9)

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking
```

### Code Quality

- **ESLint:** Configured for React and TypeScript
- **Prettier:** Automatic code formatting with Tailwind CSS plugin
- **TypeScript:** Strict mode enabled with path aliases (`@/`)

## 🎨 Styling Guide

### Tailwind Utilities

The project includes custom utilities:

```tsx
// Glass morphism cards
<div className="glass-card">...</div>
<div className="glass-card-hover">...</div>

// Gradient text
<h1 className="text-gradient-emerald">AI-Powered</h1>
<h2 className="text-gradient-violet">Innovation</h2>

// Shadow glows
<div className="shadow-glow-emerald">...</div>
<div className="shadow-glow-violet">...</div>
```

### Animation Classes

```tsx
// Fade in
<div className="animate-fade-in">...</div>

// Slide in from bottom
<div className="animate-slide-in-bottom">...</div>

// Scale in
<div className="animate-scale-in">...</div>

// Floating animation
<div className="animate-float">...</div>

// Marquee scroll
<div className="animate-marquee">...</div>
```

## 🔧 Configuration

### Environment Variables

All environment variables are validated on startup using Zod. Missing or invalid variables will prevent the app from loading in development with detailed error messages.

Required variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_ENV` - Environment type (development, staging, production)

### Feature Flags

Control phase-based features:
- `VITE_FEATURE_PHASE5` - Pattern detection algorithms
- `VITE_FEATURE_PHASE6` - Model evaluation & feedback loops
- `VITE_FEATURE_PHASE7` - Multi-league intelligence
- `VITE_FEATURE_PHASE8` - System monitoring & visualization
- `VITE_FEATURE_PHASE9` - Collaborative AI & market intelligence

## 🚢 Production Build

Build the application for production:

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

## 📚 Documentation

For comprehensive documentation on the entire platform architecture, see:
- [Main README](./README.md) - Platform overview
- [Design Style Guide](./DESIGN_STYLE_GUIDE.md) - Visual design standards
- [Design Implementation Checklist](./WINMIX_DESIGN_IMPLEMENTATION_CHECKLIST.md) - Component specs
- [Pages Documentation](./PAGES_DOCUMENTATION.md) - Detailed page specifications

## 🤝 Contributing

1. Follow the design system specifications in `DESIGN_STYLE_GUIDE.md`
2. Use shadcn-ui components when possible
3. Ensure responsive design (mobile-first approach)
4. Run `npm run lint` and `npm run format` before committing
5. Test feature flags work correctly

## 📄 License

Copyright © 2024 WinMix TipsterHub. All rights reserved.
