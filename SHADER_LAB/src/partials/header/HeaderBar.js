document.addEventListener('DOMContentLoaded', () => {
  const menu_icon = document.querySelector('#menu_icon');

  menu_icon.addEventListener('click', deal_with_menu);
});

function deal_with_menu() {
  const menu_icon = document.querySelector('#menu_icon');
  const menu = document.querySelector('.menu');

  menu_icon.classList.toggle('cross');
  menu.classList.toggle('unwraped');
}