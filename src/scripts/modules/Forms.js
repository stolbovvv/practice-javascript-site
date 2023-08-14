import { postData } from '../utilities/index.js';

// FORM
class Form {
  constructor(element, cb) {
    this.form = element;
    this.formCb = cb;
    this.messages = {
      loading: './icons/spinner.svg',
      succses: 'Спаибо! Скоро мы с вами свяжемся',
      failure: 'Что-то пошло не так...',
    };

    this.init();
  }

  bindPostData(form, cb) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      const jsonData = Object.fromEntries(new FormData(this.form).entries());

      statusMessage.src = this.messages.loading;
      statusMessage.style.display = 'block';
      statusMessage.style.margin = '10px auto -28px auto';

      form.insertAdjacentElement('afterend', statusMessage);

      postData('http://localhost:3000/requests', JSON.stringify(jsonData))
        .then(() => cb(this.messages.succses))
        .catch(() => cb(this.messages.failure))
        .finally(() => {
          statusMessage.remove();
          form.reset();
        });
    });
  }

  init() {
    this.bindPostData(this.form, this.formCb);
  }
}

export default Form;
