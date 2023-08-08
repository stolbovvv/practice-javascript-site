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
});
