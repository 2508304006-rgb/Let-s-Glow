/* ====================================================================
   LET'S GLOW — Premium Skincare Brand
   JavaScript: Scroll animations, carousel, particles, smooth scroll
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ======================== NAVBAR ======================== */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll detection — add 'scrolled' class for glassmorphism background
    const handleNavScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    /* ======================== SMOOTH SCROLLING ======================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ======================== SCROLL ANIMATIONS ======================== */
    // IntersectionObserver for fade-in / slide-up animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once animated (performance)
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => scrollObserver.observe(el));

    /* ======================== PARALLAX SCROLLING ======================== */
    const parallaxSections = document.querySelectorAll('[data-parallax]');

    const handleParallax = () => {
        const scrollY = window.scrollY;
        parallaxSections.forEach(section => {
            const speed = parseFloat(section.dataset.parallax) || 0.2;
            const rect = section.getBoundingClientRect();
            const offset = (rect.top + scrollY) - scrollY;
            section.style.transform = `translateY(${offset * speed * 0.1}px)`;
        });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* ======================== TESTIMONIALS CAROUSEL ======================== */
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    const cards = carouselTrack.querySelectorAll('.testimonial-card');
    const totalSlides = cards.length;
    let currentSlide = 0;
    let autoPlayTimer;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        currentSlide = index;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });

        // Reset auto-play timer on manual interaction
        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-play every 6 seconds
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 6000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    startAutoPlay();

    // Pause on hover
    const carousel = document.getElementById('testimonialCarousel');
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
    }, { passive: true });

    /* ======================== FLOATING PARTICLES ======================== */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3 - 0.15; // slight upward drift
            this.opacity = Math.random() * 0.3 + 0.05;
            this.maxOpacity = this.opacity;
            this.fadeSpeed = Math.random() * 0.002 + 0.001;
            this.growing = Math.random() > 0.5;

            // Warm gold/blush tones
            const hues = [30, 35, 40, 20, 350];
            this.hue = hues[Math.floor(Math.random() * hues.length)];
            this.saturation = Math.random() * 30 + 30;
            this.lightness = Math.random() * 20 + 70;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Fade in/out breathing
            if (this.growing) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= this.maxOpacity + 0.1) this.growing = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0.02) this.growing = true;
            }

            // Wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
            ctx.fill();

            // Soft glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity * 0.15})`;
            ctx.fill();
        }
    }

    // Create particles — scale count by screen size
    function initParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Reinitialize on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initParticles();
        }, 300);
    });

    /* ======================== CONTACT FORM ======================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');

            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                contactForm.reset();
            }, 2500);
        }, 1800);
    });

    /* ======================== NEWSLETTER FORM ======================== */
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('.newsletter-btn');
            const originalText = btn.textContent;
            btn.textContent = '✓';
            btn.style.background = '#7cb798';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                newsletterForm.reset();
            }, 2000);
        });
    }

    /* ======================== KEYBOARD ACCESSIBILITY ======================== */
    // Carousel keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

});
