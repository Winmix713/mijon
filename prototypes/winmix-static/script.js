// WinMix Static Prototype JavaScript
// Handles all interactions and dynamic content loading

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('WinMix prototype initializing...');
    
    // Initialize all components
    initializeMarquee();
    initializeFeatureGrid();
    initializeIntegrationGrid();
    initializeTestimonialCarousel();
    initializeScrollAnimations();
    initializeKeyboardNavigation();
    
    console.log('WinMix prototype initialized successfully');
});

// Marquee functionality for community section
function initializeMarquee() {
    const marqueeContainer = document.getElementById('marquee-content');
    if (!marqueeContainer) return;
    
    const avatars = window.MockData?.AVATAR_DATA || [];
    if (avatars.length === 0) {
        console.warn('No avatar data available');
        return;
    }
    
    // Create marquee content (duplicate for seamless loop)
    const marqueeHTML = createMarqueeContent(avatars);
    marqueeContainer.innerHTML = marqueeHTML + marqueeHTML; // Duplicate for seamless loop
    
    // Add hover pause functionality
    const marqueeSection = document.getElementById('marquee-container');
    if (marqueeSection) {
        marqueeSection.addEventListener('mouseenter', () => {
            marqueeContainer.classList.add('paused');
        });
        
        marqueeSection.addEventListener('mouseleave', () => {
            marqueeContainer.classList.remove('paused');
        });
    }
}

function createMarqueeContent(avatars) {
    return avatars.map(avatar => `
        <div class="avatar-item flex-shrink-0 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-emerald-500 shadow-glow-emerald cursor-pointer overflow-hidden bg-gradient-to-br ${avatar.gradient}">
            <img src="${avatar.src}" alt="${avatar.alt}" class="w-full h-full object-cover" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="w-full h-full hidden items-center justify-center text-white font-bold text-lg md:text-xl bg-gradient-to-br ${avatar.gradient}">
                ${avatar.initials}
            </div>
        </div>
    `).join('');
}

