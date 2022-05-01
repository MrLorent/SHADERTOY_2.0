import '../commons/commons_scss.js';
import './scss/home.scss'

document.addEventListener('DOMContentLoaded', () => {
  let main = document.querySelector('main');
  main.addEventListener('scroll', move_background);

  window.addEventListener('resize', move_background);
});

function move_background() {
  const main = document.querySelector('main');
  const NORMAL_RATIO = window.innerWidth / window.innerHeight;
  const INVERSED_RATION = window.innerHeight / window.innerWidth;

  let top_delta = main.scrollTop * 0.625 /
      (NORMAL_RATIO < INVERSED_RATION ? NORMAL_RATIO : INVERSED_RATION);
  main.style.backgroundPosition = 'top ' + -top_delta + 'px right 50%';
}