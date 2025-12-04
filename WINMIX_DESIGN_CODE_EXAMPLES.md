# WinMix Webpage Redesign – Code Examples & Technical Reference

This document provides copy-paste ready code snippets and technical patterns for implementing the WinMix webpage redesign components.

---

## Animation & Utility Patterns

### CSS Animation Keyframes (for index.css)

Add these keyframes to your `src/index.css` if not already present:

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin-smooth {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes stagger-fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Animation Utilities Hook

Create `/src/hooks/useRevealOnScroll.ts`:

```typescript
import { useEffect, useRef, useState } from 'react';

export interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  delay?: number;
}

export const useRevealOnScroll = (options: RevealOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    duration = 600,
    delay = 0,
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  return {
    ref,
    isVisible,
    style: {
      animation: isVisible
        ? `fade-in ${duration}ms ease-out forwards`
        : 'none',
    },
  };
};
```

### Stagger Animation Hook

Create `/src/hooks/useStaggerAnimation.ts`:

```typescript
import { useEffect, useState } from 'react';

export interface StaggerConfig {
  itemCount: number;
  delay?: number;
  offset?: number;
}

export const useStaggerAnimation = ({
  itemCount,
  delay = 0,
  offset = 50,
}: StaggerConfig) => {
  const [animatedItems, setAnimatedItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const timers = animatedItems.map((_, index) =>
        setTimeout(() => {
          setAnimatedItems((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }, index * offset)
      );

      return () => timers.forEach(clearTimeout);
    }, delay);

    return () => clearTimeout(timer);
  }, [itemCount, delay, offset]);

  const getItemAnimation = (index: number) => ({
    animation: animatedItems[index]
      ? `fade-in 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
      : 'none',
    opacity: animatedItems[index] ? 1 : 0,
  });

  return { getItemAnimation };
};
```

### Marquee Animation Utility

Create `/src/hooks/useMarqueeScroll.ts`:

```typescript
import { useEffect, useRef, useState } from 'react';

export interface MarqueeConfig {
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
}

export const useMarqueeScroll = ({
  speed = 30,
  pauseOnHover = true,
  direction = 'left',
}: MarqueeConfig) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => pauseOnHover && setIsPaused(true);
    const handleMouseLeave = () => pauseOnHover && setIsPaused(false);

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pauseOnHover]);

  const animationDuration = containerRef.current
    ? (containerRef.current.scrollWidth / speed) * 1000
    : 20000;

  return {
    containerRef,
    isPaused,
    animationCSS: `
      @keyframes marquee {
        0% { transform: translateX(${direction === 'left' ? '0' : '100%'}); }
        100% { transform: translateX(${direction === 'left' ? '-100%' : '0'}); }
      }
      
      .marquee-content {
        animation: marquee ${animationDuration}ms linear infinite;
        animation-play-state: ${isPaused ? 'paused' : 'running'};
      }
    `,
  };
};
```

---

## Component Code Examples

### AnimatedCTA Button

Create `/src/components/homepage/AnimatedCTA.tsx`:

```typescript
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedCTAProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
}

