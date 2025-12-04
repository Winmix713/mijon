/**
 * WinMix Prototype Interactivity Module
 * Handles dynamic content generation and interactive components:
 * - Animated CTA button with shimmer effect
 * - Infinite scrolling marquee with pause-on-hover
 * - Feature cards with scroll-trigger reveal animation
 * - Integration grid with status indicators
 * - Testimonial carousel with auto-advance and manual navigation
 */

// Access mock data from global scope (loaded via mock-data.js script tag)
const MOCK_AVATARS = window.MOCK_AVATARS || [];
const MOCK_FEATURES = window.MOCK_FEATURES || [];
const MOCK_TESTIMONIALS = window.MOCK_TESTIMONIALS || [];
const MOCK_INTEGRATIONS = window.MOCK_INTEGRATIONS || [];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if prefers-reduced-motion is enabled
 */
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get data attribute values with fallback to defaults
 */
const getDataAttributes = (element, defaults = {}) => {
  const data = { ...defaults };
  for (const [key, value] of Object.entries(element.dataset)) {
    data[key] = isNaN(value) ? value : Number(value);
  }
  return data;
};

/**
 * Create element with attributes and return it
 */
const createElement = (tag, className = '', attrs = {}) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attrs).forEach(([key, value]) => {
    if (key.startsWith('aria')) {
      el.setAttribute(key, value);
    } else if (key.startsWith('data')) {
      el.dataset[key.replace('data', '')] = value;
    } else {
      el[key] = value;
    }
  });
  return el;
};

// ============================================================================
// CTA BUTTON INTERACTIVITY
// ============================================================================

class CTAButtonManager {
  constructor() {
    this.buttons = [];
    this.init();
  }

  init() {
    this.buttons = document.querySelectorAll('.btn-cta');
    this.buttons.forEach(btn => {
      this.attachHandlers(btn);
      // Initial shimmer after page load
      if (!prefersReducedMotion()) {
        setTimeout(() => this.playShimmer(btn), 1000);
      }
    });
  }

  attachHandlers(btn) {
    // Shimmer on hover
    btn.addEventListener('mouseenter', () => this.playShimmer(btn));
    btn.addEventListener('focus', () => this.playShimmer(btn));
    
    // Shimmer on click
    btn.addEventListener('click', () => this.playShimmer(btn));
  }

  playShimmer(btn) {
    if (prefersReducedMotion()) return;

    // Remove shimmer class if already present
    btn.classList.remove('shimmer');
    
    // Trigger reflow to restart animation
    void btn.offsetWidth;
    
    // Add shimmer class
    btn.classList.add('shimmer');
    
    // Remove class after animation completes
    setTimeout(() => {
      btn.classList.remove('shimmer');
    }, 500);
  }
}

// ============================================================================
// MARQUEE COMPONENT
// ============================================================================

class MarqueeManager {
  constructor(selector = '.marquee-container') {
    this.container = document.querySelector(selector);
    if (!this.container) return;

    this.marquee = this.container.querySelector('.marquee');
    this.data = getDataAttributes(this.container, {
      speed: 30, // seconds for full rotation
      pauseOnHover: true,
      autoPlay: true
    });

    this.paused = false;
    this.init();
  }

  init() {
    if (!this.marquee) return;

    // Generate content if needed
    const items = this.marquee.querySelectorAll('.marquee-item');
    if (items.length === 0) {
      this.generateAvatars();
    }

    // Duplicate items for seamless loop
    this.duplicateItems();

    // Set animation speed
    this.updateAnimationSpeed();

    // Attach event listeners
    this.attachHandlers();

    // Update animation speed dynamically
    if (!prefersReducedMotion()) {
      this.marquee.style.animationDuration = `${this.data.speed}s`;
    }
  }

  generateAvatars() {
    MOCK_AVATARS.forEach(avatar => {
      const item = createElement('div', 'marquee-item');
      
      const img = createElement('img', 'marquee-avatar', {
        src: avatar.src,
        alt: `${avatar.name}, ${avatar.role}`,
        loading: 'lazy'
      });
      
      item.appendChild(img);

      if (avatar.badge) {
        const badge = createElement('span', 'marquee-badge');
        badge.textContent = avatar.badge;
        item.appendChild(badge);
      }

      this.marquee.appendChild(item);
    });
  }

  duplicateItems() {
    const items = Array.from(this.marquee.querySelectorAll('.marquee-item'));
    items.forEach(item => {
      this.marquee.appendChild(item.cloneNode(true));
    });
  }

