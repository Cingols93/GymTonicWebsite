/**
 * GymView - Manages the DOM elements, rendering updates, and visual transitions.
 */
export class GymView {
  constructor() {
    // Cache DOM Elements
    this.header = document.getElementById('header');
    this.navMenu = document.getElementById('nav-menu');
    this.navToggle = document.getElementById('nav-toggle');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section');
    
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.courseSlots = document.querySelectorAll('.course-slot');
    
    this.testimonialTrack = document.getElementById('testimonial-track');
    this.prevReviewBtn = document.getElementById('prev-review');
    this.nextReviewBtn = document.getElementById('next-review');
    
    this.contactForm = document.getElementById('contact-form');
    this.formFeedback = document.getElementById('form-feedback');
    this.formSubmitBtn = this.contactForm ? this.contactForm.querySelector('button[type="submit"]') : null;

    this.revealElements = document.querySelectorAll('.reveal');
  }

  // Bind Actions (forwarding UI events to Controller)
  bindScroll(handler) {
    window.addEventListener('scroll', () => {
      handler(window.scrollY);
    });
  }

  bindMobileMenuToggle(handler) {
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => {
        handler();
      });
    }
  }

  bindNavLinkClick(handler) {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Find href and scroll
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
        handler(targetId.substring(1));
      });
    });
  }

  bindScheduleTabClick(handler) {
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const day = btn.getAttribute('data-day');
        handler(day);
      });
    });
  }

  bindReviewControls(prevHandler, nextHandler) {
    if (this.prevReviewBtn) {
      this.prevReviewBtn.addEventListener('click', prevHandler);
    }
    if (this.nextReviewBtn) {
      this.nextReviewBtn.addEventListener('click', nextHandler);
    }
  }

  bindFormSubmit(handler) {
    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
          name: document.getElementById('name').value.trim(),
          surname: document.getElementById('surname').value.trim(),
          email: document.getElementById('email').value.trim(),
          phone: document.getElementById('phone').value.trim(),
          interest: document.getElementById('interest').value,
          privacy: document.getElementById('privacy').checked,
          message: document.getElementById('message').value.trim()
        };

        handler(formData);
      });
    }
  }

  // Render Methods
  renderHeaderScroll(scrolled) {
    if (scrolled) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  renderMobileMenu(open) {
    if (open) {
      this.navToggle.classList.add('active');
      this.navMenu.classList.add('active');
    } else {
      this.navToggle.classList.remove('active');
      this.navMenu.classList.remove('active');
    }
  }

  renderActiveSection(activeId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === activeId) {
        link.classList.add('active');
      }
    });
  }

  renderScheduleFilter(dayFilter) {
    // Update active tab style
    this.tabBtns.forEach(btn => {
      if (btn.getAttribute('data-day') === dayFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update slot visibilities
    this.courseSlots.forEach(slot => {
      const slotDays = slot.getAttribute('data-days');
      if (dayFilter === 'all') {
        slot.style.opacity = '1';
        slot.style.pointerEvents = 'auto';
      } else {
        if (slotDays.includes(dayFilter)) {
          slot.style.opacity = '1';
          slot.style.pointerEvents = 'auto';
        } else {
          slot.style.opacity = '0.15';
          slot.style.pointerEvents = 'none';
        }
      }
    });
  }

  renderReviewSlide(index) {
    if (this.testimonialTrack) {
      const amountToMove = index * 100;
      this.testimonialTrack.style.transform = `translateX(-${amountToMove}%)`;
    }
  }

  renderFormSubmission(submissionState) {
    const { status, message } = submissionState;
    if (!this.formFeedback) return;

    // Reset styles
    this.formFeedback.style.display = 'none';
    this.formFeedback.className = 'form-feedback';

    if (status === 'loading') {
      if (this.formSubmitBtn) {
        this.formSubmitBtn.disabled = true;
        this.formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Invio in corso...';
      }
    } else if (status === 'success') {
      if (this.formSubmitBtn) {
        this.formSubmitBtn.disabled = false;
        this.formSubmitBtn.innerHTML = 'Invia Richiesta';
      }
      this.formFeedback.textContent = message;
      this.formFeedback.classList.add('success');
      this.formFeedback.style.display = 'block';
      this.contactForm.reset();
      this.formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (status === 'error') {
      if (this.formSubmitBtn) {
        this.formSubmitBtn.disabled = false;
        this.formSubmitBtn.innerHTML = 'Invia Richiesta';
      }
      this.formFeedback.textContent = message;
      this.formFeedback.classList.add('error');
      this.formFeedback.style.display = 'block';
      this.formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Setup Observer for Scroll Reveals
  setupIntersectionObserver(sectionChangeHandler) {
    // 1. Scroll reveal animation observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    this.revealElements.forEach(element => {
      revealObserver.observe(element);
    });

    // 2. Active Section highlight observer
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionChangeHandler(entry.target.id);
        }
      });
    }, {
      threshold: 0.35,
      rootMargin: '-50px 0px -50px 0px'
    });

    this.sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }
}
