/**
 * GymController - Connects GymModel and GymView and orchestrates operations.
 */
export class GymController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    // 1. Subscribe to Model changes
    this.model.on('headerScrolled', (scrolled) => this.view.renderHeaderScroll(scrolled));
    this.model.on('mobileMenuOpen', (open) => this.view.renderMobileMenu(open));
    this.model.on('activeSectionId', (id) => this.view.renderActiveSection(id));
    this.model.on('currentDayFilter', (day) => this.view.renderScheduleFilter(day));
    this.model.on('activeReviewIndex', (index) => this.view.renderReviewSlide(index));
    this.model.on('formSubmission', (state) => this.view.renderFormSubmission(state));

    // 2. Bind View actions to Controller handlers
    this.view.bindScroll((scrollY) => {
      this.model.setHeaderScrolled(scrollY > 50);
    });

    this.view.bindMobileMenuToggle(() => {
      const currentOpen = this.model.state.mobileMenuOpen;
      this.model.setMobileMenuOpen(!currentOpen);
    });

    this.view.bindNavLinkClick((sectionId) => {
      this.model.setActiveSectionId(sectionId);
      this.model.setMobileMenuOpen(false); // Auto close drawer
    });

    this.view.bindScheduleTabClick((day) => {
      this.model.setCurrentDayFilter(day);
    });

    this.view.bindReviewControls(
      () => this.handlePrevReview(),
      () => this.handleNextReview()
    );

    this.view.bindFormSubmit((formData) => {
      this.handleFormSubmit(formData);
    });

    // 3. Setup Intersection Observers
    this.view.setupIntersectionObserver((sectionId) => {
      this.model.setActiveSectionId(sectionId);
    });

    // 4. Start Reviews Autoplay
    this.startReviewAutoplay();
  }

  // Review slide manual navigation handlers
  handlePrevReview() {
    this.resetReviewAutoplay();
    const currentIndex = this.model.state.activeReviewIndex;
    this.model.setActiveReviewIndex(currentIndex - 1);
  }

  handleNextReview() {
    this.resetReviewAutoplay();
    const currentIndex = this.model.state.activeReviewIndex;
    this.model.setActiveReviewIndex(currentIndex + 1);
  }

  // Reviews Autoplay Management
  startReviewAutoplay() {
    this.autoPlayInterval = setInterval(() => {
      const currentIndex = this.model.state.activeReviewIndex;
      this.model.setActiveReviewIndex(currentIndex + 1);
    }, 6000);
  }

  resetReviewAutoplay() {
    clearInterval(this.autoPlayInterval);
    this.startReviewAutoplay();
  }

  // Contact Form Submission Handler
  handleFormSubmit(formData) {
    const { name, surname, email, phone, interest, privacy } = formData;

    // Validation
    if (!name || !surname || !email || !phone || !interest || !privacy) {
      this.model.setFormSubmission('error', 'Per favore, compila tutti i campi obbligatori (*) e accetta l\'informativa sulla privacy.');
      return;
    }

    if (!this.validateEmail(email)) {
      this.model.setFormSubmission('error', 'Inserisci un indirizzo email valido.');
      return;
    }

    // Submit animation simulation
    this.model.setFormSubmission('loading');

    setTimeout(() => {
      // Fake success outcome
      this.model.setFormSubmission(
        'success',
        `Grazie ${name}! La tua richiesta è stata inviata con successo. Un consulente GymTonic ti contatterà al più presto.`
      );
    }, 1500);
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
