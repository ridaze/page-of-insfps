/**
 * =====================================================
 * AGRICULTURAL INSTITUTE - MAIN JAVASCRIPT
 * =====================================================
 * This file contains all the interactive functionality for the website,
 * including hero slider, navigation, admin panel, and content management.
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    // Admin credentials (demo purposes only)
    ADMIN_USERNAME: 'admin',
    ADMIN_PASSWORD: 'admin123',
    
    // LocalStorage keys
    STORAGE_KEYS: {
        ADMIN_LOGGED_IN: 'agri_admin_logged_in',
        ACTIVITIES: 'agri_activities',
        LANGUAGE: 'agri_language'
    },
    
    // Slider settings
    SLIDER: {
        AUTO_PLAY_INTERVAL: 5000,
        TRANSITION_DURATION: 500
    },
    
    // Default placeholder image for activities
    DEFAULT_ACTIVITY_IMAGE: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'
};

// ==================== STATE MANAGEMENT ====================
const state = {
    currentSlide: 0,
    totalSlides: 3,
    sliderInterval: null,
    isAdminLoggedIn: false,
    currentLanguage: 'en',
    editingActivityId: null,
    deletingActivityId: null,
    activities: []
};

// ==================== DOM ELEMENTS ====================
const elements = {
    // Header
    header: document.getElementById('header'),
    navMenu: document.getElementById('navMenu'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    adminLoginBtn: document.getElementById('adminLoginBtn'),
    
    // Hero Slider
    heroSlider: document.getElementById('heroSlider'),
    prevSlide: document.getElementById('prevSlide'),
    nextSlide: document.getElementById('nextSlide'),
    sliderDots: document.getElementById('sliderDots'),
    
    // Activities
    activitiesGrid: document.getElementById('activitiesGrid'),
    adminControls: document.getElementById('adminControls'),
    addPostBtn: document.getElementById('addPostBtn'),
    emptyState: document.getElementById('emptyState'),
    
    // Modals
    loginModal: document.getElementById('loginModal'),
    activityModal: document.getElementById('activityModal'),
    deleteModal: document.getElementById('deleteModal'),
    
    // Forms
    loginForm: document.getElementById('loginForm'),
    activityForm: document.getElementById('activityForm'),
    contactForm: document.getElementById('contactForm'),
    newsletterForm: document.getElementById('newsletterForm'),
    
    // Toast
    toast: document.getElementById('toast')
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load saved data from localStorage
    loadFromStorage();
    
    // Initialize components
    initHeader();
    initHeroSlider();
    initActivities();
    initModals();
    initForms();
    initScrollEffects();
    initLanguageSwitcher();
    
    // Update UI based on admin state
    updateAdminUI();
}

// ==================== LOCAL STORAGE ====================
function loadFromStorage() {
    // Load admin login state
    const adminState = localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN);
    if (adminState === 'true') {
        state.isAdminLoggedIn = true;
    }
    
    // Load activities
    const savedActivities = localStorage.getItem(CONFIG.STORAGE_KEYS.ACTIVITIES);
    if (savedActivities) {
        try {
            state.activities = JSON.parse(savedActivities);
        } catch (e) {
            console.error('Error parsing activities from storage:', e);
            state.activities = [];
        }
    } else {
        // Initialize with default activities
        state.activities = getDefaultActivities();
        saveActivitiesToStorage();
    }
    
    // Load language preference
    const savedLang = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE);
    if (savedLang) {
        state.currentLanguage = savedLang;
    }
}

function saveActivitiesToStorage() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.ACTIVITIES, JSON.stringify(state.activities));
}

function getDefaultActivities() {
    return [
        {
            id: 1,
            title: 'Annual Sustainable Farming Workshop',
            date: '2024-06-15',
            image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
            description: 'Join us for our annual workshop on sustainable farming practices. Learn from industry experts about crop rotation, organic pest control, and water conservation techniques that will help you maximize yield while protecting the environment.',
            category: 'workshop'
        },
        {
            id: 2,
            title: 'New Research: Climate-Resilient Crop Varieties',
            date: '2024-05-28',
            image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80',
            description: 'Our research team has developed new climate-resilient crop varieties that can withstand extreme weather conditions. These varieties show 30% higher yield in drought conditions and are now available for pilot testing.',
            category: 'news'
        },
        {
            id: 3,
            title: 'International Agricultural Technology Expo',
            date: '2024-07-20',
            image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=600&q=80',
            description: 'Don\'t miss our upcoming technology expo featuring the latest in agricultural innovation. See live demonstrations of precision farming equipment, drone technology, and IoT-based monitoring systems.',
            category: 'event'
        },
        {
            id: 4,
            title: 'Scholarship Program for Young Farmers',
            date: '2024-06-01',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
            description: 'We are pleased to announce a new scholarship program for young farmers aged 18-35. The program covers full tuition for our advanced agricultural management courses and includes mentorship from industry leaders.',
            category: 'announcement'
        },
        {
            id: 5,
            title: 'Organic Certification Training',
            date: '2024-08-10',
            image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&q=80',
            description: 'Learn the complete process of obtaining organic certification for your farm. This comprehensive training covers soil preparation, pest management, documentation requirements, and inspection procedures.',
            category: 'workshop'
        },
        {
            id: 6,
            title: 'Partnership with Global Agri-Tech Leaders',
            date: '2024-05-15',
            image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80',
            description: 'The Agricultural Institute has formed strategic partnerships with leading agri-tech companies worldwide. This collaboration will bring cutting-edge technology and expertise to our training programs and research initiatives.',
            category: 'news'
        }
    ];
}

// ==================== HEADER ====================
function initHeader() {
    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            elements.header.classList.add('scrolled');
        } else {
            elements.header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    elements.mobileMenuToggle.addEventListener('click', () => {
        elements.mobileMenuToggle.classList.toggle('active');
        elements.navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileMenuToggle.classList.remove('active');
            elements.navMenu.classList.remove('active');
        });
    });
    
    // Admin login button
    elements.adminLoginBtn.addEventListener('click', () => {
        if (state.isAdminLoggedIn) {
            // Logout
            logout();
        } else {
            // Open login modal
            openModal(elements.loginModal);
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== HERO SLIDER ====================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Auto-play slider
    startSliderAutoPlay();
    
    // Previous button
    elements.prevSlide.addEventListener('click', () => {
        goToSlide(getPreviousSlideIndex());
        resetSliderAutoPlay();
    });
    
    // Next button
    elements.nextSlide.addEventListener('click', () => {
        goToSlide(getNextSlideIndex());
        resetSliderAutoPlay();
    });
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetSliderAutoPlay();
        });
    });
    
    // Pause slider on hover
    elements.heroSlider.addEventListener('mouseenter', stopSliderAutoPlay);
    elements.heroSlider.addEventListener('mouseleave', startSliderAutoPlay);
    
    function goToSlide(index) {
        slides[state.currentSlide].classList.remove('active');
        dots[state.currentSlide].classList.remove('active');
        
        state.currentSlide = index;
        
        slides[state.currentSlide].classList.add('active');
        dots[state.currentSlide].classList.add('active');
    }
    
    function getNextSlideIndex() {
        return (state.currentSlide + 1) % state.totalSlides;
    }
    
    function getPreviousSlideIndex() {
        return (state.currentSlide - 1 + state.totalSlides) % state.totalSlides;
    }
    
    function startSliderAutoPlay() {
        state.sliderInterval = setInterval(() => {
            goToSlide(getNextSlideIndex());
        }, CONFIG.SLIDER.AUTO_PLAY_INTERVAL);
    }
    
    function stopSliderAutoPlay() {
        clearInterval(state.sliderInterval);
    }
    
    function resetSliderAutoPlay() {
        stopSliderAutoPlay();
        startSliderAutoPlay();
    }
}

// ==================== ACTIVITIES ====================
function initActivities() {
    renderActivities();
    
    // Add post button (admin only)
    if (elements.addPostBtn) {
        elements.addPostBtn.addEventListener('click', () => {
            openActivityModal();
        });
    }
}

function renderActivities() {
    if (!elements.activitiesGrid) return;
    
    elements.activitiesGrid.innerHTML = '';
    
    if (state.activities.length === 0) {
        elements.emptyState.style.display = 'block';
        return;
    }
    
    elements.emptyState.style.display = 'none';
    
    // Sort activities by date (newest first)
    const sortedActivities = [...state.activities].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    sortedActivities.forEach(activity => {
        const card = createActivityCard(activity);
        elements.activitiesGrid.appendChild(card);
    });
}

function createActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.dataset.id = activity.id;
    
    const formattedDate = formatDate(activity.date);
    const categoryLabel = getCategoryLabel(activity.category);
    const imageSrc = activity.image || CONFIG.DEFAULT_ACTIVITY_IMAGE;
    
    let adminActionsHTML = '';
    if (state.isAdminLoggedIn) {
        adminActionsHTML = `
            <div class="activity-admin-actions">
                <button class="btn btn-outline edit-activity-btn" data-id="${activity.id}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                </button>
                <button class="btn btn-danger delete-activity-btn" data-id="${activity.id}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                </button>
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="activity-image">
            <img src="${imageSrc}" alt="${activity.title}" loading="lazy" onerror="this.src='${CONFIG.DEFAULT_ACTIVITY_IMAGE}'">
            <span class="activity-category">${categoryLabel}</span>
        </div>
        <div class="activity-content">
            <div class="activity-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${formattedDate}
            </div>
            <h3 class="activity-title">${activity.title}</h3>
            <p class="activity-description">${activity.description}</p>
        </div>
        ${adminActionsHTML}
    `;
    
    // Add event listeners for admin actions
    if (state.isAdminLoggedIn) {
        const editBtn = card.querySelector('.edit-activity-btn');
        const deleteBtn = card.querySelector('.delete-activity-btn');
        
        editBtn.addEventListener('click', () => {
            openActivityModal(activity);
        });
        
        deleteBtn.addEventListener('click', () => {
            openDeleteModal(activity.id);
        });
    }
    
    return card;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    
    if (state.currentLanguage === 'ar') {
        return date.toLocaleDateString('ar-EG', options);
    }
    return date.toLocaleDateString('en-US', options);
}

function getCategoryLabel(category) {
    const labels = {
        event: { en: 'Event', ar: 'حدث' },
        news: { en: 'News', ar: 'أخبار' },
        announcement: { en: 'Announcement', ar: 'إعلان' },
        workshop: { en: 'Workshop', ar: 'ورشة عمل' }
    };
    
    return labels[category] ? labels[category][state.currentLanguage] || labels[category].en : category;
}

// ==================== MODALS ====================
function initModals() {
    // Close buttons
    document.getElementById('closeLoginModal').addEventListener('click', () => {
        closeModal(elements.loginModal);
    });
    
    document.getElementById('closeActivityModal').addEventListener('click', () => {
        closeModal(elements.activityModal);
    });
    
    document.getElementById('cancelActivityBtn').addEventListener('click', () => {
        closeModal(elements.activityModal);
    });
    
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        closeModal(elements.deleteModal);
    });
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        deleteActivity();
    });
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal);
            });
        }
    });
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input, textarea, select');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset forms
    if (modal === elements.loginModal) {
        elements.loginForm.reset();
        document.getElementById('loginError').style.display = 'none';
    } else if (modal === elements.activityModal) {
        elements.activityForm.reset();
        state.editingActivityId = null;
        document.getElementById('activityModalTitle').textContent = 'Add New Activity';
    } else if (modal === elements.deleteModal) {
        state.deletingActivityId = null;
    }
}

function openActivityModal(activity = null) {
    const modal = elements.activityModal;
    const title = document.getElementById('activityModalTitle');
    
    if (activity) {
        // Edit mode
        title.textContent = 'Edit Activity';
        state.editingActivityId = activity.id;
        
        document.getElementById('activityId').value = activity.id;
        document.getElementById('activityTitle').value = activity.title;
        document.getElementById('activityDate').value = activity.date;
        document.getElementById('activityImage').value = activity.image || '';
        document.getElementById('activityDescription').value = activity.description;
        document.getElementById('activityCategory').value = activity.category;
    } else {
        // Add mode
        title.textContent = 'Add New Activity';
        state.editingActivityId = null;
        
        elements.activityForm.reset();
        document.getElementById('activityId').value = '';
        
        // Set default date to today
        document.getElementById('activityDate').value = new Date().toISOString().split('T')[0];
    }
    
    openModal(modal);
}

function openDeleteModal(activityId) {
    state.deletingActivityId = activityId;
    openModal(elements.deleteModal);
}

// ==================== FORMS ====================
function initForms() {
    // Login form
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
    
    // Activity form
    elements.activityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleActivitySubmit();
    });
    
    // Contact form
    elements.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleContactSubmit();
    });
    
    // Newsletter form
    elements.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleNewsletterSubmit();
    });
}

function handleLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    
    if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
        state.isAdminLoggedIn = true;
        localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
        
        closeModal(elements.loginModal);
        updateAdminUI();
        showToast('Successfully logged in as Admin', 'success');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function logout() {
    state.isAdminLoggedIn = false;
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_LOGGED_IN);
    
    updateAdminUI();
    showToast('Successfully logged out', 'success');
}

function handleActivitySubmit() {
    const id = document.getElementById('activityId').value;
    const title = document.getElementById('activityTitle').value.trim();
    const date = document.getElementById('activityDate').value;
    const image = document.getElementById('activityImage').value.trim();
    const description = document.getElementById('activityDescription').value.trim();
    const category = document.getElementById('activityCategory').value;
    
    if (!title || !date || !description) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (id) {
        // Edit existing activity
        const index = state.activities.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            state.activities[index] = {
                ...state.activities[index],
                title,
                date,
                image: image || CONFIG.DEFAULT_ACTIVITY_IMAGE,
                description,
                category
            };
            showToast('Activity updated successfully', 'success');
        }
    } else {
        // Add new activity
        const newActivity = {
            id: Date.now(),
            title,
            date,
            image: image || CONFIG.DEFAULT_ACTIVITY_IMAGE,
            description,
            category
        };
        state.activities.push(newActivity);
        showToast('Activity added successfully', 'success');
    }
    
    saveActivitiesToStorage();
    renderActivities();
    closeModal(elements.activityModal);
}

function deleteActivity() {
    if (!state.deletingActivityId) return;
    
    state.activities = state.activities.filter(a => a.id !== state.deletingActivityId);
    
    saveActivitiesToStorage();
    renderActivities();
    closeModal(elements.deleteModal);
    showToast('Activity deleted successfully', 'success');
}

function handleContactSubmit() {
    // Simulate form submission
    const formData = new FormData(elements.contactForm);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Contact form submitted:', data);
    
    showToast('Thank you for your message! We will get back to you soon.', 'success');
    elements.contactForm.reset();
}

function handleNewsletterSubmit() {
    const email = elements.newsletterForm.querySelector('input[type="email"]').value;
    
    console.log('Newsletter subscription:', email);
    
    showToast('Thank you for subscribing to our newsletter!', 'success');
    elements.newsletterForm.reset();
}

// ==================== ADMIN UI ====================
function updateAdminUI() {
    // Update admin login button
    if (state.isAdminLoggedIn) {
        elements.adminLoginBtn.classList.add('logged-in');
        elements.adminLoginBtn.querySelector('span').textContent = 'Logout';
        elements.adminControls.style.display = 'flex';
    } else {
        elements.adminLoginBtn.classList.remove('logged-in');
        elements.adminLoginBtn.querySelector('span').textContent = 'Admin';
        elements.adminControls.style.display = 'none';
    }
    
    // Re-render activities to show/hide admin actions
    renderActivities();
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate stats if it's the stats section
                if (entry.target.classList.contains('about-stats')) {
                    animateStats();
                }
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.about-section, .training-section, .activities-section, .contact-section').forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });
    
    // Observe stats
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Observe individual cards
    document.querySelectorAll('.training-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('reveal');
        observer.observe(card);
    });
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const animate = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(animate);
            } else {
                stat.textContent = target.toLocaleString() + '+';
            }
        };
        
        animate();
    });
}

// ==================== LANGUAGE SWITCHER ====================
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            switchLanguage(lang);
        });
    });
    
    // Apply saved language preference
    if (state.currentLanguage === 'ar') {
        switchLanguage('ar');
    }
}

function switchLanguage(lang) {
    state.currentLanguage = lang;
    localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
    
    // Update HTML direction and lang attribute
    const html = document.documentElement;
    if (lang === 'ar') {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
    } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
    }
    
    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update content based on language
    updateLanguageContent(lang);
    
    // Re-render activities to update category labels
    renderActivities();
}

function updateLanguageContent(lang) {
    // Dictionary for translatable content
    const translations = {
        en: {
            home: 'Home',
            about: 'About',
            training: 'Training',
            activities: 'Activities',
            contact: 'Contact',
            admin: 'Admin',
            logout: 'Logout'
        },
        ar: {
            home: 'الرئيسية',
            about: 'من نحن',
            training: 'التدريب',
            activities: 'الأنشطة',
            contact: 'اتصل بنا',
            admin: 'الإدارة',
            logout: 'تسجيل خروج'
        }
    };
    
    const t = translations[lang] || translations.en;
    
    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const section = link.dataset.section;
        if (t[section]) {
            link.textContent = t[section];
        }
    });
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'success') {
    const toast = elements.toast;
    const messageEl = toast.querySelector('.toast-message');
    
    // Remove existing classes
    toast.classList.remove('active', 'success', 'error');
    
    // Set new content and class
    messageEl.textContent = message;
    toast.classList.add(type);
    
    // Show toast
    requestAnimationFrame(() => {
        toast.classList.add('active');
    });
    
    // Hide after delay
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ==================== UTILITY FUNCTIONS ====================
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}