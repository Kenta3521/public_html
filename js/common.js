// Ginrei Festival Website - Common JavaScript
// Handles component loading and common interactions

// ==================== Component Loading ====================
/**
 * Calculate the correct relative path to components based on current page depth
 * @returns {string} - Relative path prefix (e.g., '../' or '')
 */
function getComponentPath() {
  const path = window.location.pathname;
  const depth = path.split('/').filter(segment => segment && segment !== 'index.html').length;
  
  // If we're at root (depth 0), path is ./components/
  // If we're one level deep (depth 1), path is ../components/
  if (depth === 0) {
    return './components/';
  } else {
    return '../components/';
  }
}

/**
 * Load header and footer components dynamically
 */
async function loadComponents() {
  const componentPath = getComponentPath();
  
  try {
    // Load header
    const headerResponse = await fetch(`${componentPath}header.html`);
    if (headerResponse.ok) {
      const headerHTML = await headerResponse.text();
      const headerElement = document.getElementById('header');
      if (headerElement) {
        headerElement.innerHTML = headerHTML;
      }
    }
    
    // Load footer
    const footerResponse = await fetch(`${componentPath}footer.html`);
    if (footerResponse.ok) {
      const footerHTML = await footerResponse.text();
      const footerElement = document.getElementById('footer');
      if (footerElement) {
        footerElement.innerHTML = footerHTML;
      }
    }
    
    // Initialize navigation after loading
    initializeNavigation();
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

// ==================== Navigation ====================
/**
 * Initialize navigation interactions
 */
function initializeNavigation() {
  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Dropdown toggle for mobile
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const hasDropdown = item.querySelector('.dropdown');
    if (hasDropdown && window.innerWidth <= 768) {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
          e.preventDefault();
          item.classList.toggle('active');
        }
      });
    }
  });
  
  // Highlight current page in navigation
  highlightCurrentPage();
}

/**
 * Highlight the current page in navigation
 */
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('./', '').replace('../', ''))) {
      link.style.color = 'var(--color-gold)';
    }
  });
}

// ==================== Animations ====================
/**
 * Add fade-in animation to elements when they enter viewport
 */
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all cards and sections
  const animatedElements = document.querySelectorAll('.card, .section');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ==================== Particle Effects (for theme page) ====================
/**
 * Create floating particle effect
 */
function createParticles(containerId, count = 20) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 2px and 6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random starting position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = '0';
    
    // Random animation delay
    particle.style.animationDelay = `${Math.random() * 10}s`;
    
    // Random animation duration
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    
    container.appendChild(particle);
  }
}

// ==================== Smooth Scroll ====================
/**
 * Enable smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==================== Initialization ====================
/**
 * Initialize all common functionality
 */
function init() {
  loadComponents();
  initializeSmoothScroll();
  
  // Wait a bit before initializing scroll animations to ensure content is loaded
  setTimeout(() => {
    initializeScrollAnimations();
  }, 100);
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions for use in other scripts
window.ginreiUtils = {
  createParticles,
  getComponentPath
};
