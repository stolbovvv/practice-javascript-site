// TABS

class Tabs {
  constructor({ triggerWrapper, triggerItems, triggerItemsActiveClass, contentItems }) {
    this.triggerWrapper = document.querySelector(triggerWrapper);
    this.triggerItems = document.querySelectorAll(triggerItems);
    this.contentItems = document.querySelectorAll(contentItems);
    this.triggerItemsActiveClass = triggerItemsActiveClass;

    this.init();
  }

  hideTabContent() {
    this.contentItems.forEach((item) => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    this.triggerItems.forEach((item) => {
      item.classList.remove(this.triggerItemsActiveClass);
    });
  }

  showTabContent(i = 0) {
    this.contentItems[i].classList.add('show', 'fade');
    this.contentItems[i].classList.remove('hide');
    this.triggerItems[i].classList.add(this.triggerItemsActiveClass);
  }

  init() {
    this.hideTabContent();
    this.showTabContent();

    this.triggerWrapper.addEventListener('click', (e) => {
      if (e.target && e.target.matches('.tabheader__item')) {
        this.triggerItems.forEach((item, index) => {
          if (e.target === item) {
            this.hideTabContent();
            this.showTabContent(index);
          }
        });
      }
    });
  }
}

export default Tabs;
