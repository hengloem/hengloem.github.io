document.addEventListener('DOMContentLoaded', function () {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const body = document.body;
    const sections = document.querySelectorAll('section[id]');

    /*===== MENU SHOW =====*/
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            body.classList.add('show-menu');
        });
    }

    /*===== MENU HIDDEN =====*/
    function closeMenu() {
        body.classList.remove('show-menu');
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (body.classList.contains('show-menu') &&
            !navMenu.contains(e.target) &&
            !e.target.closest('.nav__toggle')) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body.classList.contains('show-menu')) {
            closeMenu();
        }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMenu();
        }
    });

    // ==================== UPDATE ACTIVE LINK ON SCROLL ====================
    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // Adjusted offset for header
            const sectionId = section.getAttribute('id');

            // Check if current scroll position is within this section
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                });

                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active-link');
                }
            }
        });

        // Special handling for home section when at top of page
        if (scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active-link');
            });
            const homeLink = document.querySelector('.nav__link[href*="#home"]');
            if (homeLink) {
                homeLink.classList.add('active-link');
            }
        }
    }

    // Throttle scroll events for better performance
    let scrollTimeout;
    function throttleScroll() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function () {
                scrollTimeout = null;
                scrollActive();
            }, 100);
        }
    }

    window.addEventListener('scroll', throttleScroll);

    // ==================== CHANGE BACKGROUND HEADER ====================
    function scrollHeader() {
        const header = document.getElementById('header');
        if (window.scrollY >= 80) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    }
    window.addEventListener('scroll', scrollHeader);

    // ==================== SHOW SCROLL UP ====================
    function scrollUp() {
        const scrollUp = document.getElementById('scroll-top');
        if (window.scrollY >= 560) {
            scrollUp.classList.add('show-scroll');
        } else {
            scrollUp.classList.remove('show-scroll');
        }
    }
    window.addEventListener('scroll', scrollUp);

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only prevent default for same-page anchors
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();

                const targetId = href;
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==================== INITIAL STATES ====================
    // Set initial states
    scrollHeader();
    scrollUp();
    scrollActive(); // Set initial active link

    // Force update active state after a short delay to ensure DOM is ready
    setTimeout(scrollActive, 100);
});
// ==================== PORTFOLIO FILTER ====================
const portfolioFilters = document.querySelectorAll('.portfolio__filter'),
    portfolioItems = document.querySelectorAll('.portfolio__item')

portfolioFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Remove active class from all filters
        portfolioFilters.forEach(f => f.classList.remove('active'))

        // Add active class to clicked filter
        filter.classList.add('active')

        const filterValue = filter.getAttribute('data-filter')

        // Show/hide portfolio items based on filter
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hidden')
            } else {
                item.classList.add('hidden')
            }
        })
    })
})

// ==================== ANIMATE SKILL BARS ====================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill__progress')

    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width')
        bar.style.width = width + '%'
    })
}

// Initialize skill bars when skills section is in view
const skillsSection = document.getElementById('skills')
const observerOptions = {
    threshold: 0.3
}

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars()
            skillsObserver.unobserve(entry.target)
        }
    })
}, observerOptions)

if (skillsSection) {
    skillsObserver.observe(skillsSection)
}

// ==================== TESTIMONIAL SWIPER ====================
let swiperTestimonial = new Swiper('.testimonials__container', {
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints: {
        568: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 2,
        }
    }
});

// ==================== SCROLL SECTIONS ACTIVE LINK =============
function scrollUp() {
    const scrollUp = document.getElementById('scroll-top');
    if (this.scrollY >= 560) {
        scrollUp.classList.add('show-scroll');
    } else {
        scrollUp.classList.remove('show-scroll');
    }
}
window.addEventListener('scroll', scrollUp);

