/* Global */
import Tabs from './modules/Tabs.js';
import Calc from './modules/Calc.js';
import Form from './modules/Forms.js';
import Timer from './modules/Timer.js';
import Modal from './modules/modal.js';
import Slider from './modules/Slider.js';
import MenuCard from './modules/Cards.js';
import { getData } from './utilities/index.js';

window.addEventListener('DOMContentLoaded', () => {
  const modal = new Modal('.modal', '[data-show-modal]', { timeout: 50 });

  new Tabs({
    triggerWrapper: '.tabheader__items',
    triggerItems: '.tabheader__item',
    triggerItemsActiveClass: 'tabheader__item_active',
    contentItems: '.tabcontent',
  });

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

  new Timer('.timer', '2023-09-01T00:00:00');
  new Calc();

  document.querySelectorAll('form').forEach((form) => new Form(form, modal.showThanksModal));

  getData('http://localhost:3000/menu').then((data) => {
    data.forEach((item) => {
      new MenuCard({ ...item, parentSelector: '.menu .container' }).render();
    });
  });
});
