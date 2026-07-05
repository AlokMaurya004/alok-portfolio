/* ============================================
   Alok Maurya — Cloud-Native Portfolio
   Interactive JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Mobile menu ---
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuBtn.classList.remove('active');
    });
  });

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    header.classList.toggle('scrolled', scrolled);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const observerNav = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinkEls.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(section => observerNav.observe(section));

  // --- Scroll reveal ---
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // --- Typing effect ---
  const roles = [
    'Cloud-Native Developer',
    'Docker Enthusiast',
    'Full-Stack Engineer',
    'DevOps Learner'
  ];
  const typedEl = document.getElementById('typedText');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const current = roles[roleIndex];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();

  // --- Counter animation ---
  const statNums = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    statNums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }

      requestAnimationFrame(update);
    });
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // --- Skill bar animation ---
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = `${width}%`;
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => skillObserver.observe(bar));

  // --- Terminal animation ---
  const terminalBody = document.getElementById('terminalBody');
  const terminalLines = [
    { type: 'cmd', text: 'docker compose up -d' },
    { type: 'output', text: '[+] Running 1/1' },
    { type: 'success', text: ' ✔ Container portfolio-web  Started' },
    { type: 'output', text: '' },
    { type: 'cmd', text: 'docker ps' },
    { type: 'output', text: 'CONTAINER ID   IMAGE              STATUS         PORTS' },
    { type: 'info', text: 'a1b2c3d4e5f6   alok-portfolio     Up 2 seconds   0.0.0.0:8080->80/tcp' },
    { type: 'output', text: '' },
    { type: 'cmd', text: 'curl -s -o /dev/null -w "%{http_code}" localhost:8080' },
    { type: 'success', text: '200' },
    { type: 'output', text: '' },
    { type: 'success', text: '✔ Portfolio deployed successfully!' }
  ];

  let lineIndex = 0;
  let terminalStarted = false;

  function addTerminalLine(line) {
    const div = document.createElement('div');
    div.className = 'terminal-line';

    if (line.type === 'cmd') {
      div.innerHTML = `<span class="prompt">$</span> ${line.text}`;
    } else if (line.type === 'success') {
      div.className = 'terminal-line terminal-success';
      div.textContent = line.text;
    } else if (line.type === 'info') {
      div.className = 'terminal-line terminal-info';
      div.textContent = line.text;
    } else {
      div.className = 'terminal-line terminal-output';
      div.textContent = line.text || '\u00A0';
    }

    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function runTerminal() {
    if (lineIndex >= terminalLines.length) {
      setTimeout(() => {
        terminalBody.innerHTML = '<div class="terminal-line"><span class="prompt">$</span> docker compose up -d</div>';
        lineIndex = 0;
        setTimeout(runTerminal, 1000);
      }, 4000);
      return;
    }

    addTerminalLine(terminalLines[lineIndex]);
    lineIndex++;

    const delay = terminalLines[lineIndex - 1].type === 'cmd' ? 600 : 300;
    setTimeout(runTerminal, delay);
  }

  const terminalObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && !terminalStarted) {
        terminalStarted = true;
        setTimeout(runTerminal, 800);
      }
    },
    { threshold: 0.3 }
  );

  if (terminalBody) {
    terminalObserver.observe(terminalBody.closest('.hero-terminal'));
  }
})();
