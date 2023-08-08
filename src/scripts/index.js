/* Global */

class Menu {
  constructor(element, { activeClass = 'is-active' }) {
    this.menuRoot = typeof element === 'string' ? document.querySelector(element) : element;

    if (this.menuRoot) {
      this.menuWrapper = this.menuRoot.querySelector('.js-menu-wrapper');
      this.menuTrigger = this.menuRoot.querySelector('.js-menu-trigger');

      this.options = {
        activeClass,
      };

      this.init();
    }
  }

  show() {
    this.menuWrapper.classList.add(this.options.activeClass);
    this.menuTrigger.classList.add(this.options.activeClass);

    document.body.style['overflow'] = 'hidden';
  }

  hide() {
    this.menuWrapper.classList.remove(this.options.activeClass);
    this.menuTrigger.classList.remove(this.options.activeClass);

    document.body.style.removeProperty('overflow');
  }

  toggle() {
    if (this.menuTrigger.classList.contains(this.options.activeClass)) {
      this.hide();
    } else {
      this.show();
    }
  }

  init() {
    this.menuTrigger.addEventListener('click', () => this.toggle());
  }
}

class Tabs {
  constructor(element, { activeClass = 'is-active' }) {
    this.tabsRoot = typeof element === 'string' ? document.querySelector(element) : element;

    if (this.tabsRoot) {
      this.tabsTrigger = this.tabsRoot.querySelectorAll('.js-tabs-trigger');
      this.tabsContent = this.tabsRoot.querySelectorAll('.js-tabs-content');

      this.options = {
        activeClass,
      };

      this.update = this.update.bind(this);

      this.init();
    }
  }

  update(tabId) {
    this.tabsTrigger.forEach((trigger) => {
      if (trigger.dataset.tabId === tabId) trigger.classList.add(this.options.activeClass);
      if (trigger.dataset.tabId !== tabId) trigger.classList.remove(this.options.activeClass);
    });

    this.tabsContent.forEach((content) => {
      if (content.dataset.tabId === tabId) content.classList.add(this.options.activeClass);
      if (content.dataset.tabId !== tabId) content.classList.remove(this.options.activeClass);
    });
  }

  init() {
    this.tabsTrigger.forEach((trigger) => {
      trigger.addEventListener('click', () => this.update(trigger.dataset.tabId));
    });

    this.update(this.tabsTrigger[0].dataset.tabId);
  }
}

class Popup {
  constructor(element, { activeClass = 'is-active', needLock = true }) {
    this.popupRoot = typeof element === 'string' ? document.querySelector(element) : element;

    if (this.popupRoot) {
      this.popupTrigger = document.querySelectorAll(`.js-popup-trigger`);

      this.options = {
        needLock,
        activeClass,
      };

      this.init();
    }
  }

  show() {
    this.popupRoot.classList.add(this.options.activeClass);

    if (this.options.needLock) document.body.style['overflow'] = 'hidden';
  }

  hide() {
    this.popupRoot.classList.remove(this.options.activeClass);

    if (this.options.needLock) document.body.style.removeProperty('overflow');
  }

  init() {
    this.popupRoot.addEventListener('click', (e) => {
      if (e.target && e.target === this.popupRoot) this.hide();
    });

    this.popupTrigger.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        if (trigger.dataset.showPopup === this.popupRoot.id) this.show();
        if (trigger.dataset.hidePopup === this.popupRoot.id) this.hide();
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Custom scripts...
});
