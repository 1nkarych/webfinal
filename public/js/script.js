// Main JavaScript functionality
document.addEventListener("DOMContentLoaded", function() {
    console.log('Main script initialized');
    
    // Initialize carousels
    initCarousels();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup contact buttons
    setupContactButtons();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Add any additional animations
    setupAnimations();
});

// Carousel functionality
function initCarousels() {
    console.log('Initializing carousels...');
    
    // Initialize each carousel
    const carousels = [
        { track: '#carousel-track', indicators: '#carousel-indicators' },
        { track: '#carousel-track2', indicators: '#carousel-indicators2' },
        { track: '#carousel-track3', indicators: '#carousel-indicators3' },
        { track: '#carousel-track4', indicators: '#carousel-indicators4' }
    ];
    
    carousels.forEach((carousel, index) => {
        const track = document.querySelector(carousel.track);
        const indicators = document.querySelector(carousel.indicators);
        
        if (track) {
            initCarousel(carousel.track, carousel.indicators);
            console.log(`Carousel ${index + 1} initialized`);
        } else {
            console.warn(`Carousel track not found: ${carousel.track}`);
        }
    });
}

function initCarousel(trackSelector, indicatorSelector) {
    const track = document.querySelector(trackSelector);
    const cards = Array.from(track.children);
    const indicators = document.querySelector(indicatorSelector);
    let currentIndex = 0;

    if (!track) {
        console.error('Carousel track not found:', trackSelector);
        return;
    }

    console.log(`Initializing carousel: ${trackSelector} with ${cards.length} cards`);

    // Create indicators if they exist
    if (indicators) {
        indicators.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => moveToSlide(i));
            indicators.appendChild(dot);
        });
    }

    function moveToSlide(newIndex) {
        if (newIndex < 0) newIndex = cards.length - 1;
        if (newIndex >= cards.length) newIndex = 0;
        
        currentIndex = newIndex;
        const cardWidth = cards[0].offsetWidth + 24; // Include gap
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        updateIndicators();
        console.log(`Moved to slide: ${currentIndex}`);
    }

    function updateIndicators() {
        if (!indicators) return;
        const dots = indicators.querySelectorAll("button");
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
            dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
        });
    }

    // Auto-advance carousel
    setInterval(() => moveToSlide(currentIndex + 1), 5000);

    // Find parent container and arrow buttons
    const parent = track.closest(".carousel-container, .carousel-container2");
    if (parent) {
        const leftBtn = parent.querySelector(".carousel-arrow.left");
        const rightBtn = parent.querySelector(".carousel-arrow.right");

        if (leftBtn) {
            leftBtn.addEventListener("click", () => moveToSlide(currentIndex - 1));
        }
        if (rightBtn) {
            rightBtn.addEventListener("click", () => moveToSlide(currentIndex + 1));
        }
    }

    // Make carousel accessible via keyboard
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', 'Carousel');
    
    cards.forEach((card, index) => {
        card.setAttribute('role', 'group');
        card.setAttribute('aria-label', `Slide ${index + 1} of ${cards.length}`);
    });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            
            // Skip if it's just "#" or external link
            if (href === "#" || href.startsWith("#!")) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ 
                    behavior: "smooth",
                    block: "start"
                });
                
                // Update URL without page jump
                history.pushState(null, null, href);
            }
        });
    });
}

// Contact buttons functionality
function setupContactButtons() {
    document.querySelectorAll(".questions-button, .footer-button a, .promo-button").forEach(btn => {
        btn.addEventListener("click", function(e) {
            if (this.getAttribute('href') === '#contacts') {
                e.preventDefault();
                const contactSection = document.querySelector("#contacts");
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav");

    if (burger && nav) {
        burger.addEventListener("click", function() {
            nav.classList.toggle("open");
            burger.classList.toggle("active");
            
            // Update aria-expanded for accessibility
            const isExpanded = nav.classList.contains("open");
            burger.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove("open");
                burger.classList.remove("active");
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('open')) {
                nav.classList.remove("open");
                burger.classList.remove("active");
                document.body.style.overflow = '';
            }
        });
    }
}

// Additional animations and effects
function setupAnimations() {
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial state
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });

    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.advantage-card, .product-card, .reviews-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility function for showing messages
function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    messageEl.setAttribute('role', 'alert');
    
    // Add styles if not already in CSS
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    if (type === 'success') {
        messageEl.style.background = 'var(--success-color)';
    } else if (type === 'error') {
        messageEl.style.background = 'var(--error-color)';
    } else if (type === 'warning') {
        messageEl.style.background = 'var(--warning-color)';
    } else {
        messageEl.style.background = 'var(--info-color)';
    }
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 3000);
}

// Add CSS for message animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);