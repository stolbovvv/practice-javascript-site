// TIMER

class Timer {
  constructor(selector, deadline) {
    this.timerWrapper = document.querySelector(selector);
    this.timerDays = this.timerWrapper.querySelector('#days');
    this.timerHours = this.timerWrapper.querySelector('#hours');
    this.timerMinutes = this.timerWrapper.querySelector('#minutes');
    this.timerSeconds = this.timerWrapper.querySelector('#seconds');
    this.timerDeadline = deadline;
    this.timeInterval;

    this.updateClock = this.updateClock.bind(this);

    this.init();
  }

  getTimeRemaning() {
    const timeDifference = new Date(this.timerDeadline) - new Date();
    const days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
    const hours = Math.floor((timeDifference / 1000 / 60 / 60) % 24);
    const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    return { days, hours, minutes, seconds, timeDifference };
  }

  correctTimeTtem(time) {
    if (time < 10) return `0${time}`;

    return time;
  }

  updateClock() {
    const timeData = this.getTimeRemaning();

    this.timerDays.textContent = this.correctTimeTtem(timeData.days);
    this.timerHours.textContent = this.correctTimeTtem(timeData.hours);
    this.timerMinutes.textContent = this.correctTimeTtem(timeData.minutes);
    this.timerSeconds.textContent = this.correctTimeTtem(timeData.seconds);

    if (timeData.timeDifference <= 0) {
      clearInterval(this.timeInterval);

      this.timerDays.textContent = '0';
      this.timerHours.textContent = '00';
      this.timerMinutes.textContent = '00';
      this.timerSeconds.textContent = '00';
    }
  }

  init() {
    this.updateClock();

    this.timeInterval = setInterval(this.updateClock, 1000);
  }
}

export default Timer;
