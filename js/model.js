/**
 * GymModel - Represents the application state and business logic.
 */
export class GymModel {
  constructor() {
    // Application States
    this._state = {
      mobileMenuOpen: false,
      headerScrolled: false,
      currentDayFilter: 'all',
      activeReviewIndex: 0,
      activeSectionId: 'home',
      formSubmission: {
        status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
        message: ''
      }
    };

    // Change listeners
    this._listeners = {};

    // Static Data
    this.testimonials = [
      {
        quote: "Frequento GymTonic da sei mesi e ho riscontrato risultati straordinari. I trainer sono super preparati e la sala pesi è sempre in perfetto ordine. Consiglio vivamente il corso di Pilates Reformer!",
        author: "Roberta F.",
        role: "Membro da 6 Mesi"
      },
      {
        quote: "Palestra fantastica, pulizia impeccabile e staff accogliente. Il parcheggio interno gratuito è un vantaggio enorme in questa zona di Roma. Rapporto qualità-prezzo imbattibile.",
        author: "Claudio V.",
        role: "Membro da 1 Anno"
      },
      {
        quote: "Il biologo nutrizionista di GymTonic mi ha aiutato a cambiare stile di vita abbinando la dieta all'allenamento funzionale. Ho perso 10kg sentendomi in forma come non mai. La migliore palestra a Roma!",
        author: "Andrea P.",
        role: "Membro da 8 Mesi"
      }
    ];
  }

  // Getters
  get state() {
    return this._state;
  }

  // Setters with notification
  setMobileMenuOpen(open) {
    if (this._state.mobileMenuOpen !== open) {
      this._state.mobileMenuOpen = open;
      this.trigger('mobileMenuOpen', open);
    }
  }

  setHeaderScrolled(scrolled) {
    if (this._state.headerScrolled !== scrolled) {
      this._state.headerScrolled = scrolled;
      this.trigger('headerScrolled', scrolled);
    }
  }

  setCurrentDayFilter(day) {
    if (this._state.currentDayFilter !== day) {
      this._state.currentDayFilter = day;
      this.trigger('currentDayFilter', day);
    }
  }

  setActiveReviewIndex(index) {
    const totalReviews = this.testimonials.length;
    // Bound the index correctly
    let normalizedIndex = index;
    if (index >= totalReviews) {
      normalizedIndex = 0;
    } else if (index < 0) {
      normalizedIndex = totalReviews - 1;
    }

    if (this._state.activeReviewIndex !== normalizedIndex) {
      this._state.activeReviewIndex = normalizedIndex;
      this.trigger('activeReviewIndex', normalizedIndex);
    }
  }

  setActiveSectionId(sectionId) {
    if (this._state.activeSectionId !== sectionId) {
      this._state.activeSectionId = sectionId;
      this.trigger('activeSectionId', sectionId);
    }
  }

  setFormSubmission(status, message = '') {
    this._state.formSubmission = { status, message };
    this.trigger('formSubmission', this._state.formSubmission);
  }

  // Observers Pattern
  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
  }

  trigger(event, data) {
    if (this._listeners[event]) {
      this._listeners[event].forEach(callback => callback(data));
    }
  }
}
