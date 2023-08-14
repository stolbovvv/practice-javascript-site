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

export default Slider;
