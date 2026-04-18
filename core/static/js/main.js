/* ============================================
   Main JavaScript - Portfolio
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window;

    // ============================================
    // Custom Cursor (desktop only)
    // ============================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (!isMobile) {
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
        const hoverTargets = document.querySelectorAll('a, button, .btn, .project-preview, .contact-card, .info-card, .achievement-card, .hamburger, .expand-btn, .project-detail-btn');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });

        // Click animation
        document.addEventListener('mousedown', () => cursorOutline.classList.add('click'));
        document.addEventListener('mouseup', () => cursorOutline.classList.remove('click'));
    }

    // ============================================
    // Cursor Trail (desktop only)
    // ============================================
    if (!isMobile) {
        const trailCanvas = document.getElementById('trailCanvas');
        const trailCtx = trailCanvas.getContext('2d');
        let trails = [];

        function resizeTrail() {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        }
        resizeTrail();
        window.addEventListener('resize', resizeTrail);

        document.addEventListener('mousemove', (e) => {
            trails.push({
                x: e.clientX,
                y: e.clientY,
                life: 1,
                size: Math.random() * 3 + 1,
                color: Math.random() > 0.5 ? '108, 99, 255' : '0, 212, 255'
            });
            if (trails.length > 50) trails.shift();
        });

        function animateTrail() {
            trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            trails.forEach((t, i) => {
                t.life -= 0.025;
                if (t.life <= 0) {
                    trails.splice(i, 1);
                    return;
                }
                trailCtx.beginPath();
                trailCtx.arc(t.x, t.y, t.size * t.life, 0, Math.PI * 2);
                trailCtx.fillStyle = `rgba(${t.color}, ${t.life * 0.5})`;
                trailCtx.fill();
            });
            requestAnimationFrame(animateTrail);
        }
        animateTrail();
    }

    // ============================================
    // Click Ripple Effect (both mobile and desktop)
    // ============================================
    const rippleContainer = document.getElementById('rippleContainer');

    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.classList.add('click-ripple');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        rippleContainer.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    document.addEventListener('click', (e) => createRipple(e.clientX, e.clientY));
    if (isTouch) {
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            createRipple(touch.clientX, touch.clientY);
        }, { passive: true });
    }

    // ============================================
    // Glow Card - Mouse Follow Effect (desktop)
    // ============================================
    if (!isMobile) {
        const glowCards = document.querySelectorAll('.glow-card');
        glowCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--glow-x', x + 'px');
                card.style.setProperty('--glow-y', y + 'px');
            });
        });
    }

    // ============================================
    // Particle Background
    // ============================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

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
        const count = isMobile
            ? Math.min(30, Math.floor((canvas.width * canvas.height) / 25000))
            : Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
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

    // Mouse interaction with particles (desktop)
    let particleMouseX = -1000, particleMouseY = -1000;
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            particleMouseX = e.clientX;
            particleMouseY = e.clientY;
        });
    }

    function drawMouseConnections() {
        if (isMobile) return;
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
        requestAnimationFrame(animateParticles);
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

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

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
        if (target === 0) return;
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
    // Expandable Experience Lists
    // ============================================
    const expandBtns = document.querySelectorAll('.expand-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.exp-card');
            const list = card.querySelector('.expandable-list');
            const isExpanded = btn.getAttribute('data-expanded') === 'true';

            if (isExpanded) {
                list.classList.remove('expanded');
                btn.setAttribute('data-expanded', 'false');
                const hiddenCount = list.querySelectorAll('.detail-hidden').length;
                btn.querySelector('.expand-text').textContent = `Show ${hiddenCount} more`;
            } else {
                list.classList.add('expanded');
                btn.setAttribute('data-expanded', 'true');
                btn.querySelector('.expand-text').textContent = 'Show less';
            }
        });
    });

    // ============================================
    // Experience Card Typing Animation
    // ============================================
    function typeIntoEl(el, text, speed, onDone) {
        el.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'card-typed-cursor';
        el.appendChild(cursor);
        let i = 0;
        function next() {
            if (i < text.length) {
                cursor.insertAdjacentText('beforebegin', text[i]);
                i++;
                setTimeout(next, speed + Math.random() * (speed * 0.6));
            } else {
                cursor.remove();
                if (onDone) onDone();
            }
        }
        next();
    }

    const timelineCards = document.querySelectorAll('.exp-card');
    const cardTypingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const item = entry.target;
            if (item.dataset.typed) return;
            item.dataset.typed = 'true';
            cardTypingObserver.unobserve(item);

            const nameEl = item.querySelector('.exp-company-name');
            const roleEl = item.querySelector('.exp-role');
            const nameText = nameEl ? nameEl.textContent.trim() : '';
            const roleText = roleEl ? roleEl.textContent.trim() : '';

            // Small delay after card reveal animation starts
            setTimeout(() => {
                if (nameEl) {
                    typeIntoEl(nameEl, nameText, 55, () => {
                        if (roleEl) typeIntoEl(roleEl, roleText, 38);
                    });
                }
            }, 300);
        });
    }, { threshold: 0.35 });

    timelineCards.forEach(card => cardTypingObserver.observe(card));

    // ============================================
    // Project Modals
    // ============================================
    const detailBtns = document.querySelectorAll('.project-detail-btn');
    const modals = document.querySelectorAll('.project-modal');

    detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    modals.forEach(modal => {
        const close = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');

        if (close) {
            close.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

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
    if (!isMobile) {
        const tiltCards = document.querySelectorAll('.project-preview');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ============================================
    // Magnetic Effect on Buttons (desktop only)
    // ============================================
    if (!isMobile) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ============================================
    // Parallax on scroll for sections (subtle)
    // ============================================
    if (!isMobile) {
        const parallaxSections = document.querySelectorAll('.section-title');
        window.addEventListener('scroll', () => {
            parallaxSections.forEach(el => {
                const rect = el.getBoundingClientRect();
                const scrollPercent = rect.top / window.innerHeight;
                el.style.transform = `translateX(${scrollPercent * 15}px)`;
            });
        });
    }

    // ============================================
    // Mobile Touch Feedback - Vibration (if supported)
    // ============================================
    if (isTouch) {
        const touchTargets = document.querySelectorAll('.btn, .expand-btn, .project-detail-btn, .contact-card, .achievement-card');
        touchTargets.forEach(el => {
            el.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: true });
        });
    }

    // ============================================
    // Scroll Progress Indicator (sidebar)
    // ============================================
    const sidebarProgress = document.getElementById('sidebarProgress');
    if (sidebarProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
            sidebarProgress.style.height = scrollPercent + '%';
            sidebarProgress.style.maxHeight = '60px';
        });
    }

    // ============================================
    // AI Chat Widget
    // ============================================
    const chatToggle = document.getElementById('chatToggle');
    const chatPanel = document.getElementById('chatPanel');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (chatToggle && chatPanel) {
        chatToggle.addEventListener('click', () => {
            chatPanel.classList.toggle('open');
            if (chatPanel.classList.contains('open')) {
                chatInput.focus();
            }
        });

        chatClose.addEventListener('click', () => {
            chatPanel.classList.remove('open');
        });

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            appendMessage(message, 'user');
            chatInput.value = '';

            // Show typing indicator
            const typingEl = appendTyping();

            try {
                const response = await fetch('/api/chat/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message }),
                });

                const data = await response.json();
                typingEl.remove();

                if (data.reply) {
                    appendMessage(data.reply, 'bot');
                } else {
                    appendMessage('Sorry, I couldn\'t process that. Try again!', 'bot');
                }
            } catch (err) {
                typingEl.remove();
                appendMessage('Connection error. Please try again.', 'bot');
            }
        });

        function appendMessage(text, type) {
            const msg = document.createElement('div');
            msg.className = `chat-msg ${type}`;
            msg.innerHTML = `<span>${escapeHtml(text)}</span>`;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return msg;
        }

        function appendTyping() {
            const msg = document.createElement('div');
            msg.className = 'chat-msg bot typing';
            msg.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return msg;
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }

});
