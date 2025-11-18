/* ==========================================================================
   MB Studio Fix - Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initTestimonialSlider();
    initFAQAccordion();
    initGalleryFilter();
    initBookingForm();
    initContactForm();
    initNewsletterForm();
    initCartFunctionality();
    initLightbox();
    initScrollAnimations();
    initServiceSelector();
});

/* ==========================================================================
   Navigation
   ========================================================================== */

function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ==========================================================================
   Testimonial Slider
   ========================================================================== */

function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');

    if (testimonials.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active');
        });

        testimonials[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }

    // Click on dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentIndex = index;
            showTestimonial(currentIndex);
            resetAutoSlide();
        });
    });

    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextTestimonial, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* ==========================================================================
   Gallery Filter
   ========================================================================== */

function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Product filter (shop page)
    const categoryFilter = document.getElementById('category-filter');
    const productCards = document.querySelectorAll('.product-card');

    if (categoryFilter && productCards.length > 0) {
        categoryFilter.addEventListener('change', function() {
            const filter = this.value;

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

/* ==========================================================================
   Booking Form
   ========================================================================== */

function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    const steps = bookingForm.querySelectorAll('.form-step');
    const nextButtons = bookingForm.querySelectorAll('.next-step');
    const prevButtons = bookingForm.querySelectorAll('.prev-step');
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === stepIndex) {
                step.classList.add('active');
            }
        });
    }

    // Next step buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Previous step buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentStep--;
            showStep(currentStep);
        });
    });

    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateStep(currentStep)) {
            // Show success message
            bookingForm.style.display = 'none';
            document.getElementById('bookingSuccess').style.display = 'block';

            // In production, you would send the form data to a server here
            console.log('Booking submitted successfully');
        }
    });

    // Set minimum date for date inputs
    const dateInputs = bookingForm.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
}

function validateStep(stepIndex) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${stepIndex + 1}"]`);
    if (!currentStepElement) return true;

    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.classList.add('error');
            field.addEventListener('input', function() {
                this.classList.remove('error');
            }, { once: true });
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields.');
    }

    return isValid;
}

/* ==========================================================================
   Service Selector (Booking Page)
   ========================================================================== */

function initServiceSelector() {
    const serviceCategory = document.querySelectorAll('input[name="serviceCategory"]');
    const specificService = document.getElementById('specificService');

    if (!specificService) return;

    const services = {
        lashes: [
            { value: 'classic-lashes', text: 'Classic Lashes - $150' },
            { value: 'volume-lashes', text: 'Volume Lashes - $200' },
            { value: 'mega-volume', text: 'Mega Volume Lashes - $250' },
            { value: 'lash-fill', text: 'Lash Fill - $65+' }
        ],
        brows: [
            { value: 'microblading', text: 'Microblading - $400' },
            { value: 'powder-brows', text: 'Powder Brows - $450' },
            { value: 'combo-brows', text: 'Combination Brows - $500' },
            { value: 'brow-touchup', text: 'Brow Touch-up - $100+' }
        ],
        lips: [
            { value: 'lip-blush', text: 'Lip Blush - $450' },
            { value: 'lip-neutralization', text: 'Lip Neutralization - $400' },
            { value: 'lip-touchup', text: 'Lip Touch-up - $125' }
        ],
        spa: [
            { value: 'facial', text: 'Facial Treatment - $85' },
            { value: 'massage', text: 'Relaxation Massage - $95' },
            { value: 'lash-tint', text: 'Lash & Brow Tinting - $35' },
            { value: 'brow-lamination', text: 'Brow Lamination - $75' }
        ],
        course: [
            { value: 'lash-certification', text: '2-Day Lash Certification - $1,200' },
            { value: 'classic-lash-course', text: 'Classic Lash Fundamentals - $800' },
            { value: 'volume-lash-course', text: 'Volume Lash Masterclass - $600' },
            { value: 'microblading-course', text: 'Microblading Certification - $2,500' },
            { value: 'powder-brows-course', text: 'Powder Brows Training - $2,200' },
            { value: 'lip-blush-course', text: 'Lip Blush Certification - $2,000' }
        ],
        consultation: [
            { value: 'free-consultation', text: 'Free Consultation - 30 min' }
        ]
    };

    serviceCategory.forEach(radio => {
        radio.addEventListener('change', function() {
            const category = this.value;
            const options = services[category] || [];

            // Clear existing options
            specificService.innerHTML = '<option value="">Select a service</option>';

            // Add new options
            options.forEach(service => {
                const option = document.createElement('option');
                option.value = service.value;
                option.textContent = service.text;
                specificService.appendChild(option);
            });
        });
    });

    // Check URL parameters for pre-selected course
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course');

    if (courseParam) {
        const courseRadio = document.querySelector('input[name="serviceCategory"][value="course"]');
        if (courseRadio) {
            courseRadio.checked = true;
            courseRadio.dispatchEvent(new Event('change'));

            setTimeout(() => {
                if (specificService) {
                    specificService.value = courseParam;
                }
            }, 100);
        }
    }
}

/* ==========================================================================
   Contact Form
   ========================================================================== */

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (isValid) {
            // Show success message
            alert('Thank you for your message! We will get back to you within 24 hours.');
            contactForm.reset();

            // In production, send data to server
            console.log('Contact form submitted');
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

/* ==========================================================================
   Newsletter Form
   ========================================================================== */

function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email && isValidEmail(email)) {
                alert('Thank you for subscribing! Check your email for a confirmation.');
                emailInput.value = '';

                // In production, send to email service
                console.log('Newsletter subscription:', email);
            } else {
                alert('Please enter a valid email address.');
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ==========================================================================
   Cart Functionality
   ========================================================================== */

function initCartFunctionality() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');

    let cart = [];

    // Open cart
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close cart
    function closeCartSidebar() {
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }

    // Add to cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;

            // Parse price
            const priceMatch = productPrice.match(/\$(\d+\.?\d*)/);
            const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

            // Add to cart array
            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();

            // Show feedback
            this.textContent = 'Added!';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 1500);
        });
    });

    function updateCart() {
        if (!cartItems || !cartCount || !totalAmount) return;

        // Update count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart items display
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <button class="remove-item" data-name="${item.name}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Add remove functionality
            cartItems.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const name = this.getAttribute('data-name');
                    cart = cart.filter(item => item.name !== name);
                    updateCart();
                });
            });
        }

        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }
}

/* ==========================================================================
   Lightbox
   ========================================================================== */

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const viewButtons = document.querySelectorAll('.view-btn');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightbox || viewButtons.length === 0) return;

    let currentImageIndex = 0;
    const images = Array.from(viewButtons);

    // Open lightbox
    viewButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            currentImageIndex = index;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            // Update image display
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            // Update image display
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   Scroll Animations
   ========================================================================== */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ==========================================================================
   Utility Functions
   ========================================================================== */

// Debounce function
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

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Add CSS for cart item styling
const cartItemStyles = `
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #e5e0d8;
    }

    .cart-item:last-child {
        border-bottom: none;
    }

    .cart-item-info h4 {
        font-size: 0.9375rem;
        margin-bottom: 0.25rem;
    }

    .cart-item-info p {
        font-size: 0.875rem;
        color: #7a756c;
        margin-bottom: 0;
    }

    .remove-item {
        background: none;
        border: none;
        color: #7a756c;
        cursor: pointer;
        padding: 0.5rem;
    }

    .remove-item:hover {
        color: #e74c3c;
    }

    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c;
    }

    .aos-animate {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = cartItemStyles;
document.head.appendChild(styleSheet);
