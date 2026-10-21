var root = document.documentElement;
var themeToggle = document.querySelector('.theme-toggle');
var colorButtons = document.querySelectorAll('.theme-colors button');
var fontButtons = document.querySelectorAll('.font-options button');
var settingsPanel = document.querySelector('.settings-panel');
var settingsOverlay = document.querySelector('.settings-overlay');
var settingsOpen = document.querySelector('.settings-open');
var settingsClose = document.querySelector('.settings-close');
var navbar = document.querySelector('.site-nav');
var navLinks = Array.from(document.querySelectorAll('.site-nav .nav-link[href^="#"]'));
var navSections = navLinks.map(function (link) {
  return {
    link: link,
    section: document.getElementById(link.getAttribute('href').slice(1))
  };
}).filter(function (item) {
  return item.section !== null;
});
var filterButtons = document.querySelectorAll('.filter-button');
var projectItems = document.querySelectorAll('.project-item');
var testimonialCards = document.querySelectorAll('.testimonial-card');
var carouselDots = document.querySelectorAll('.carousel-dots button');
var testimonialTrack = document.querySelector('.testimonial-track');
var scrollTopButton = document.querySelector('.scroll-top');
var activeTestimonial = 0;

function setTheme(isDark) {
  root.classList.toggle('dark', isDark);
  themeToggle.setAttribute('aria-pressed', isDark);
  themeToggle.innerHTML = isDark
    ? '<i class="bi bi-moon-stars-fill"></i>'
    : '<i class="bi bi-sun-fill"></i>';
}

function setColor(color) {
  root.style.setProperty('--accent', color);
  var red = parseInt(color.slice(1, 3), 16);
  var green = parseInt(color.slice(3, 5), 16);
  var blue = parseInt(color.slice(5, 7), 16);
  root.style.setProperty('--accent-rgb', red + ', ' + green + ', ' + blue);

  colorButtons.forEach(function (button) {
    var selected = button.dataset.color === color;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', selected);
  });
}

function setFont(font) {
  root.style.setProperty('--font', '"' + font + '", sans-serif');

  fontButtons.forEach(function (button) {
    var selected = button.dataset.font === font;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', selected);
  });
}

function openSettings(isOpen) {
  settingsPanel.classList.toggle('open', isOpen);
  settingsPanel.setAttribute('aria-hidden', !isOpen);
  settingsPanel.toggleAttribute('inert', !isOpen);
  settingsOpen.setAttribute('aria-expanded', isOpen);
  settingsOverlay.hidden = !isOpen;
  settingsOverlay.classList.toggle('visible', isOpen);

  if (isOpen) {
    settingsClose.focus();
  } else {
    settingsOpen.focus();
  }
}

function updateActiveNav() {
  var activationPoint = window.scrollY + navbar.offsetHeight + window.innerHeight * 0.25;
  var activeSection = navSections[0];

  navSections.forEach(function (item) {
    if (item.section.getBoundingClientRect().top + window.scrollY <= activationPoint) {
      activeSection = item;
    }
  });

  navSections.forEach(function (item) {
    var isActive = item === activeSection;
    item.link.classList.toggle('active', isActive);

    if (isActive) {
      item.link.setAttribute('aria-current', 'location');
    } else {
      item.link.removeAttribute('aria-current');
    }
  });
}

function showTestimonial(index) {
  var cardsOnScreen = window.innerWidth < 768 ? 1 : 3;
  var lastIndex = Math.max(0, testimonialCards.length - cardsOnScreen);
  var gap = parseFloat(getComputedStyle(testimonialTrack).gap) || 0;
  var cardWidth = testimonialCards[0].getBoundingClientRect().width;

  if (index > lastIndex) {
    activeTestimonial = 0;
  } else if (index < 0) {
    activeTestimonial = lastIndex;
  } else {
    activeTestimonial = index;
  }

  testimonialTrack.style.transform = 'translateX(-' + activeTestimonial * (cardWidth + gap) + 'px)';

  testimonialCards.forEach(function (card, cardIndex) {
    var isVisible = cardIndex >= activeTestimonial && cardIndex < activeTestimonial + cardsOnScreen;
    card.classList.toggle('active', isVisible);
    card.setAttribute('aria-hidden', !isVisible);
  });

  carouselDots.forEach(function (dot, dotIndex) {
    var isSelected = dotIndex === activeTestimonial;
    dot.classList.toggle('active', isSelected);
    dot.setAttribute('aria-pressed', isSelected);
    dot.hidden = dotIndex > lastIndex;
  });
}

themeToggle.setAttribute('aria-pressed', root.classList.contains('dark'));
setColor('#8b5cf6');
setFont('Tajawal');
showTestimonial(0);

themeToggle.addEventListener('click', function () {
  setTheme(!root.classList.contains('dark'));
});

colorButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    setColor(button.dataset.color);
  });
});

fontButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    setFont(button.dataset.font);
  });
});

document.querySelector('.settings-reset').addEventListener('click', function () {
  setTheme(true);
  setColor('#8b5cf6');
  setFont('Tajawal');
});

settingsOpen.addEventListener('click', function () { openSettings(true); });
settingsClose.addEventListener('click', function () { openSettings(false); });
settingsOverlay.addEventListener('click', function () { openSettings(false); });
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && settingsPanel.classList.contains('open')) {
    openSettings(false);
  }
});

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    var filter = button.dataset.filter;

    filterButtons.forEach(function (filterButton) {
      var isSelected = filterButton === button;
      filterButton.classList.toggle('active', isSelected);
      filterButton.setAttribute('aria-selected', isSelected);
    });

    projectItems.forEach(function (project) {
      var shouldHide = filter !== 'all' && project.dataset.category !== filter;
      project.classList.toggle('is-hidden', shouldHide);
    });
  });
});

document.querySelectorAll('.carousel-arrow').forEach(function (button) {
  button.addEventListener('click', function () {
    var change = button.dataset.slide === 'next' ? 1 : -1;
    showTestimonial(activeTestimonial + change);
  });
});

carouselDots.forEach(function (dot, index) {
  dot.addEventListener('click', function () {
    showTestimonial(index);
  });
});

window.addEventListener('resize', function () {
  showTestimonial(activeTestimonial);
});

window.addEventListener('scroll', function () {
  updateActiveNav();
  scrollTopButton.classList.toggle('visible', window.scrollY > 450);
}, { passive: true });

updateActiveNav();
scrollTopButton.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