// ==================== SMOOTH SCROLL TO TOP ====================
function initScrollToTop() {
    const scrollTop = document.getElementById('scroll-top');

    if (scrollTop) {
        scrollTop.addEventListener('click', function (e) {
            e.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize scroll to top
document.addEventListener('DOMContentLoaded', function () {
    initScrollToTop();

    // Add show-scroll class if page is scrolled on load
    if (window.scrollY >= 560) {
        const scrollTop = document.getElementById('scroll-top');
        if (scrollTop) {
            scrollTop.classList.add('show-scroll');
        }
    }
});

// ==================== CHANGE BACKGROUND HEADER ====================
function scrollHeader() {
    const header = document.getElementById('header')
    if (this.scrollY >= 80) {
        header.classList.add('scroll-header')
    } else {
        header.classList.remove('scroll-header')
    }
}
window.addEventListener('scroll', scrollHeader)

// ==================== SHOW SCROLL UP ====================
function scrollUp() {
    const scrollUp = document.getElementById('scroll-top')
    if (this.scrollY >= 560) {
        scrollUp.classList.add('show-scroll')
    } else {
        scrollUp.classList.remove('show-scroll')
    }
}
window.addEventListener('scroll', scrollUp)

// ==================== DARK LIGHT THEME ====================
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected theme (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Get current theme and icon
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// Apply saved theme
if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

// Toggle theme
themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)

    // Save theme preference
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()

        const targetId = this.getAttribute('href')
        if (targetId === '#') return

        const targetElement = document.querySelector(targetId)
        if (targetElement) {
            const headerHeight = document.getElementById('header').offsetHeight
            const targetPosition = targetElement.offsetTop - headerHeight

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            })
        }
    })
})

// ==================== FORM SUBMISSION ====================
const contactForm = document.querySelector('.contact__form')

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault()

        // Get form data
        const formData = new FormData(this)
        const name = formData.get('name')
        const email = formData.get('email')
        const subject = formData.get('subject')
        const message = formData.get('message')

        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error')
            return
        }

        // Simulate form submission
        showNotification('Message sent successfully!', 'success')
        this.reset()
    })
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification--${type}`
    notification.innerHTML = `
        <span class="notification__message">${message}</span>
        <button class="notification__close">&times;</button>
    `

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style')
        styles.id = 'notification-styles'
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--card-bg);
                color: var(--text-color);
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--card-shadow);
                border: 1px solid var(--card-border);
                z-index: var(--z-modal);
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                transform: translateX(120%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification--success {
                border-left: 4px solid var(--secondary-color);
            }
            .notification--error {
                border-left: 4px solid #ef4444;
            }
            .notification__close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                color: var(--text-light);
            }
        `
        document.head.appendChild(styles)
    }

    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100)

    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        hideNotification(notification)
    }, 5000)

    // Close button
    notification.querySelector('.notification__close').addEventListener('click', () => {
        clearTimeout(autoRemove)
        hideNotification(notification)
    })
}

function hideNotification(notification) {
    notification.classList.remove('show')
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
        }
    }, 300)
}

// ==================== TYPING ANIMATION ====================
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero__title')
    if (!heroTitle) return

    const text = heroTitle.textContent
    heroTitle.textContent = ''

    let i = 0
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i)
            i++
            setTimeout(typeWriter, 100)
        }
    }

    // Start typing when hero section is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter()
                heroObserver.unobserve(entry.target)
            }
        })
    }, { threshold: 0.5 })

    heroObserver.observe(document.querySelector('.hero'))
}

// ==================== INITIALIZE ON LOAD ====================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize animations
    initTypingAnimation()

    // Add scroll-header class if page is scrolled on load
    if (window.scrollY >= 80) {
        document.getElementById('header').classList.add('scroll-header')
    }

    // Add show-scroll class if page is scrolled on load
    if (window.scrollY >= 560) {
        document.getElementById('scroll-top').classList.add('show-scroll')
    }

    // Initialize active link based on current scroll position
    scrollActive()
})

// ==================== PARALLAX EFFECT ====================
function initParallax() {
    const hero = document.querySelector('.hero')
    if (!hero) return

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset
        const rate = scrolled * -0.5

        hero.style.transform = `translateY(${rate}px)`
    })
}

// Uncomment to enable parallax effect
// initParallax()

// ==================== LOADING ANIMATION ====================
function initLoadingAnimation() {
    const loader = document.createElement('div')
    loader.className = 'page-loader'
    loader.innerHTML = `
        <div class="loader-spinner"></div>
    `

    // Add loader styles
    const styles = document.createElement('style')
    styles.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-color);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: var(--z-modal);
            transition: opacity 0.5s ease;
        }
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid var(--bg-dark);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .page-loader.hidden {
            opacity: 0;
            pointer-events: none;
        }
    `
    document.head.appendChild(styles)
    document.body.appendChild(loader)

    // Hide loader when page is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden')
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader)
                }
            }, 500)
        }, 1000)
    })
}

// Uncomment to enable loading animation
initLoadingAnimation()