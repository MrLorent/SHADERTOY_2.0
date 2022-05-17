import './HeaderBar.scss';

document.addEventListener('DOMContentLoaded', () => {
  const menu_icon = document.querySelector('#menu_icon');
  const nav_links = document.querySelectorAll('.nav_link');

  menu_icon.addEventListener('click', deal_with_menu);
  nav_links.forEach(nav_link => {
    nav_link.addEventListener('click', deal_with_menu);
  })
});

function deal_with_menu() {
  const menu_icon = document.querySelector('#menu_icon');
  const menu = document.querySelector('.menu');

  menu_icon.classList.toggle('cross');
  menu.classList.toggle('unwraped');
}