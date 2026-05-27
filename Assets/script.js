/**
 * script.js - HenryFlow Refined Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    // Add class to body to enable animations that require JS
    document.body.classList.add('js-enabled');

    // --- Custom Cursor Implementation ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorGlow = document.getElementById('cursor-glow');

    if (cursorDot && cursorGlow) {
        document.body.classList.add('cursor-active');

        let mouseX = 0;
        let mouseY = 0;
        let dotX = 0;
        let dotY = 0;
        let glowX = 0;
        let glowY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;

            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            cursorGlow.style.transform = `translate(${glowX - 20}px, ${glowY - 20}px)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor scaling on interaction
        const interactives = document.querySelectorAll('a, button, .product-card, .stat-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.transform += ' scale(1.4)';
                cursorGlow.style.boxShadow = '0 0 25px var(--primary-electric)';
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.boxShadow = '0 0 15px var(--primary-glow)';
            });
        });
    }

    // --- Reveal on Scroll Animation ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- Magnetic Button Effect ---
    const buttons = document.querySelectorAll('.nav-button, .submit-button');
    buttons.forEach(btn => {
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

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const submitButton = contactForm.querySelector('.submit-button');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully. Thank you!';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    throw new Error('Submission failed.');
                }
            } catch (error) {
                formStatus.textContent = 'Sorry, the message could not be sent. Please try again later.';
                formStatus.classList.add('error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            }
        });
    }
});
