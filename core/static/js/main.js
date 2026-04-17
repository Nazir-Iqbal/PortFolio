/* ============================================
   Main JavaScript - Portfolio
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // Custom Cursor
    // ============================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .project-card, .contact-card, .info-card, .achievement-card, .hamburger');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });

    // ============================================
    // Particle Background
    // ============================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

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
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Mouse interaction with particles
    let particleMouseX = 0, particleMouseY = 0;
    document.addEventListener('mousemove', (e) => {
        particleMouseX = e.clientX;
        particleMouseY = e.clientY;
    });

    function drawMouseConnections() {
        particles.forEach(p => {
            const dx = particleMouseX - p.x;
            const dy = particleMouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const opacity = (1 - dist / 200) * 0.3;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particleMouseX, particleMouseY);
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        drawMouseConnections();
        animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ============================================
    // Navigation
    // ============================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Scrolled state
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinkItems.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // Typing Effect
    // ============================================
    const typedName = document.getElementById('typedName');
    const fullName = 'Nazir Iqbal';
    let charIndex = 0;

    function typeChar() {
        if (charIndex < fullName.length) {
            typedName.textContent += fullName[charIndex];
            charIndex++;
            setTimeout(typeChar, 100 + Math.random() * 80);
        }
    }
    setTimeout(typeChar, 800);

    // ============================================
    // Scroll Reveal
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================
    // Counter Animation
    // ============================================
    function animateCounter(el, target, duration = 2000) {
        let start = 0;
        const step = target / (duration / 16);
        function count() {
            start += step;
            if (start >= target) {
                el.textContent = target;
                return;
            }
            el.textContent = Math.floor(start);
            requestAnimationFrame(count);
        }
        count();
    }

    // Hero stats counters
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statsObserver.observe(el));

    // Achievement rating counters
    const ratingNumbers = document.querySelectorAll('.rating-number');
    const ratingsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target, 2500);
                ratingsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    ratingNumbers.forEach(el => ratingsObserver.observe(el));

    // ============================================
    // Skill Bars Animation
    // ============================================
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillItems.forEach(el => skillObserver.observe(el));

    // ============================================
    // Smooth scroll for anchor links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // Tilt Effect on Project Cards (desktop only)
    // ============================================
    if (window.innerWidth > 768) {
        const tiltCards = document.querySelectorAll('[data-tilt]');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // ============================================
    // Magnetic Effect on Buttons
    // ============================================
    if (window.innerWidth > 768) {
        const magneticBtns = document.querySelectorAll('.btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

});
