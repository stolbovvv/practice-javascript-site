/* Global */

window.addEventListener('DOMContentLoaded', () => {
  // TABS
  const tabsTriggerWrapper = document.querySelector('.tabheader__items');
  const tabsTriggerItems = document.querySelectorAll('.tabheader__item');
  const tabsContentItems = document.querySelectorAll('.tabcontent');

  function hideTabContent() {
    tabsContentItems.forEach((item) => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabsTriggerItems.forEach((item) => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContentItems[i].classList.add('show', 'fade');
    tabsContentItems[i].classList.remove('hide');
    tabsTriggerItems[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsTriggerWrapper.addEventListener('click', (e) => {
    if (e.target && e.target.matches('.tabheader__item')) {
      tabsTriggerItems.forEach((item, index) => {
        if (e.target === item) {
          hideTabContent();
          showTabContent(index);
        }
      });
    }
  });

  // TIMER
  const deadline = '2023-09-01T00:00:00';

  function getTimeRemaning(endtime) {
    const timeDifference = new Date(endtime) - new Date();
    const days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
    const hours = Math.floor((timeDifference / 1000 / 60 / 60) % 24);
    const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    return { days, hours, minutes, seconds, timeDifference };
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector);
    const days = timer.querySelector('#days');
    const hours = timer.querySelector('#hours');
    const minutes = timer.querySelector('#minutes');
    const seconds = timer.querySelector('#seconds');

    let timeInterval;

    function correctTimeTtem(time) {
      if (time < 10) return `0${time}`;

      return time;
    }

    function updateClock() {
      const timeData = getTimeRemaning(endtime);

      days.textContent = correctTimeTtem(timeData.days);
      hours.textContent = correctTimeTtem(timeData.hours);
      minutes.textContent = correctTimeTtem(timeData.minutes);
      seconds.textContent = correctTimeTtem(timeData.seconds);

      if (timeData.timeDifference <= 0) {
        clearInterval(timeInterval);

        days.textContent = '0';
        hours.textContent = '00';
        minutes.textContent = '00';
        seconds.textContent = '00';
      }
    }

    updateClock();

    timeInterval = setInterval(updateClock, 1000);
  }

  setClock('.timer', deadline);

  // MODAL
  const modal = document.querySelector('.modal');
  const modalTriggerShow = document.querySelectorAll('[data-show-modal]');

  let modalTimerId;

  function showModal() {
    modal.classList.add('show', 'fade');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    clearTimeout(modalTimerId);
  }

  function showModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      showModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  function showThanksModal(text) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    const thanksModal = document.createElement('div');

    prevModalDialog.classList.add('hide');

    showModal();

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
      hideModal();
    }, 4000);
  }

  function hideModal() {
    modal.classList.add('hide');
    modal.classList.remove('show', 'fade');
    document.body.style.overflow = '';
  }

  modalTriggerShow.forEach((trigger) => {
    trigger.addEventListener('click', showModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target && e.target === modal) hideModal();
    if (e.target && e.target.matches('[data-hide-modal]')) hideModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) hideModal();
  });

  window.addEventListener('scroll', showModalByScroll);

  modalTimerId = setTimeout(showModal, 60000);

  // CLASS
  class MenuCard {
    constructor({ src, alt, title, descr, price, parentSelector, classes = [] }) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.element = document.createElement('div');
      this.classes = classes;
      this.transfer = 95;

      this.converToRUB();
    }

    converToRUB() {
      this.price = this.price * this.transfer;
    }

    render() {
      this.element.classList.add('menu__item');

      this.classes.forEach((className) => this.element.classList.add(className));

      this.element.innerHTML = `
        <img src="${this.src}" alt="${this.alt}" />
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
        </div>
      `;

      this.parent.append(this.element);
    }
  }

  const getData = async (url) => {
    const res = await fetch(url, {});

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getData('http://localhost:3000/menu').then((data) => {
    data.forEach((item) => {
      new MenuCard({ ...item, parentSelector: '.menu .container' }).render();
    });
  });

  // FORM
  const forms = document.querySelectorAll('form');

  const messages = {
    loading: './icons/spinner.svg',
    succses: 'Спаибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...',
  };

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: data,
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      const jsonData = Object.fromEntries(new FormData(form).entries());

      statusMessage.src = messages.loading;
      statusMessage.style.display = 'block';
      statusMessage.style.margin = '10px auto -28px auto';

      form.insertAdjacentElement('afterend', statusMessage);

      postData('http://localhost:3000/requests', JSON.stringify(jsonData))
        .then(() => showThanksModal(messages.succses))
        .catch(() => showThanksModal(messages.failure))
        .finally(() => {
          statusMessage.remove();
          form.reset();
        });
    });
  }

  forms.forEach((form) => bindPostData(form));
});
