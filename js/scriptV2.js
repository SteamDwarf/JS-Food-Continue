'use strict';

window.addEventListener('DOMContentLoaded', () => {
  let tabContent = document.querySelectorAll('.tabcontent');
  let wrapper = document.querySelector('.tabheader__items');
  let tabs = document.querySelectorAll('.tabheader__item');

  ///////////////////////////////TABS/////////////////////////////////////

  function hideTabContent() {
    tabContent.forEach(item => {
      item.classList.add('hide');
    });

    tabs.forEach(tab => {
      tab.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  wrapper.addEventListener('click', (event) => {
    
    if(event.target && event.target.className === 'tabheader__item') {
      tabs.forEach((tab, i) => {
        if(event.target === tab) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  hideTabContent();
  showTabContent();

  //////////////////////////////TIMER//////////////////////////////////

  const deadline = '2020-10-13T23:05';

  function setTimer() {
    let milisec = Date.parse(deadline) - Date.parse(new Date()),
        days = Math.floor(milisec / (1000 * 60 * 60 * 24)),
        hours = Math.floor(milisec / (1000 * 60 * 60) % 24),
        minutes = Math.floor(milisec / (1000 * 60) % 60),
        seconds = Math.floor(milisec / 1000 % 60);
    
    return {
      milisec,
      days,
      hours,
      minutes,
      seconds
    };
  }

  function addZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function updateTimer() {
    let days = document.querySelector('#days'),
        hours = document.querySelector('#hours'),
        minutes = document.querySelector('#minutes'),
        seconds = document.querySelector('#seconds');
        let timer = setInterval(startTimer, 1000);

    startTimer();

    function startTimer() {
      let data = setTimer();

      days.innerHTML = addZero(data.days);
      hours.innerHTML = addZero(data.hours);
      minutes.innerHTML = addZero(data.minutes);
      seconds.innerHTML = addZero(data.seconds);

      if(data.milisec <= 0) {
        clearInterval(timer);
      }
    }
  }

  updateTimer();

  ////////////////////////////MODAL/////////////////////////////////////

  const modalBtns = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalClose = modal.querySelector('.modal__close'),
        startShowModalFunction = setTimeout(showModal, 5000);
  
   function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'visible';
  }

  function showModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    clearInterval(startShowModalFunction);
  }

  function showModalByScroll() {
    if(window.pageYOffset  + document.documentElement.clientHeight === document.documentElement.scrollHeight) {
      showModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  modalBtns.forEach(btn => {
    btn.addEventListener('click', showModal);
  });

  window.addEventListener('scroll', showModalByScroll);

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
 
/////////////////////////MENU/////////////////////////////

  class MenuCard {
    constructor(parentContainer, imgSrc, altImg, title, description, price) {
      this.parentContainer = parentContainer;
      this.imgSrc = imgSrc;
      this.altImg = altImg;
      this.title = title;
      this.description = description;
      this.price = price;
      this.parentContainer = document.querySelector(`[${parentContainer}]`);
    }

    render() {
      const newCard = document.createElement('div');
      newCard.classList.add('menu__item');

      newCard.innerHTML = `
      <img src=${this.imgSrc} alt=${this.altImg}>
      <h3 class="menu__item-subtitle">${this.title}</h3>
      <div class="menu__item-descr">${this.description}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
      </div>
      `;

      this.parentContainer.append(newCard);
    }
  }

  let balancedMenuCard = new MenuCard(
    'data-menu',
    "img/tabs/vegy.jpg",
    "vegy",
    'Сбалансированное',
    ' Меню "Сбалансированное" - это соответствие вашего рациона всем научным рекомендациям. Мы тщательно просчитываем вашу потребность в к/б/ж/у и создаем лучшие блюда для вас.',
    300
  );

  balancedMenuCard.render();

  let overeatingMenu = new MenuCard (
    'data-menu',
    "img/tabs/overeating.jpg",
    "overeating",
    'Обжорка',
    'Меню "Обжорка" - это отличное меню для тех людей, которых не заботит их вес, так как они ничего не весят =)',
    100
  );

  overeatingMenu.render();

  //////////////////////////////////////////////////////////

  const form = document.querySelector('form');

  const req = new Promise((resolve, reject) => {
    function postData() {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const answer = new XMLHttpRequest();
        answer.open('POST', 'server.php');
  
        answer.setRequestHeader('Content-type', 'application/json');
        const formData = new FormData(form);
  
        const object = {};
        formData.forEach(function(value, key) {
          object[key] = value;
        });

        const json = JSON.stringify(object);
        req.send(json);

        resolve();
      });
    }
  }).then(() => {
    console.log('All good');
  }).catch(() => {
    console.error('Something wrong...');
  }).finally(() => {
    console.log('All clear');
  });


/* 
  const message = {
    loading: '../img/modal/spinner.svg',
    success: 'Спасибо, мы с вами свяжемся.',
    failure: 'Что-то полшо не так...'
  };

  forms.forEach(item  => {
    postData(item);
  });

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusLoad = document.createElement('img');
      statusLoad.src = message.loading;
      statusLoad.style.cssText = `
        display: block;
        margin: 10px auto 0px;
      `
      form.after(statusLoad);

      const req = new XMLHttpRequest();
      req.open('POST', 'server.php');

      req.setRequestHeader('Content-type', 'application/json');
      const formData = new FormData(form);

      const object = {};
      formData.forEach(function(value, key) {
        object[key] = value;
      });

      const json = JSON.stringify(object);

      req.send(json);

      req.addEventListener('load', () => {
        if (req.status === 200) {
          console.log(req.response);
          showStatusMessage(message.success);
          form.reset();
          statusLoad.remove();
        } else {
          showStatusMessage(message.failure);
        }
      });
    });
  } */

});



