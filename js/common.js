function getComponentPath() {
  const path = window.location.pathname;
  const depth = path.split('/').filter(segment => segment && segment !== 'index.html').length;

  if (depth === 0) {
    return './components/';
  } else {
    return '../components/';
  }
}

async function loadComponents() {
  const componentPath = getComponentPath();

  try {
    const headerResponse = await fetch(`${componentPath}header.html`);
    if (headerResponse.ok) {
      const headerHTML = await headerResponse.text();
      const headerElement = document.getElementById('header');
      if (headerElement) {
        headerElement.innerHTML = headerHTML;
      }
    }

    const footerResponse = await fetch(`${componentPath}footer.html`);
    if (footerResponse.ok) {
      const footerHTML = await footerResponse.text();
      const footerElement = document.getElementById('footer');
      if (footerElement) {
        footerElement.innerHTML = footerHTML;
      }
    }

    initializeNavigation();
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

function initializeNavigation() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

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

  highlightCurrentPage();
}

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

  const animatedElements = document.querySelectorAll('.card, .section');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

function createParticles(containerId, count = 20) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = '0';

    particle.style.animationDelay = `${Math.random() * 10}s`;

    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;

    container.appendChild(particle);
  }
}

function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

function init() {
  loadComponents();
  initializeSmoothScroll();

  setTimeout(() => {
    initializeScrollAnimations();
  }, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.ginreiUtils = {
  createParticles,
  getComponentPath
};
