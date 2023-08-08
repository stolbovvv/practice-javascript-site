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
});