  attachHandlers() {
    if (this.data.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pause());
      this.container.addEventListener('mouseleave', () => this.play());
    }

    // Tap to pause on mobile
    this.container.addEventListener('touchstart', () => {
      if (!this.paused) {
        this.pause();
        // Auto-resume after 3 seconds
        setTimeout(() => this.play(), 3000);
      }
    });
  }

  pause() {
    if (prefersReducedMotion()) return;
    this.paused = true;
    this.container.classList.add('paused');
  }

  play() {
    if (prefersReducedMotion()) return;
    this.paused = false;
    this.container.classList.remove('paused');
  }

  updateAnimationSpeed() {
    if (prefersReducedMotion()) {
      this.marquee.style.animationPlayState = 'paused';
      return;
    }
    this.marquee.style.animationDuration = `${this.data.speed}s`;
  }
}

// ============================================================================
// FEATURE CARDS WITH INTERSECTION OBSERVER
// ============================================================================

class FeatureGridManager {
  constructor(selector = '.features-grid') {
    this.grid = document.querySelector(selector);
    if (!this.grid) return;

    this.data = getDataAttributes(this.grid, {
      threshold: 0.1,
      staggerDelay: 100 // ms between card animations
    });

    this.init();
  }

  init() {
    // Generate cards if needed
    const cards = this.grid.querySelectorAll('.feature-card');
    if (cards.length === 0) {
      this.generateCards();
    }

    // Set up Intersection Observer for scroll trigger
    this.setupObserver();
  }

  generateCards() {
    MOCK_FEATURES.forEach((feature, index) => {
      const card = createElement('div', 'glass-card feature-card');
      
      // Icon
      const iconEl = createElement('div', 'feature-icon');
      iconEl.textContent = feature.icon;
      card.appendChild(iconEl);

      // Title
      const titleEl = createElement('h3', 'feature-title');
      titleEl.textContent = feature.title;
      card.appendChild(titleEl);

      // Description
      const descEl = createElement('p', 'feature-description');
      descEl.textContent = feature.description;
      card.appendChild(descEl);

      // Metrics
      if (feature.metrics && feature.metrics.length > 0) {
        const metricsEl = createElement('div', 'feature-metrics');
        feature.metrics.forEach(metric => {
          const metricEl = createElement('span', 'feature-metric');
          metricEl.textContent = metric;
          metricsEl.appendChild(metricEl);
        });
        card.appendChild(metricsEl);
      }

      // Store index for staggered animation
      card.dataset.index = index;

      this.grid.appendChild(card);
    });
  }

  setupObserver() {
    const options = {
      threshold: this.data.threshold,
      rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('revealed')) {
          const index = parseInt(entry.target.dataset.index || 0);
          const delay = index * this.data.staggerDelay;

          if (prefersReducedMotion()) {
            entry.target.classList.add('revealed');
          } else {
            setTimeout(() => {
              entry.target.classList.add('revealed');
              entry.target.style.animationDelay = `${delay}ms`;
            }, 0);
          }

          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.grid.querySelectorAll('.feature-card').forEach(card => {
      observer.observe(card);
    });
  }
}

// ============================================================================
// INTEGRATION GRID WITH STATUS INDICATORS
// ============================================================================

class IntegrationGridManager {
  constructor(selector = '.integrations-grid') {
    this.grid = document.querySelector(selector);
    if (!this.grid) return;

    this.init();
  }

  init() {
    // Generate cards if needed
    const cards = this.grid.querySelectorAll('.integration-card');
    if (cards.length === 0) {
      this.generateCards();
    }

    this.attachHandlers();
  }

  generateCards() {
    MOCK_INTEGRATIONS.forEach((integration, index) => {
      const card = createElement('div', 'glass-card integration-card', {
        tabindex: 0,
        role: 'button',
        ariaLabel: `${integration.name} integration, ${integration.status}`
      });

      // Logo
      const logoEl = createElement('span', 'integration-logo');
      logoEl.textContent = integration.logo;
      card.appendChild(logoEl);

      // Name
      const nameEl = createElement('div', 'integration-name');
      nameEl.textContent = integration.name;
      card.appendChild(nameEl);

      // Status
      const statusEl = createElement('span', `integration-status ${integration.status}`);
      
      const indicator = createElement('span', 'status-indicator');
      statusEl.appendChild(indicator);

      const statusText = createElement('span');
      statusText.textContent = integration.status === 'active' ? 'Connected' : 'Connecting...';
      statusEl.appendChild(statusText);

      card.appendChild(statusEl);

      card.dataset.index = index;
      card.dataset.status = integration.status;

      this.grid.appendChild(card);
    });
  }