const AnimatedCTA = ({
  children,
  href,
  onClick,
  className,
  size = 'md',
  variant = 'primary',
  icon,
}: AnimatedCTAProps) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-500 hover:border-emerald-400 shadow-glow-emerald hover:shadow-glow-emerald',
    secondary:
      'bg-transparent text-emerald-500 border border-emerald-500 hover:bg-emerald-500/10',
  };

  const baseClasses =
    'group relative overflow-hidden inline-flex items-center gap-2 h-12 rounded-lg transition-all duration-300 font-semibold hover:scale-105';

  return (
    <Button
      as={href ? 'a' : 'button'}
      href={href}
      onClick={onClick}
      className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
    >
      {/* Shiny overlay */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-white/0 via-white/40 to-white/0 pointer-events-none" />
      
      {/* Content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {icon && <span className="group-hover:translate-x-1 transition-transform">{icon}</span>}
      </span>
    </Button>
  );
};

export default AnimatedCTA;
```

### Hero Section

Create `/src/components/homepage/HeroSection.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedCTA from './AnimatedCTA';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: { text: string; href: string };
  backgroundImage?: string;
}

const HeroSection = ({
  title = 'AI-Powered Football Predictions',
  subtitle = 'Competitive Advantage Through Intelligence',
  description = 'WinMix combines advanced pattern recognition with real-time market data to deliver predictions with unmatched accuracy.',
  primaryCTA = { text: 'Create Predictions Now', href: '/predictions/new' },
  backgroundImage = '/images/hero-bg.webp',
}: HeroSectionProps) => {
  const navigate = useNavigate();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-75 will-change-transform"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          transform: `translateY(${scrollOffset}px)`,
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        {/* Additional radial gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-violet-500/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'max-w-3xl mx-auto text-center animate-fade-in',
            !isLoading && 'opacity-100'
          )}
        >
          {/* Subtitle pill */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              {subtitle}
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gradient-emerald">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AnimatedCTA
              onClick={() => navigate(primaryCTA.href)}
              size="lg"
              className="w-full sm:w-auto"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {primaryCTA.text}
            </AnimatedCTA>

            <button
              onClick={() => navigate('/teams')}
              className="w-full sm:w-auto px-8 py-3 rounded-lg border border-gray-600 text-gray-300 font-semibold hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300"
            >
              Explore Data
            </button>
          </div>

          {/* Trust badge */}
          <div className="mt-12 pt-8 border-t border-gray-700/50 flex flex-col sm:flex-row justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>500+ Predictions Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>89% Average Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>Real-time Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-emerald-500 rounded-full flex items-start justify-center p-2 opacity-70">
          <div className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
```

### Community Hero (Avatar Marquee)

Create `/src/components/homepage/CommunityHero.tsx`:

```typescript
import { useRef, useState, useEffect } from 'react';

interface Avatar {
  id: string;
  src: string;
  alt: string;
  badge?: string;
}

interface CommunityHeroProps {
  avatars: Avatar[];
  autoScrollSpeed?: number; // milliseconds for full rotation
  pauseOnHover?: boolean;
}

const CommunityHero = ({
  avatars,
  autoScrollSpeed = 15000,
  pauseOnHover = true,
}: CommunityHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const duration = autoScrollSpeed / 1000;

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-dark-gradient">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-gradient-emerald">Trusted by</span> Professional Tipsters
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join hundreds of successful predictions made by our community
        </p>

        {/* Marquee container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden py-8"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }

            .marquee-content {
              animation: marquee ${duration}s linear infinite;
              animation-play-state: ${isPaused ? 'paused' : 'running'};
            }

            .marquee-content:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="marquee-content flex gap-6 will-change-transform">
            {/* Original set */}
            {avatars.map((avatar) => (
              <div
                key={`${avatar.id}-1`}
                className="flex-shrink-0 group relative"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-emerald-500/50 shadow-glow-emerald transition-all duration-300 group-hover:border-emerald-400 group-hover:shadow-glow-emerald group-hover:scale-110">
                  <img
                    src={avatar.src}
                    alt={avatar.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {avatar.badge && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                      {avatar.badge}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Duplicate set for seamless loop */}
            {avatars.map((avatar) => (
              <div
                key={`${avatar.id}-2`}
                className="flex-shrink-0 group relative"
                aria-hidden="true"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-emerald-500/50 shadow-glow-emerald transition-all duration-300 group-hover:border-emerald-400 group-hover:shadow-glow-emerald group-hover:scale-110">
                  <img
                    src={avatar.src}
                    alt={avatar.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {avatar.badge && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                      {avatar.badge}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};

export default CommunityHero;
```

### Feature Showcase

Create `/src/components/homepage/FeatureShowcase.tsx`:

```typescript
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStaggerAnimation } from '@/hooks/useStaggerAnimation';
import { cn } from '@/lib/utils';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  metrics?: string[];
  href?: string;
}

interface FeatureShowcaseProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
}

const FeatureShowcase = ({
  features,
  title = 'Core Capabilities',
  subtitle = 'Everything you need to dominate the prediction market',
}: FeatureShowcaseProps) => {
  const { getItemAnimation } = useStaggerAnimation({
    itemCount: features.length,
    delay: 100,
    offset: 80,
  });

  return (
    <section className="relative py-16 md:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-emerald">{title}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              style={getItemAnimation(index)}
              className="glass-card p-6 md:p-8 rounded-xl hover:bg-white/10 hover:border-emerald-500 transition-all duration-300 group cursor-default"
            >
              {/* Icon */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:shadow-glow-emerald transition-all duration-300 text-emerald-400 text-xl md:text-2xl">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold mb-3">{feature.title}</h3>

              {/* Description */}
              <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Metrics */}
              {feature.metrics && feature.metrics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {feature.metrics.map((metric, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              )}

              {/* Link */}
              {feature.href && (
                <a
                  href={feature.href}
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-all duration-200 group/link"
                >
                  Learn more
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-2xl p-8 md:p-12">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Dominate?</h3>
            <p className="text-muted-foreground max-w-sm">
              Get started with WinMix today and unlock your competitive advantage
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-end">
            <button className="flex-1 sm:flex-none px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow-emerald">
              Start Free Trial
            </button>
            <button className="flex-1 sm:flex-none px-8 py-3 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 font-semibold rounded-lg transition-all duration-300">
              View All Features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
```

---

## Data & Props Examples

### Sample Data File

Create `/src/data/homepage.ts`:

```typescript
export const SAMPLE_AVATARS = [
  {
    id: '1',
    src: '/images/avatars/avatar-1.jpg',
    alt: 'Maria Chen, Professional Tipster',
    badge: 'Top Predictor',
  },
  {
    id: '2',
    src: '/images/avatars/avatar-2.jpg',
    alt: 'James O\'Brien, Data Analyst',
    badge: '500+ Wins',
  },
  {
    id: '3',
    src: '/images/avatars/avatar-3.jpg',
    alt: 'Priya Patel, Data Scientist',
  },
  {
    id: '4',
    src: '/images/avatars/avatar-4.jpg',
    alt: 'Ahmed Hassan, Coach',
  },
  {
    id: '5',
    src: '/images/avatars/avatar-5.jpg',
    alt: 'Sophie Laurent, Sports Journalist',
  },
  {
    id: '6',
    src: '/images/avatars/avatar-6.jpg',
    alt: 'Marcus Johnson, Statistician',
  },
];

export const SAMPLE_FEATURES = [
  {
    icon: '⚡',
    title: 'AI-Powered Analysis',
    description: 'Advanced pattern recognition trained on years of football data',
    metrics: ['Real-time', 'ML-Driven'],
    href: '#',
  },
  {
    icon: '🎯',
    title: 'Real-time Predictions',
    description: 'Generate detailed match predictions in seconds',
    metrics: ['Instant', 'Accurate'],
    href: '#',
  },
  {
    icon: '📊',
    title: 'Cross-League Intelligence',
    description: 'Discover meta-patterns across 50+ international leagues',
    metrics: ['Global', 'Comprehensive'],
    href: '#',
  },
  {
    icon: '🏆',
    title: 'Confidence Metrics',
    description: 'View explainable confidence scores and win probabilities',
    metrics: ['Transparent', 'Explainable'],
    href: '#',
  },
  {
    icon: '🔄',
    title: 'Continuous Learning',
    description: 'Models improve daily through our feedback loop system',
    metrics: ['Adaptive', 'Self-Improving'],
    href: '#',
  },
  {
    icon: '📈',
    title: 'Market Integration',
    description: 'Blend market odds with AI predictions for sharper edges',
    metrics: ['Smart', 'Profitable'],
    href: '#',
  },
];

export const SAMPLE_TESTIMONIALS = [
  {
    id: '1',
    quote: 'WinMix transformed how I analyze matches. I\'ve gone from 65% to 89% accuracy in just 3 months. This is genuinely game-changing technology.',
    author: 'Maria Chen',
    role: 'Professional Tipster',
    location: 'Shanghai',
    rating: 5,
    metric: '89% Accuracy',
  },
  {
    id: '2',
    quote: 'The cross-league intelligence feature revealed patterns I never would have spotted manually. My win rate jumped by 24% in the first month.',
    author: 'James O\'Brien',
    role: 'Data Analyst',
    location: 'London',
    rating: 5,
    metric: '+24% Win Rate',
  },
  {
    id: '3',
    quote: 'Real-time predictions that actually hit. The confidence metrics are accurate and the UI makes it easy to decide which matches to bet.',
    author: 'Priya Patel',
    role: 'Independent Trader',
    location: 'Mumbai',
    rating: 5,
    metric: '500+ Predictions',
  },
];

export const SAMPLE_INTEGRATIONS = [
  {
    id: 'supabase',
    name: 'Supabase',
    logo: '/images/integrations/supabase.svg',
    status: 'active' as const,
  },
  {
    id: 'github',
    name: 'GitHub',
    logo: '/images/integrations/github.svg',
    status: 'active' as const,
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: '/images/integrations/slack.svg',
    status: 'available' as const,
  },
  {
    id: 'linear',
    name: 'Linear',
    logo: '/images/integrations/linear.svg',
    status: 'active' as const,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '/images/integrations/stripe.svg',
    status: 'available' as const,
  },
  {
    id: 'sentry',
    name: 'Sentry',
    logo: '/images/integrations/sentry.svg',
    status: 'active' as const,
  },
  {
    id: 'n8n',
    name: 'n8n',
    logo: '/images/integrations/n8n.svg',
    status: 'available' as const,
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    logo: '/images/integrations/analytics.svg',
    status: 'active' as const,
  },
  {
    id: 'datadog',
    name: 'Datadog',
    logo: '/images/integrations/datadog.svg',
    status: 'available' as const,
  },
];
```

---

## Responsive Image Loading Pattern

Create `/src/lib/image-loader.ts`:

```typescript
export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
}

/**
 * Generate responsive image srcset for modern formats
 * Serves WebP with JPEG fallback
 */
export const generateImageSrcset = (
  basePath: string,
  sizes: number[] = [320, 640, 1024, 1440, 1920]
) => {
  return {
    webp: sizes
      .map((size) => `${basePath}-${size}.webp ${size}w`)
      .join(', '),
    jpeg: sizes
      .map((size) => `${basePath}-${size}.jpg ${size}w`)
      .join(', '),
  };
};

/**
 * React component for responsive images with fallback
 */
export const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px',
}: ResponsiveImageProps & { sizes?: string }) => {
  const [imageSrc, setImageSrc] = React.useState(src);

  return (
    <picture>
      <source
        srcSet={generateImageSrcset(src.replace(/\.\w+$/, ''), [320, 640, 1024, 1440]).webp}
        type="image/webp"
        sizes={sizes}
      />
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading="lazy"
        onError={() => setImageSrc(src.replace(/\.webp/, '.jpg'))}
        className="w-full h-auto"
      />
    </picture>
  );
};
```

---

## Tailwind Configuration Additions

Add these to your `tailwind.config.ts` if not already present:

```typescript
export default {
  // ... existing config
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 500ms ease-out forwards',
        'slide-in-right': 'slide-in-right 600ms ease-out forwards',
        'pop-in': 'pop-in 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
      },
      boxShadow: {
        'glow-emerald': '0 0 60px rgba(34, 197, 94, 0.3)',
        'glow-violet': '0 0 60px rgba(168, 85, 247, 0.3)',
      },
    },
  },
}
```

---

## Performance Optimization Patterns

### Image Lazy Loading

```tsx
<img
  src="/images/hero-bg.webp"
  alt="Hero background"
  loading="lazy"
  decoding="async"
  className="w-full h-auto"
/>
```

### CSS Will-Change for Animations

```tsx
<div
  className="will-change-transform"
  style={{
    animation: 'marquee 20s linear infinite',
  }}
>
  {/* Content */}
</div>
```

### Intersection Observer for Reveal

```typescript
const useRevealOnScroll = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold }
    );

    ref.current && observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};
```

---

## Browser Testing Checklist Code

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format check
npm run format

# Build
npm run build

# Test (if available)
npm run test
```

---

**Document Version**: 1.0
**Last Updated**: 2024-12-04
