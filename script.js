'use strict';
///////////////////////////////////////

const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const nav = document.querySelector(`.nav`);

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(button => {
  button.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// BUTTON SCROLLING 

btnScrollTo.addEventListener(`click`, function (e) {
  const s1coords = section1.getBoundingClientRect();     // IMPORTANT GETS THE COORDINATES OF AN ELEMENT IN THE DOM 
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log(`Current scroll (X/Y)`, window.pageXOffset, window.pageYOffset);

  console.log(`Height and width of viewport`, document.documentElement.clientHeight, document.documentElement.clientWidth);   // THIS ARE THE DIMENTIONS OF THE VIEWPORT THAT ARE AVAILABLE FOR THE CONTENT

  // Scrolling the window

  // window.scrollTo(s1coords.left, s1coords.top);   // IMPORTANT THIS COORDINATES ARE RELATIVE TO THE VIEWPORT OF THE CLIENT INSTEAD OF THE PAGE ITSELF
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset); // THE SOLUTION IS TO ADD THE CURRENT POSITION + THE CURRENT SCROLL, OR THE CURRENT POSITION + THE REMAINING AMOUNT OF THE PAGE

  // OLD WAY 
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });   // IMPORTANT THIS ALLOWS US TO MAKE A SMOOTH TRANSITION 

  // NEW AND AMAZING WAY OMG IMPORTANT, NO NEED TO SPECIFY ANY VALUES IMPORTANT
  section1.scrollIntoView({
    behavior: `smooth`,
  });
});
//////////////////////////////////////////////////////////
// PAGE NAVEGATION

// document.querySelectorAll(`.nav__link`).forEach(function (elem) {
//   elem.addEventListener(`click`, function (e) {
//     e.preventDefault();
//     const id = this.getAttribute(`href`);
//     console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: `smooth`,
//     })
//     // console.log(id, this.href); //  WE DONT WANT THE ABSOLUTE URL OF THE HREF ATTRIBUTE THATS WHY WE CANT DO THIS.HREF IMPORTANT
//   });
// });

// 1. Event listener to common parent elements
// 2. Determine what element originated the even so we can delegate it

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();

  // MATCHING STRATEGY  // IMPORTANT
  if (e.target.classList.contains(`nav__link`)) {
    console.log(`link`);
    const id = e.target.getAttribute(`href`);
    document.querySelector(id).scrollIntoView({ behavior: `smooth`, });
  };
});

// TABBED COMPONENT

const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);

tabsContainer.addEventListener(`click`, function (e) {// IMPORTANT
  const clicked = e.target.closest(`.operations__tab`);   // THIS IS VERY IMPORTANT TO REMEMBER, SPECIALLY WHEN THERE ARE DIFFERENT ELEMENTS PRESENT IN THE ELEMENT WE ARE CLICKED EX. SPAN ELEMENTS

  // GUARD CLAUSE // IMPORTANT
  if (!clicked) return;

  // ACTIVE TAB MANAGEMENT  
  // BUTTON
  tabs.forEach(function (tab) {
    tab.classList.remove(`operations__tab--active`);
  })
  clicked.classList.add(`operations__tab--active`);
  // CONTENT  
  tabsContent.forEach((tab) => {
    tab.classList.remove(`operations__content--active`);
  })

  // ACTIVATE THE CONTENT AREA
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add(`operations__content--active`);
})

// MENU FADE ANIMATION

const handleHover = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const sibling = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    sibling.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    })
    logo.style.opacity = this;
  }
};

// PASSING AN "ARGUMENT" INTO AN EVENT HANDLER ---------- REMEMBER BIND METHOD

nav.addEventListener(`mouseover`, handleHover.bind(0.5));

nav.addEventListener(`mouseout`, handleHover.bind(1));

// STICKY NAVEGATION

// const initialCoords = section1.getBoundingClientRect();   // IMPORTANT GET COORDINATES FROM AN ELEMENT
// console.log(initialCoords);
// window.addEventListener(`scroll`, function (e) {
//   console.log(this.scrollY);

//   if (this.scrollY > initialCoords.top) nav.classList.add(`sticky`);
//   else nav.classList.remove(`sticky`);
// });