  attachHandlers() {
    this.grid.querySelectorAll('.integration-card').forEach(card => {
      // Keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardClick(card);
        }
      });

      card.addEventListener('click', () => this.handleCardClick(card));
    });
  }

  handleCardClick(card) {
    if (prefersReducedMotion()) return;

    // Pulse animation on click
    card.style.animation = 'none';
    void card.offsetWidth; // Trigger reflow
    card.style.animation = 'glow-pulse 0.6s ease-out';
  }
}

// ============================================================================
// TESTIMONIAL CAROUSEL
// ============================================================================

class TestimonialCarousel {
  constructor(selector = '.carousel') {
    this.carousel = document.querySelector(selector);
    if (!this.carousel) return;

    this.data = getDataAttributes(this.carousel, {
      autoAdvance: true,
      interval: 8000, // 8 seconds
      enableKeyboard: true,
      enableArrows: true,
      enableDots: true
    });

    this.currentIndex = 0;
    this.slides = [];
    this.autoAdvanceTimeout = null;
    this.paused = false;

    this.init();
  }

  init() {
    // Generate slides if needed
    const existingSlides = this.carousel.querySelectorAll('.carousel-slide');
    if (existingSlides.length === 0) {
      this.generateSlides();
    }

    this.slides = this.carousel.querySelectorAll('.carousel-slide');
    
    // Create controls
    this.createControls();

    // Attach event listeners
    this.attachHandlers();

    // Start auto-advance
    if (this.data.autoAdvance && !prefersReducedMotion()) {
      this.scheduleAutoAdvance();
    }

    // Show first slide
    this.showSlide(0);
  }

  generateSlides() {
    const slidesContainer = createElement('div', 'carousel-slides');

    MOCK_TESTIMONIALS.forEach((testimonial) => {
      const slide = createElement('div', 'carousel-slide glass-card');

      const quote = createElement('p', 'quote');
      quote.textContent = testimonial.quote;
      slide.appendChild(quote);

      const author = createElement('div', 'testimonial-author');
      author.textContent = testimonial.author;
      slide.appendChild(author);

      const role = createElement('div', 'testimonial-role');
      role.textContent = testimonial.role;
      slide.appendChild(role);

      const location = createElement('div', 'testimonial-location');
      location.textContent = testimonial.location;
      slide.appendChild(location);

      const metric = createElement('div', 'testimonial-metric');
      metric.textContent = testimonial.metric;
      slide.appendChild(metric);

      slide.dataset.index = testimonial.id;
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-live', 'polite');
      slide.setAttribute('aria-atomic', 'true');

      slidesContainer.appendChild(slide);
    });

    // Find or create a container for slides
    let navContainer = this.carousel.querySelector('.carousel-nav');
    if (navContainer) {
      this.carousel.insertBefore(slidesContainer, navContainer);
    } else {
      this.carousel.appendChild(slidesContainer);
    }
  }

  createControls() {
    // Check if controls already exist
    let navContainer = this.carousel.querySelector('.carousel-nav');
    if (navContainer && navContainer.querySelectorAll('.carousel-arrow').length > 0) {
      return;
    }

    if (!navContainer) {
      navContainer = createElement('div', 'carousel-nav');
      navContainer.setAttribute('role', 'group');
      navContainer.setAttribute('aria-label', 'Testimonial carousel controls');
      this.carousel.appendChild(navContainer);
    }

    // Previous arrow
    const prevBtn = createElement('button', 'carousel-arrow', {
      ariaLabel: 'Previous testimonial',
      innerHTML: '←'
    });
    prevBtn.addEventListener('click', () => this.prev());

    // Dots
    const dotsContainer = createElement('div', 'carousel-dots', {
      role: 'tablist',
      ariaLabel: 'Testimonial slides'
    });

    this.slides.forEach((_, index) => {
      const dot = createElement('button', 'carousel-dot', {
        ariaLabel: `Go to testimonial ${index + 1}`,
        ariaSelected: index === 0 ? 'true' : 'false',
        role: 'tab'
      });
      dot.addEventListener('click', () => this.showSlide(index));
      dotsContainer.appendChild(dot);
    });

    // Next arrow
    const nextBtn = createElement('button', 'carousel-arrow', {
      ariaLabel: 'Next testimonial',
      innerHTML: '→'
    });
    nextBtn.addEventListener('click', () => this.next());

    navContainer.appendChild(prevBtn);
    navContainer.appendChild(dotsContainer);
    navContainer.appendChild(nextBtn);

    this.dotsContainer = dotsContainer;
  }

