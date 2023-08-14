// CALC
class Calc {
  constructor() {
    this.result = document.querySelector('.calculating__result span');

    this.values = {
      sex: null,
      age: null,
      ratio: null,
      weight: null,
      height: null,
    };

    this.init();
  }

  setInitialValues() {
    if (localStorage.getItem('calc-sex')) {
      this.values.sex = localStorage.getItem('calc-sex');
    } else {
      this.values.sex = 'female';
      localStorage.setItem('calc-sex', 'female');
    }

    if (localStorage.getItem('calc-ratio')) {
      this.values.ratio = localStorage.getItem('calc-ratio');
    } else {
      this.values.ratio = 1.375;
      localStorage.setItem('calc-ratio', 1.375);
    }
  }

  calcTotal() {
    if (!this.values.sex || !this.values.age || !this.values.ratio || !this.values.weight || !this.values.height) {
      this.result.textContent = '_____';
      return;
    }

    if (this.values.sex === 'female') {
      this.result.textContent = Math.round(
        (447.6 + 9.2 * this.values.weight + 3.1 * this.values.height - 4.3 * this.values.age) * this.values.ratio,
      );
    }

    if (this.values.sex === 'male') {
      this.result.textContent = Math.round(
        (88.36 + 13.4 * this.values.weight + 4.8 * this.values.height - 5.7 * this.values.age) * this.values.ratio,
      );
    }
  }

  initLoacalSetting(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((elem) => {
      elem.classList.remove(activeClass);

      if (elem.dataset.calcRatio === localStorage.getItem('calc-ratio')) elem.classList.add(activeClass);
      if (elem.dataset.calcGender === localStorage.getItem('calc-sex')) elem.classList.add(activeClass);
    });
  }

  getStaticInformation(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        if (e.target.dataset.calcRatio) {
          this.values.ratio = +e.target.dataset.calcRatio;
          localStorage.setItem('calc-ratio', +e.target.dataset.calcRatio);
        }
        if (e.target.dataset.calcGender) {
          this.values.sex = e.target.dataset.calcGender;
          localStorage.setItem('calc-sex', e.target.dataset.calcGender);
        }

        elements.forEach((elem) => {
          if (elem === e.target) {
            elem.classList.add(activeClass);
          } else {
            elem.classList.remove(activeClass);
          }
        });

        this.calcTotal();
      });
    });
  }

  getDynamicInformation(selector) {
    const input = document.querySelector(selector);

    input.addEventListener('input', () => {
      if (input.value.match(/\D/g)) {
        input.style.border = '1px solid red';
      } else {
        input.style.border = 'none';
      }

      switch (input.getAttribute('id')) {
        case 'age':
          this.values.age = +input.value;
          break;

        case 'weight':
          this.values.weight = +input.value;
          break;

        case 'height':
          this.values.height = +input.value;
          break;
      }

      this.calcTotal();
    });
  }

  init() {
    this.setInitialValues();
    this.initLoacalSetting('.calculating__choose#gender div', 'calculating__choose-item_active');
    this.initLoacalSetting('.calculating__choose.calculating__choose_big div', 'calculating__choose-item_active');
    this.getStaticInformation('.calculating__choose#gender div', 'calculating__choose-item_active');
    this.getStaticInformation('.calculating__choose.calculating__choose_big div', 'calculating__choose-item_active');
    this.getDynamicInformation('#age');
    this.getDynamicInformation('#weight');
    this.getDynamicInformation('#height');
    this.calcTotal();
  }
}

export default Calc;
