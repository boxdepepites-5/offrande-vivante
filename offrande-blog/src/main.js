const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}