  attachHandlers() {
    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoAdvance());
    this.carousel.addEventListener('mouseleave', () => this.resumeAutoAdvance());

    // Pause on focus
    this.carousel.addEventListener('focusin', () => this.pauseAutoAdvance());
    this.carousel.addEventListener('focusout', () => this.resumeAutoAdvance());

    // Keyboard navigation
    if (this.data.enableKeyboard) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    }
  }

  showSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    this.currentIndex = index;

    // Hide all slides
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    // Update dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(nextIndex);
    this.resetAutoAdvance();
  }

  prev() {
    const prevIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.showSlide(prevIndex);
    this.resetAutoAdvance();
  }

  scheduleAutoAdvance() {
    if (prefersReducedMotion() || !this.data.autoAdvance) return;

    this.autoAdvanceTimeout = setTimeout(() => {
      if (!this.paused) {
        this.next();
        this.scheduleAutoAdvance();
      }
    }, this.data.interval);
  }

  pauseAutoAdvance() {
    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.paused = true;
    }
  }

  resumeAutoAdvance() {
    this.paused = false;
    if (this.data.autoAdvance) {
      this.scheduleAutoAdvance();
    }
  }

  resetAutoAdvance() {
    this.pauseAutoAdvance();
    this.resumeAutoAdvance();
  }
}

// ============================================================================
// FEATURE CTA SECTION GENERATOR
// ============================================================================

class FeatureCTAManager {
  constructor(selector = '.feature-cta-section') {
    this.section = document.querySelector(selector);
    if (!this.section) {
      this.createCTASection();
    }
  }

  createCTASection() {
    // Find features section
    const featuresSection = document.querySelector('.features-section');
    if (!featuresSection) return;

    const grid = featuresSection.querySelector('.features-grid');
    if (!grid) return;

    const ctaSection = createElement('div', 'feature-cta-section');

    // Left text
    const textDiv = createElement('div', 'feature-cta-text');
    
    const h3 = createElement('h3');
    h3.textContent = 'Ready to Transform Your Predictions?';
    textDiv.appendChild(h3);

    const p = createElement('p');
    p.textContent = 'Get started with WinMix today and unlock your competitive advantage in football analytics.';
    textDiv.appendChild(p);

    ctaSection.appendChild(textDiv);

    // Right buttons
    const buttonDiv = createElement('div', 'feature-cta-buttons');

    const startBtn = createElement('button', 'btn-cta', {
      innerHTML: 'Start Free Trial <span class="btn-cta-shine"></span>'
    });

    const learnBtn = createElement('button', 'btn-secondary');
    learnBtn.textContent = 'View All Features';

    buttonDiv.appendChild(startBtn);
    buttonDiv.appendChild(learnBtn);

    ctaSection.appendChild(buttonDiv);

    // Insert after grid
    grid.parentElement.insertBefore(ctaSection, grid.nextSibling);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all interactive components when DOM is loaded
 */
function initializePrototype() {
  // Check for reduced motion preference
  if (prefersReducedMotion()) {
    document.documentElement.style.setProperty('--transition-normal', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
  }

  // Initialize managers
  new CTAButtonManager();
  new MarqueeManager();
  new FeatureGridManager();
  new IntegrationGridManager();
  new TestimonialCarousel();
  new FeatureCTAManager();

  // Add loaded state
  document.body.classList.add('prototype-loaded');

  // Set up media query listener for reduced motion changes
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addListener((e) => {
    location.reload();
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePrototype);
} else {
  initializePrototype();
}

// Make available globally for testing
window.CTAButtonManager = CTAButtonManager;
window.MarqueeManager = MarqueeManager;
window.FeatureGridManager = FeatureGridManager;
window.IntegrationGridManager = IntegrationGridManager;
window.TestimonialCarousel = TestimonialCarousel;
window.FeatureCTAManager = FeatureCTAManager;
window.prefersReducedMotion = prefersReducedMotion;
window.getDataAttributes = getDataAttributes;
