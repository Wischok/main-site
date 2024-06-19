/*
    Author: Aaron Evans
    desc: navigation table of contents interactions
*/

var btn = document.getElementById('nav-toggle');
btn.addEventListener('click', menuToggle.bind(this));

function menuToggle() {
    if(btn.getAttribute('aria-expanded') === 'false') {
        btn.setAttribute('aria-expanded', 'true');
    }
    else {
        btn.setAttribute('aria-expanded', 'false');
    }
}