'use strict';

window.addEventListener('DOMContentLoaded', () => {

  ///////////////////////////////TABS/////////////////////////////////////

  let tabContent = document.querySelectorAll('.tabcontent');
  let wrapper = document.querySelector('.tabheader__items');
  let tabs = document.querySelectorAll('.tabheader__item');

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

    if (event.target && event.target.className === 'tabheader__item') {
      tabs.forEach((tab, i) => {
        if (event.target === tab) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  hideTabContent();
  showTabContent();

  //////////////////////////////TIMER//////////////////////////////////

  const deadline = '2023-10-13T23:05';

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

      if (data.milisec <= 0) {
        clearInterval(timer);
      }
    }
  }

  updateTimer();

  ////////////////////////////MODAL/////////////////////////////////////

  const modalBtns = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal'),
    modalClose = document.querySelector('.modal__close'),
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
    if (window.pageYOffset + document.documentElement.clientHeight === document.documentElement.scrollHeight) {
      showModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  modalBtns.forEach(btn => {
    btn.addEventListener('click', showModal);
  });

  window.addEventListener('scroll', showModalByScroll);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.className == 'modal__close') {
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
    constructor(imgSrc, alt, title, description, price, parent) {
      this.imgSrc = imgSrc;
      this.alt = alt;
      this.title = title;
      this.description = description;
      this.price = price * 73;
      this.parent = document.querySelector(parent);
    }

    render() {
      const newCard = document.createElement('div');
      newCard.classList.add('menu__item');
      newCard.innerHTML = `
      <img src=${this.imgSrc} alt=${this.alt}>
      <h3 class="menu__item-subtitle">${this.title}</h3>
      <div class="menu__item-descr">${this.description}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
         <div class="menu__item-cost">Цена:</div>
         <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
      </div>
      `;

      this.parent.append(newCard);
    }
  } 

  const getResources = async (url) => {
    const res = await fetch(url);
    if(!res.ok) {
      throw new Error(`You response ${url} failed: ${res.status}`);
    }

    return await res.json();
  };

  getResources('http://localhost:3000/menu')
  .then(data => {
    data.forEach( ({img, altimg, title, descr, price}) => {
      new MenuCard(img, altimg, title, descr, price,'[data-menu]').render();
    });
  });

  /////////////////////Отправка формы///////////////

  const forms = document.querySelectorAll('form');

  const message = {
    loading: '../img/modal/spinner.svg',
    success: 'Спасибо, мы с вами свяжемся.',
    failure: 'Что-то полшо не так...'
  };

  forms.forEach(item => {
    bindPostData(item);
  })

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    });

    if(!res.ok) {
      throw new Error(`You response ${url} failed: ${res.status}`);
    }

    return await res.json();
  }

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.classList.add('status');
      statusMessage.src = message.loading;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);
      const object = Object.fromEntries((formData.entries()));
      const json = JSON.stringify(object);

      postData('http://localhost:3000/requests', json)
      .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove(); 
      }).catch(() => {
          showThanksModal(message.failure);
      }).finally(() => {
          form.reset();
      })
    });
  };


  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.remove('show');
    prevModalDialog.classList.add('hide');
    showModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title" data-close>${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.remove('hide');
      prevModalDialog.classList.add('show');
      closeModal();
    }, 4000);
  }

   /*
  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.classList.add('status');
      statusMessage.src = message.loading;
      form.insertAdjacentElement('afterend', statusMessage);

      const req = new XMLHttpRequest();
      req.open('POST', 'server.php');

      const formData = new FormData(form);

      const object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      });

      const jsonObject = JSON.stringify(object);

      req.send(jsonObject);
      req.addEventListener('load', () => {
        if (req.status === 200) {
          showThanksModal(message.success);
          form.reset();
          statusMessage.remove();
        } else {
          showThanksModal(message.failure);
        };
      });
    });
  };
    Отправка данных в JSON формате
    На сервере php должно быть прописано

    <?php
    $_POST = json_decode(file_get_contents("php://input"), true);
    echo var_dump($_POST);
    ?>
  */


  /*function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('div');
      statusMessage.classList.add('status');
      statusMessage.textContent = message.loading;
      form.append(statusMessage);

      const req = new XMLHttpRequest();
      req.open('POST', 'server.php');

      const formData = new FormData(form);

      req.send(formData);
      req.addEventListener('load', () => {
        if (req.status === 200) {
          statusMessage.textContent = message.success;
          form.reset();
          setTimeout( () => {
            statusMessage.remove();
          }, 2000);
        } else {
          statusMessage.textContent = message.failure;
        }
      });

    })
  }
  Если мы отправляем данные ввиде formData, то текст в server.php
  должен выглядеть так

    <?php
    echo var_dump($_POST);
    ?>
  
  */

  //////////////////////////////////////////////

  /////////////////SLIDER///////////////////////

  const sliderCounter = document.querySelector('.offer__slider-counter'),
    sliderPrev = sliderCounter.querySelector('.offer__slider-prev'),
    sliderNext = sliderCounter.querySelector('.offer__slider-next'),
    sliderCurrentNum = sliderCounter.querySelector('#current'),
    sliderTotalNum = sliderCounter.querySelector('#total'),
    sliderWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    widthField = window.getComputedStyle(sliderWrapper).width,
    slides = document.querySelectorAll('.offer__slide');

  let offset = 0,
      index = 1,
      width = +widthField.slice(0, widthField.length - 2),
      maxWidth = width * slides.length;

  slidesField.style.width = 100 * slides.length + '%';
  slides.forEach(slide => {
    slide.style.width = widthField;
  });
  
  function widthValidation() {
    if(offset >= maxWidth) {
      offset = 0;

    } else if(offset < 0) {
      offset = maxWidth - width;
    }
  }

  function numValidation() {
    if(index <= 0) {
      index = +sliderTotalNum.textContent;
    } else if (index > +sliderTotalNum.textContent) {
      index = 1;
    }
  }

  function slideNumChange() {
    numValidation();
    sliderCurrentNum.textContent = `0${index}`;
  }

  function slideChange(button) {
    if(button) {
      offset += width;
      widthValidation();
      slidesField.style.transform = `translateX(-${offset}px)`;
      
    } else {
      offset -= width;
      widthValidation();
      slidesField.style.transform = `translateX(-${offset}px)`;
    }
  }

  sliderPrev.addEventListener('click', () => {
    slideChange(false);
    --index;
    slideNumChange();
  });

  sliderNext.addEventListener('click', () => {
    slideChange(true);
    ++index;
    slideNumChange();
  })

  /*function slidesHide() {
    slides.forEach( slide => {
      slide.classList.add('hide');
    });
  }

  function numValidation(currentNum, totalNum) {
    if(currentNum > totalNum) {
      sliderCurrentNum.textContent = '01';

    } else if (currentNum < 1){
        if(totalNum < 10) {
          sliderCurrentNum.textContent = `0${totalNum}`;
        } else {
          sliderCurrentNum.textContent = totalNum;
        }
    } else {
      sliderCurrentNum.textContent = `0${currentNum}`;
    }
  }

  function showSlide() {
    let currentNum = sliderCurrentNum.textContent - 1;
    slides[currentNum].classList.remove('hide');
  }

  function slideNumChange(button) {
    let currentNum = +sliderCurrentNum.textContent,
        totalNum = +sliderTotalNum.textContent;
    
    if (button) {
      currentNum++;
    } else {
      currentNum--;
    }
    
    numValidation(currentNum, totalNum);
    slidesHide();
    showSlide();
  }

  sliderPrev.addEventListener('click', () => {
    slideNumChange(false);
  });

  sliderNext.addEventListener('click', () => {
    slideNumChange(true);
  })

  slidesHide();
  showSlide(); */


});