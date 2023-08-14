// MODAL

class Modal {
  constructor(selector, trigger, { timeout = 1 } = {}) {
    this.modal = document.querySelector(selector);
    this.modalTrigger = document.querySelectorAll(trigger);
    this.modalTimerId;
    this.modalTimeout = timeout;

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showThanksModal = this.showThanksModal.bind(this);
    this.showModalByScroll = this.showModalByScroll.bind(this);

    this.init();
  }

  showModal() {
    this.modal.classList.add('show', 'fade');
    this.modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    clearTimeout(this.modalTimerId);
  }

  hideModal() {
    this.modal.classList.add('hide');
    this.modal.classList.remove('show', 'fade');
    document.body.style.overflow = '';
  }

  showModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      this.showModal();
      window.removeEventListener('scroll', this.showModalByScroll);
    }
  }

  showThanksModal(text) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    const thanksModal = document.createElement('div');

    prevModalDialog.classList.add('hide');

    this.showModal();

    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-hide-modal="modal">&times;</div>
        <div class="modal__title">${text}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      this.hideModal();
    }, 4000);
  }

  init() {
    this.modalTrigger.forEach((trigger) => trigger.addEventListener('click', this.showModal));

    this.modal.addEventListener('click', (e) => {
      if (e.target && e.target === this.modal) this.hideModal();
      if (e.target && e.target.matches('[data-hide-modal]')) this.hideModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && this.modal.classList.contains('show')) this.hideModal();
    });

    window.addEventListener('scroll', this.showModalByScroll);

    this.modalTimerId = setTimeout(this.showModal, this.modalTimeout * 1000);
  }
}

export default Modal;
