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

export default MenuCard;