// Feature grid functionality
function initializeFeatureGrid() {
    const featureGrid = document.getElementById('feature-grid');
    if (!featureGrid) return;
    
    const features = window.MockData?.FEATURE_DATA || [];
    if (features.length === 0) {
        console.warn('No feature data available');
        return;
    }
    
    featureGrid.innerHTML = features.map((feature, index) => createFeatureCard(feature, index)).join('');
    
    // Add stagger animation
    setTimeout(() => {
        const cards = featureGrid.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

function createFeatureCard(feature, index) {
    const metricsHTML = feature.metrics.map(metric => 
        `<span class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-full text-xs font-medium text-emerald-400">
            ${metric}
        </span>`
    ).join(' ');
    
    return `
        <div class="feature-card glass-card p-6 rounded-xl border border-gray-700/50 cursor-pointer opacity-0 transform translate-y-4 transition-all duration-300" 
             style="transition-delay: ${index * 50}ms">
            <div class="feature-icon w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-2xl mb-4 transition-all duration-300">
                ${feature.icon}
            </div>
            <h3 class="text-xl font-semibold mb-3 text-foreground">${feature.title}</h3>
            <p class="text-muted-foreground mb-4 text-sm leading-relaxed">${feature.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${metricsHTML}
            </div>
            <a href="#" class="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
                Learn More
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    `;
}

// Integration grid functionality
function initializeIntegrationGrid() {
    const integrationGrid = document.getElementById('integration-grid');
    if (!integrationGrid) return;
    
    const integrations = window.MockData?.INTEGRATION_DATA || [];
    if (integrations.length === 0) {
        console.warn('No integration data available');
        return;
    }
    
    integrationGrid.innerHTML = integrations.map((integration, index) => 
        createIntegrationItem(integration, index)
    ).join('');
    
    // Add stagger animation
    setTimeout(() => {
        const items = integrationGrid.querySelectorAll('.integration-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, index * 150);
        });
    }, 200);
}

function createIntegrationItem(integration, index) {
    const statusClass = integration.status === 'active' ? 'status-active' : 
                       integration.status === 'error' ? 'status-error' : 'status-available';
    
    return `
        <div class="integration-item relative glass-card p-6 rounded-xl border border-gray-700/50 cursor-pointer opacity-0 transform scale-90 transition-all duration-300" 
             style="transition-delay: ${index * 100}ms"
             title="${integration.name} - ${integration.description}">
            <div class="status-dot ${statusClass}"></div>
            <div class="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-800 rounded-lg">
                <img src="${integration.logo}" alt="${integration.name} logo" class="w-12 h-12 object-contain" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                <div class="hidden text-2xl font-bold text-gray-400">
                    ${integration.name.charAt(0)}
                </div>
            </div>
            <div class="text-center">
                <h4 class="font-medium text-foreground text-sm">${integration.name}</h4>
                <p class="text-xs text-muted-foreground mt-1">${integration.description}</p>
            </div>
        </div>
    `;
}

// Testimonial carousel functionality
let currentTestimonial = 0;
let testimonialInterval;

function initializeTestimonialCarousel() {
    const testimonials = window.MockData?.TESTIMONIAL_DATA || [];
    if (testimonials.length === 0) {
        console.warn('No testimonial data available');
        return;
    }
    
    // Initialize dots
    initializeTestimonialDots(testimonials.length);
    
    // Show first testimonial
    showTestimonial(0);
    
    // Start auto-advance
    startTestimonialAutoAdvance();
    
    // Add navigation event listeners
    document.getElementById('prev-testimonial')?.addEventListener('click', () => {
        navigateTestimonial(-1);
    });
    
    document.getElementById('next-testimonial')?.addEventListener('click', () => {
        navigateTestimonial(1);
    });
    
    // Pause on hover
    const testimonialCard = document.getElementById('testimonial-card');
    if (testimonialCard) {
        testimonialCard.addEventListener('mouseenter', stopTestimonialAutoAdvance);
        testimonialCard.addEventListener('mouseleave', startTestimonialAutoAdvance);
    }
}

function initializeTestimonialDots(count) {
    const dotsContainer = document.getElementById('testimonial-dots');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = Array.from({ length: count }, (_, index) => 
        `<button class="w-2 h-2 rounded-full transition-all duration-300 ${
            index === 0 ? 'bg-emerald-500 w-8' : 'bg-gray-600 hover:bg-gray-500'
        }" onclick="showTestimonial(${index})" aria-label="Go to testimonial ${index + 1}"></button>`
    ).join('');
}

function showTestimonial(index) {
    const testimonials = window.MockData?.TESTIMONIAL_DATA || [];
    if (testimonials.length === 0) return;
    
    currentTestimonial = index;
    const testimonial = testimonials[index];
    
    // Update content with animations
    const quoteElement = document.getElementById('testimonial-quote');
    const authorElement = document.getElementById('testimonial-author');
    const roleElement = document.getElementById('testimonial-role');
    const ratingElement = document.getElementById('testimonial-rating');
    const metricElement = document.getElementById('testimonial-metric');
    
    if (quoteElement) {
        quoteElement.style.opacity = '0';
        setTimeout(() => {
            quoteElement.textContent = testimonial.quote;
            quoteElement.style.opacity = '1';
        }, 100);
    }
    
    if (authorElement) {
        authorElement.style.opacity = '0';
        setTimeout(() => {
            authorElement.textContent = testimonial.author;
            authorElement.style.opacity = '1';
        }, 600);
    }
    
    if (roleElement) {
        roleElement.style.opacity = '0';
        setTimeout(() => {
            roleElement.textContent = `${testimonial.role}, ${testimonial.location}`;
            roleElement.style.opacity = '1';
        }, 900);
    }
    
    // Update stars
    if (ratingElement) {
        ratingElement.innerHTML = '';
        Array.from({ length: 5 }, (_, starIndex) => {
            const star = document.createElement('svg');
            star.className = `w-5 h-5 testimonial-star ${starIndex < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`;
            star.style.animationDelay = `${1200 + starIndex * 100}ms`;
            star.innerHTML = `
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            `;
            ratingElement.appendChild(star);
        });
    }
    
    // Update metric
    if (metricElement) {
        metricElement.style.opacity = '0';
        setTimeout(() => {
            metricElement.innerHTML = `
                <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span class="text-sm font-medium text-emerald-400">${testimonial.metric}</span>
            `;
            metricElement.style.opacity = '1';
        }, 1700);
    }
    
    // Update dots
    updateTestimonialDots();
}

function updateTestimonialDots() {
    const dots = document.querySelectorAll('#testimonial-dots button');
    dots.forEach((dot, index) => {
        if (index === currentTestimonial) {
            dot.className = 'w-8 h-2 rounded-full bg-emerald-500 transition-all duration-300';
        } else {
            dot.className = 'w-2 h-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-all duration-300';
        }
    });
}

function navigateTestimonial(direction) {
    const testimonials = window.MockData?.TESTIMONIAL_DATA || [];
    if (testimonials.length === 0) return;
    
    currentTestimonial = (currentTestimonial + direction + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
    resetTestimonialAutoAdvance();
}

function startTestimonialAutoAdvance() {
    stopTestimonialAutoAdvance();
    testimonialInterval = setInterval(() => {
        navigateTestimonial(1);
    }, 8000);
}

function stopTestimonialAutoAdvance() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
}

function resetTestimonialAutoAdvance() {
    stopTestimonialAutoAdvance();
    startTestimonialAutoAdvance();
}

// Scroll animations
function initializeScrollAnimations() {
    // Add parallax effect to hero section
    const heroSection = document.querySelector('[data-section="hero"]');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = heroSection.querySelectorAll('.absolute.inset-0');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    // Add fade-in animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section[data-section]').forEach(section => {
        observer.observe(section);
    });
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Testimonial navigation
        if (e.key === 'ArrowLeft') {
            navigateTestimonial(-1);
        } else if (e.key === 'ArrowRight') {
            navigateTestimonial(1);
        } else if (e.key === 'Escape') {
            // Stop auto-advance on Escape
            stopTestimonialAutoAdvance();
        }
        
        // Smooth scroll to sections
        const sections = ['hero', 'community', 'features', 'integrations', 'testimonials', 'footer'];
        const key = parseInt(e.key);
        
        if (key >= 1 && key <= sections.length) {
            const targetSection = document.querySelector(`[data-section="${sections[key - 1]}"]`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Add focus management for better accessibility
    document.addEventListener('focusin', (e) => {
        if (e.target.matches('button, a, [tabindex="0"]')) {
            // Add visual indicator for focused element
            e.target.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-2', 'ring-offset-black');
        }
    });
    
    document.addEventListener('focusout', (e) => {
        if (e.target.matches('button, a, [tabindex="0"]')) {
            // Remove visual indicator
            e.target.classList.remove('ring-2', 'ring-emerald-500', 'ring-offset-2', 'ring-offset-black');
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring
function logPerformanceMetrics() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        });
    }
}

// Initialize performance monitoring
logPerformanceMetrics();

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error in WinMix prototype:', e.error);
});

// Export functions for global access if needed
window.WinMixPrototype = {
    showTestimonial,
    navigateTestimonial,
    stopTestimonialAutoAdvance,
    startTestimonialAutoAdvance
};