// ===== FLUID CANVAS BACKGROUND =====
(function() {
  const canvas = document.getElementById('fluidCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  let mouse = { x: 0, y: 0 };
  let time = 0;

  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  });

  // Fluid gradient blobs
  class Blob {
    constructor(x, y, radius, color, speed) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.radius = radius;
      this.color = color;
      this.speed = speed;
      this.offset = Math.random() * Math.PI * 2;
    }

    update(t, mx, my) {
      this.x = this.baseX + Math.sin(t * this.speed + this.offset) * w * 0.15
             + (mx - 0.5) * w * 0.08;
      this.y = this.baseY + Math.cos(t * this.speed * 0.7 + this.offset) * h * 0.12
             + (my - 0.5) * h * 0.06;
    }

    draw(ctx) {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }

  const blobs = [
    new Blob(w * 0.3, h * 0.3, Math.max(w, h) * 0.35, 'rgba(200, 169, 110, 0.08)', 0.3),
    new Blob(w * 0.7, h * 0.6, Math.max(w, h) * 0.3, 'rgba(26, 29, 94, 0.15)', 0.25),
    new Blob(w * 0.5, h * 0.8, Math.max(w, h) * 0.28, 'rgba(200, 169, 110, 0.05)', 0.35),
    new Blob(w * 0.2, h * 0.7, Math.max(w, h) * 0.25, 'rgba(100, 120, 200, 0.06)', 0.2),
    new Blob(w * 0.8, h * 0.2, Math.max(w, h) * 0.3, 'rgba(200, 169, 110, 0.04)', 0.15),
  ];

  function animate() {
    time += 0.008;
    ctx.clearRect(0, 0, w, h);

    blobs.forEach(blob => {
      blob.update(time, mouse.x, mouse.y);
      blob.draw(ctx);
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Recalculate blob positions on resize
  window.addEventListener('resize', () => {
    blobs[0].baseX = w * 0.3; blobs[0].baseY = h * 0.3;
    blobs[1].baseX = w * 0.7; blobs[1].baseY = h * 0.6;
    blobs[2].baseX = w * 0.5; blobs[2].baseY = h * 0.8;
    blobs[3].baseX = w * 0.2; blobs[3].baseY = h * 0.7;
    blobs[4].baseX = w * 0.8; blobs[4].baseY = h * 0.2;
    blobs.forEach(b => { b.radius = Math.max(w, h) * (0.25 + Math.random() * 0.1); });
  });
})();

// ===== SMART APP OPEN =====
function openApp(e) {
  e.preventDefault();
  const ua = navigator.userAgent || navigator.vendor;

  if (/android/i.test(ua)) {
    // Try deep link first, fallback to Play Store
    window.location.href = 'intent://barbeariacarmo.bestbarbers.app#Intent;scheme=https;package=barbeariacarmo.bestbarbers.app;end';
    setTimeout(() => {
      window.open('https://play.google.com/store/apps/details?id=barbeariacarmo.bestbarbers.app', '_blank');
    }, 800);
  } else if (/iPad|iPhone|iPod/.test(ua)) {
    window.open('https://apps.apple.com/br/app/barbearia-carmo/id6744528195', '_blank');
  } else {
    // Desktop fallback — scroll to services section with app downloads
    document.getElementById('servicos').scrollIntoView({ behavior: 'smooth' });
  }
}

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.navbar-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ===== INTERSECTION OBSERVER — fluid staggered reveals =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===== TODAY HIGHLIGHT =====
function highlightToday() {
  const today = new Date().getDay();
  document.querySelectorAll('.hours-row').forEach(row => {
    if (parseInt(row.dataset.day) === today) {
      row.classList.add('today');
      const daySpan = row.querySelector('.hours-day');
      const badge = document.createElement('span');
      badge.style.cssText = `
        font-size: 0.6rem;
        color: var(--accent);
        font-weight: 600;
        letter-spacing: 0.12em;
        margin-left: 8px;
        text-transform: uppercase;
      `;
      badge.textContent = 'HOJE';
      daySpan.appendChild(badge);
    }
  });
}
highlightToday();

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.getAttribute('href') === '#') return;
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  });
});

// ===== GALLERY — smooth cursor tracking =====
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
    item.querySelector('img').style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.querySelector('img').style.transform = '';
  });
});

// ===== MAGNETIC EFFECT on CTA buttons =====
document.querySelectorAll('.btn, .app-btn, .instagram-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    if (counter.dataset.animated) return;
    counter.dataset.animated = 'true';

    const target = counter.textContent;
    const num = parseInt(target);
    if (isNaN(num)) return;

    const suffix = target.replace(/[0-9]/g, '');
    let current = 0;
    const step = num / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= num) {
        counter.textContent = target;
        clearInterval(interval);
      } else {
        counter.textContent = Math.floor(current) + suffix;
      }
    }, 35);

    counterObserver.unobserve(counter);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ===== PAGE LOAD FADE =====
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

// ===== REVIEW MODAL =====
(function() {
  const modal = document.getElementById('reviewModal');
  const stars = document.querySelectorAll('#modalStars .star-select');
  const starLabel = document.getElementById('starLabel');

  if (!modal) return;

  const labels = ['', 'Ruim', 'Regular', 'Bom', 'Muito Bom', 'Excelente'];
  let selectedRating = 0;

  // Star hover & click
  stars.forEach(star => {
    const val = parseInt(star.dataset.star);

    star.addEventListener('mouseenter', () => {
      stars.forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.star) <= val);
      });
      starLabel.textContent = labels[val];
    });

    star.addEventListener('click', () => {
      selectedRating = val;
      stars.forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.star) <= val);
      });
      starLabel.textContent = labels[val];
    });
  });

  document.getElementById('modalStars').addEventListener('mouseleave', () => {
    stars.forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.star) <= selectedRating);
    });
    starLabel.textContent = selectedRating ? labels[selectedRating] : 'Toque nas estrelas para avaliar';
  });

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });

  // Reset on close
  const observer = new MutationObserver(() => {
    if (!modal.classList.contains('open')) {
      setTimeout(() => {
        selectedRating = 0;
        stars.forEach(s => s.classList.remove('active'));
        starLabel.textContent = 'Toque nas estrelas para avaliar';
      }, 500);
    }
  });
  observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
})();