// STICKY NAVEGATION : INTERSECTION OBSERVER API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 1, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector(`.header`);
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {    // ENTRIES ARE THE THRESHOLDS AND ALSO RELATES TO THE OBSERVER OBJECT
  const [entry] = entries;    // SAME AS entry = entries[0]
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`)
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,     // MEASUREMENT IN PIXELS or PERCENTAGE --- NEGATIVE VALUE SO IT IS ON THE MARGIN OF THE BOTTOM, SO WE MAKE THE NAV BAR APPEAR AS SOON AS THE VISIBLE SPACE OF THE HEADER IS EXACTLY THE SAME AS ITS HEIGHT
});

headerObserver.observe(header);

// REVEAL SECTIONS

const allSections = document.querySelectorAll(`.section`);

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);

  observer.unobserve(entry.target);       // IMPORTANT
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add(`section--hidden`);
});

// LAZY LOADING IMAGES 

const imgTargets = document.querySelectorAll(`img[data-src]`);  // IMPORTANT WE SELECT THE IMAGES WITH THE PROPERTY OF data-src

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // REPLACE THE src WITH data-src
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove(`lazy-img`);   // IMPORTANT SEE COMMENT BELLOW FOR THE REASON OF NOT USING THIS METHOD FOR FILE OR ELEMENT LOADING.
  // SINCE WE CHANGED THE IMAGE WITH THE LINE ABOVE THE COMMENT, THE BROWSER HAS TO LOAD IT AGAIN, SO FOR SLOW NETWORKS IT CAN TAKE A LONG TIME AND IT WILL HAVE A BLURRY OR NOT SO CLEAR IMAGE ON THE PAGE UNTIL IT FINISHES

  entry.target.addEventListener(`load`, function (e) {    // VERY IMPORTANT FOR LOADING ELEMENTS INTO A PAGE, SPECIALLY FOR SLOW NETWORKS
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '100px',     // IMPORTANT WE USE THIS TO MAKE THE IMAGES LOAD BEFORE WE GET TO THEM SO WE DONT SEE ANY DELAY WHEN WE BROWSE
  //IDK HOW TO FEEL ABOUT THIS SINCE IT DOESNT SHOW THE COOL UNBLURRYING EFFECT

});

imgTargets.forEach(img => imgObserver.observe(img));

// SLIDER
const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const dotContainer = document.querySelector(`.dots`);

  let curSlide = 0;
  const maxSlide = slides.length;


  // slides.forEach((s, i) => s.style.transform = `translateX(${100 * i}%)`);      // GENIOUS WAY OF MANAGING THE PERCENTAGES


  // FUNCTIONS

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(`beforeend`,
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  };

  const activateDot = function (slide) {
    document.querySelectorAll(`.dots__dot`).forEach(dot => dot.classList.remove(`dots__dot--active`));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add(`dots__dot--active`);   // THIS QUERY IS VERY NICE, WE SELECT THE ELEMENT dots__dot WITH THE CLASS data-slide AND THE CURRENT VALUE OF slide. THAT WAY WE ONLY ACTIVE THE DOT THATS REFERENCING THE CURRENTLY ACTIVE SLIDE
  };

  // NEXT SLIDE

  const nextSlide = function () {
    if (curSlide == maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide); //  IMPORTANT 0 - 1 = -1; -1 * 100 = -100%, transformX(-100%), SO THAT WAY WE MOVE THE SLIDES TO THE LEFT
    activateDot(curSlide);
  };

  // PREVIOUS SLIDE

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);   // WE CALL IT RIGHT AT THE BEGINNING SO ONCE THE APP STARTS IT IMMEDIATLY GOES TO SLIDE 0, AND WE PLACE THE SLIDES IN THE RIGHT PLACE
    createDots();
    activateDot(curSlide);
  };

  init();

  // EVENT HANDLERS
  btnRight.addEventListener(`click`, nextSlide);
  btnLeft.addEventListener(`click`, prevSlide);

  document.addEventListener(`keydown`, function (e) {
    if (e.key === `ArrowLeft`) prevSlide();
    e.key === `ArrowRight` && nextSlide();    // REMEMBER SHORT CIRCUTING IMPORTANT
  });

  dotContainer.addEventListener(`click`, function (e) {       // IMPORTANT IMPORTANT REMEMBER EVEN DELEGATION PLEASE JUANSE
    if (e.target.classList.contains(`dots__dot`)) {
      // const slide = e.target.dataset.slide;   // STORING THE NUMBER OF THE SLIDE OF EACH BUTTON
      const { slide } = e.target.dataset;     // DESTRUCTURING SINCE THE NAME OF THE VARIABLE IS THE SAME AS THE PROPERTY WE ARE TRYING TO ACCESS ----- LOOK AT LINE ABOVE IT TO SEE THE OTHER WAY OF DOING IT
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector(`.header`);
const allSections = document.querySelectorAll(`.section`);

console.log(document.querySelector(`.header`));
console.log(allSections);

document.getElementById(`section--1`);
const allButtons = document.getElementsByTagName(`button`);     // THIS RETURNS A HTML COLLECTION WHICH UPDATES ITSELF WHEN YOU DELETE ELEMENTS FROM THE HTML

console.log(allButtons);

console.log(document.getElementsByClassName(`btn`));

// CREATING AND INSERTING ELEMENTS WITH THE DOM  // IMPORTANT
// .insertAdjacentHTML

const message = document.createElement(`div`);
message.classList.add(`cookie-message`);
// message.textContent = `We use cookies for improved functionality and analytics.`;
message.innerHTML = `We use cookies for improved functionality and analytics.<button class ="btn btn--close-cookie">Got it!</button>`;

// header.prepend(message); // PREPEND ADDS ELEMENT AS THE FIRST CHILD
header.append(message);  // APPEND ADDS ELEMENT AS THE LAST CHILD

//  IT DOESNT INSERTS IT ONCE BECAUSE THE MESSAGE ELEMENT IS A LIVE ELEMENT IN THE DOM, AND DOM ELEMENTS ARE UNIQUE SO THEY CANT EXIST AT MULTIPLE PLACES AT ONCE

// header.append(message.cloneNode(true));

// THIS WAY WE COPY THE ELEMENT SO IT CAN EXIST TWICE AS A COPY

// INSERTING ELEMENTS AS SIBLINGS

// header.before(message);
// header.after(message);


// DELETE ELEMENTS // IMPORTANT

document.querySelector(`.btn--close-cookie`).addEventListener(`click`, function () {
  // message.remove();
  message.parentElement.removeChild(message); // OLD WAY OF DELETING DOM ELEMENTS
})


// STYLES

message.style.backgroundColor = `#37383d`;
message.style.width = `120%`;

console.log(message.style.height);      // CANNOT PRINT NON INLINE STYLES LIKE THIS
console.log(message.style.backgroundColor);     // INLINE STYLE CREATED BEFORE

console.log(getComputedStyle(message).color);   // PRACTICAL WAY OF GETTING THE COMPUTED STYLES, WHICH MEANS STYLES AS IT APPEARS ON THE PAGE
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + `px`;    // PARSING // IMPORTANT

document.documentElement.style.setProperty('--color-primary', `orangered`);

// ATTRIBUTES

const logo = document.querySelector(`.nav__logo`);
console.log(logo.alt);
console.log(logo.className);

logo.alt = `Beautiful minimalist logo`;

// NON-STANDARD
console.log(logo.designer); // WILL BE UNDEFINED IF WE TRY TO READ NON STANDARD PROPERTIES
console.log(logo.getAttribute(`designer`));
logo.setAttribute(`company`, `Bankist`);

console.log(logo.src);    // THIS PRINTS THE ABSOLUTE URL FROM WHERE THE FILE IS LOCATED
console.log(logo.getAttribute(`src`));  // THIS PRINTS TH RELATIVE URL

const link = document.querySelector(`.nav__link--btn`);

console.log(link.href);
console.log(link.getAttribute(`href`));

// DATA ATTRIBUTES

console.log(logo.dataset.versionNumber);

// CLASSES
logo.classList.add(`c`, `j`);
logo.classList.remove(`c`, `j`);
logo.classList.toggle(`c`);
logo.classList.contains(`c`); // not includes

// NEVER USE THIS // IMPORTANT THIS WILL OVERRIDE ALL EXISTING CLASSES NO NEVER USE IT
logo.className = `jonas`;

*/

// NEW LESSON

/*

const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);

btnScrollTo.addEventListener(`click`, function (e) {
  const s1coords = section1.getBoundingClientRect();     // IMPORTANT GETS THE COORDINATES OF AN ELEMENT IN THE DOM
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log(`Current scroll (X/Y)`, window.pageXOffset, window.pageYOffset);

  console.log(`Height and width of viewport`, document.documentElement.clientHeight, document.documentElement.clientWidth);   // THIS ARE THE DIMENTIONS OF THE VIEWPORT THAT ARE AVAILABLE FOR THE CONTENT

  // Scrolling the window

  // window.scrollTo(s1coords.left, s1coords.top);   // IMPORTANT THIS COORDINATES ARE RELATIVE TO THE VIEWPORT OF THE CLIENT INSTEAD OF THE PAGE ITSELF
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset); // THE SOLUTION IS TO ADD THE CURRENT POSITION + THE CURRENT SCROLL, OR THE CURRENT POSITION + THE REMAINING AMOUNT OF THE PAGE

  // OLD WAY
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });   // IMPORTANT THIS ALLOWS US TO MAKE A SMOOTH TRANSITION

  // NEW AND AMAZING WAY OMG IMPORTANT, NO NEED TO SPECIFY ANY VALUES IMPORTANT
  section1.scrollIntoView({
    behavior: `smooth`,
  });
});
const h1 = document.querySelector(`h1`);

// SETTING EVENT LISTENERS

const alertH1 = function (e) {
  alert(`addEventListener: You are reading the heading`);

  // h1.removeEventListener(`mouseenter`, alertH1); // REMOVE EVENT HANDLERS, YOU HAVE TO EXPORT THE FUNCTION IF YOU WANT TO REMOVE IT FROM THE SAME FUNCTION
};

h1.addEventListener(`mouseenter`, alertH1);

setTimeout(() => {
  h1.removeEventListener(`mouseenter`, alertH1)
}, 3000);

//OLD WAY NOT USE

// h1.onmouseenter = function (e) {
//   alert(`onmouseenter: You are reading the heading`);
// };

*/

// NEW LESSON

// rgb(255,255,255)

/*
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

console.log(randomColor());

document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = randomColor();
  console.log(`Link`, e.target, e.currentTarget);   // CURRENT TARGET IS THE ELEMENT TO WHICH THE EVENT LISTENER IS ATTATCHED TO
  console.log(e.currentTarget === this);

  // Stop propagation to parent elements // IMPORTANT NOT A GOOD IDEA IN PRACTICE ACCORDING TO JONAS
  // e.stopPropagation();
});

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = randomColor();
  console.log(`Container`, e.target, e.currentTarget);
});

document.querySelector(`.nav`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = randomColor();
  console.log(`Nav`, e.target, e.currentTarget)
},
  // true // IMPORTANT TRUE PARAMETER MAKES THE EVENT PROPAGATION TO WORK DURING THE CAPTURING PHASE INSTEAD OF THE BUBBLING ONE
);

*/

// NEW LESSON

/*
const h1 = document.querySelector(`h1`);

// GOING DOWNWARDS: CHILD ELEMENTS
console.log(h1.querySelectorAll(`.highlight`));
// DIRECT CHILDREN
console.log(h1.childNodes); // NODELIST
console.log(h1.children);   // HTML COLLECTION
h1.firstElementChild.style.color = `white`;
h1.lastElementChild.style.color = `orangered`;

// GOING UPWARDS: PARENT ELEMENTS
console.log(h1.parentNode);
console.log(h1.parentElement);


// CLOSEST METHOD FINDS PARENTS NO MATTER HOW UP IN THE DOM TREE
// IMPORTANT
h1.closest(`.header`).style.background = `var(--gradient-secondary)`;   // SELECTING THE CLOSEST HEADER TO THE H1 ELEMENT

h1.closest(`h1`).style.background = `var(--gradient-primary)`;

// GOING SIDEWAYS: SIBLING ELEMENTS

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);   // IMPORTANT

[...h1.parentElement.children].forEach(function (elem) {
  if (elem !== h1) elem.style.transform = `scale(0.5)`;
})

*/

// NEW LESSON 
/*
// LIFE TIME OF DOM EVENTS

// IMPORTANT THIS EVENT DOESNT WAIT FOR PICTURES OR FILES TO LOAD ONLY HTML AND JS
// THATS WHY WE PUT THE SCRIPT TAG AT THE END OF THE HTML SO WE WAIT FOR THE HTML DOM TREE TO BE LOADED AND PARSED
document.addEventListener(`DOMContentLoaded`, function (e) {
  console.log(`HTML parsed and DOM tree built!`, e);
});

// TRIGGERED WHEN THE PAGE IS FULLY LOADED
window.addEventListener(`load`, function (e) {
  console.log(`Page fully loaded`, e);;
});

// TRIGGERED WHEN AN USER IS ABOUT TO LEAVE THE PAGE (CLOSED THE PAGE)
// window.addEventListener(`beforeunload`, function (e) {
//   e.preventDefault();   // SOME BROWSERS REQUIERE THIS CALL
//   console.log(e);
//   e.returnValue = '';   // WE NEED TO SET THIS FOR HISTORICAL REASONS
// })

*/

// NEW LESSON

