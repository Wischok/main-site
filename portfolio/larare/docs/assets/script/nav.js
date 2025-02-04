/*
    Author: Aaron Evans
    desc: navigation positioning on scroll
*/

var nav = document.getElementById('nav');

var lastScrollTop = 0;
console.log()
window.addEventListener("scroll", function() {
    var st = window.pageYOffSet || document.documentElement.scrollTop;
    
    if(st != 0) {
        if(!nav.classList.contains('scroll')) {
            nav.classList.add('scroll');
        }
    }
    else {
        if(nav.classList.contains('scroll')) {
            nav.classList.remove('scroll');
        }
    }

    if(st < lastScrollTop) {
        if(!nav.classList.contains('scroll-up')) {
            nav.classList.add('scroll-up');
        }
    }
    else {
        if(nav.classList.contains('scroll-up')) {
            nav.classList.remove('scroll-up');
        }
    }
    // if(st > lastScrollTop)

    lastScrollTop = st <= 0 ? 0 : st;
});

// hamburger toggle
var hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', function() {
    if(hamburger.getAttribute('aria-expanded') === 'false') {
        hamburger.setAttribute('aria-expanded', 'true');
    }
    else {
        hamburger.setAttribute('aria-expanded', 'false');
    }
});