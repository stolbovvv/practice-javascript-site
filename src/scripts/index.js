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

  // SLIDER
  class Slider {
    constructor(
      element,
      {
        wrapper = '.slider__wrapper',
        slides = '.slider__slide',
        track = '.slider__track',
        prev = '.sldier__button-prev',
        next = '.slider__button-next',
        total = '.slider__total',
        current = '.slider__current',
        paginationClass = 'slider__pagination',
        paginationDotClass = 'slider__pagination-dot',
      } = {},
    ) {
      this.slider = typeof element === 'string' ? document.querySelector(element) : element;

      if (this.slider) {
        this.wrapper = typeof wrapper === 'string' ? this.slider.querySelector(wrapper) : wrapper;
        this.slides = typeof slides === 'string' ? this.slider.querySelectorAll(slides) : slides;
        this.track = typeof track === 'string' ? this.slider.querySelector(track) : track;
        this.prev = typeof prev === 'string' ? this.slider.querySelector(prev) : prev;
        this.next = typeof next === 'string' ? this.slider.querySelector(next) : next;
        this.dots = [];
        this.pagination = null;
        this.total = typeof prev === 'string' ? this.slider.querySelector(total) : total;
        this.current = typeof next === 'string' ? this.slider.querySelector(current) : current;

        this.paginationClass = paginationClass;
        this.paginationDotClass = paginationDotClass;

        this.slideIndex = 0;
        this.trackOffset = 0;
        this.wrapperWidth = this.wrapper.offsetWidth;

        this.init();

        this.createPagination = this.createPagination.bind(this);
      }
    }

    setInitailStyles() {
      this.slider.style['position'] = 'relative';
      this.wrapper.style['overflow'] = 'hidden';
      this.track.style['width'] = `${this.wrapperWidth * this.slides.length}px`;
      this.track.style['display'] = 'flex';
      this.track.style['transition'] = 'all 0.5s ease 0s';

      this.slides.forEach((slide) => {
        slide.style['width'] = `${this.wrapperWidth}px`;
      });
    }

    setInitialInfo() {
      this.total.innerText = (this.slides.length < 10 ? '0' : '') + this.slides.length;
      this.current.innerText = (this.slides.length < 10 ? '0' : '') + (this.slideIndex + 1);
    }

    createPagination() {
      this.pagination = document.createElement('ol');

      this.pagination.classList.add(this.paginationClass);

      for (let i = 0; i < this.slides.length; i++) {
        const dot = document.createElement('li');

        dot.classList.add(this.paginationDotClass);
        dot.dataset.slideTo = i;

        if (i === 0) dot.style['opacity'] = 1;

        this.pagination.append(dot);
        this.dots.push(dot);
      }

      this.slider.append(this.pagination);
    }

    changeDot(index) {
      this.dots.forEach((dot, i) => {
        if (i === index) {
          dot.style.opacity = 1;
        } else {
          dot.style.opacity = 0.5;
        }
      });
    }

    changeInfo(index) {
      this.current.innerText = (this.slides.length < 10 ? '0' : '') + (index + 1);
    }

    changeSlide(index) {
      this.track.style['transform'] = `translateX(-${this.wrapperWidth * index}px)`;
    }

    init() {
      this.setInitailStyles();
      this.setInitialInfo();
      this.createPagination();

      this.next.addEventListener('click', () => {
        if (this.slideIndex === this.slides.length - 1) {
          this.slideIndex = 0;
        } else {
          this.slideIndex += 1;
        }

        this.changeDot(this.slideIndex);
        this.changeInfo(this.slideIndex);
        this.changeSlide(this.slideIndex);
      });

      this.prev.addEventListener('click', () => {
        if (this.slideIndex === 0) {
          this.slideIndex = this.slides.length - 1;
        } else {
          this.slideIndex -= 1;
        }

        this.changeDot(this.slideIndex);
        this.changeInfo(this.slideIndex);
        this.changeSlide(this.slideIndex);
      });

      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.slideIndex = index;

          this.changeDot(this.slideIndex);
          this.changeInfo(this.slideIndex);
          this.changeSlide(this.slideIndex);
        });
      });
    }
  }

  new Slider('.offer__slider', {
    wrapper: '.offer__slider-wrapper',
    slides: '.offer__slide',
    track: '.offer__slider-inner',
    prev: '.offer__slider-prev',
    next: '.offer__slider-next',
    total: '#total',
    current: '#current',
    paginationClass: 'carousel-indicators',
    paginationDotClass: 'dot',
  });

  // CALC
  const result = document.querySelector('.calculating__result span');

  let sex = localStorage.getItem('calc-sex') || 'female';
  let age;
  let ratio = localStorage.getItem('calc-ratio') || 1.375;
  let weight;
  let height;

  if (localStorage.getItem('calc-sex')) {
    sex = localStorage.getItem('calc-sex');
  } else {
    sex = 'female';
    localStorage.setItem('calc-sex', 'female');
  }

  if (localStorage.getItem('calc-ratio')) {
    ratio = localStorage.getItem('calc-ratio');
  } else {
    ratio = 1.375;
    localStorage.setItem('calc-ratio', 1.375);
  }

  function calcTotal() {
    if (!sex || !age || !ratio || !weight || !height) {
      result.textContent = '_____';
      return;
    }

    if (sex === 'female') {
      result.textContent = Math.round((447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio);
    }

    if (sex === 'male') {
      result.textContent = Math.round((88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio);
    }
  }

  function initLoacalSetting(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((elem) => {
      elem.classList.remove(activeClass);

      if (elem.dataset.calcRatio === localStorage.getItem('calc-ratio')) elem.classList.add(activeClass);
      if (elem.dataset.calcGender === localStorage.getItem('calc-sex')) elem.classList.add(activeClass);
    });
  }

  function getStaticInformation(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        if (e.target.dataset.calcRatio) {
          ratio = +e.target.dataset.calcRatio;
          localStorage.setItem('calc-ratio', +e.target.dataset.calcRatio);
        }
        if (e.target.dataset.calcGender) {
          sex = e.target.dataset.calcGender;
          localStorage.setItem('calc-sex', e.target.dataset.calcGender);
        }

        elements.forEach((elem) => {
          if (elem === e.target) {
            elem.classList.add(activeClass);
          } else {
            elem.classList.remove(activeClass);
          }
        });

        calcTotal();
      });
    });
  }

  function getDynamicInformation(selector) {
    const input = document.querySelector(selector);

    input.addEventListener('input', () => {
      if (input.value.match(/\D/g)) {
        input.style.border = '1px solid red';
      } else {
        input.style.border = 'none';
      }

      switch (input.getAttribute('id')) {
        case 'age':
          age = +input.value;
          break;

        case 'weight':
          weight = +input.value;
          break;

        case 'height':
          height = +input.value;
          break;
      }

      calcTotal();
    });
  }

  initLoacalSetting('.calculating__choose#gender div', 'calculating__choose-item_active');
  initLoacalSetting('.calculating__choose.calculating__choose_big div', 'calculating__choose-item_active');
  getStaticInformation('.calculating__choose#gender div', 'calculating__choose-item_active');
  getStaticInformation('.calculating__choose.calculating__choose_big div', 'calculating__choose-item_active');
  getDynamicInformation('#age');
  getDynamicInformation('#weight');
  getDynamicInformation('#height');
  calcTotal();
});
