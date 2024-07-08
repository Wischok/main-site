/*
    Author: Aaron Evans
    Desc: javascript for nav menu opening and closing
*/

function Navigation (el) {
    //element references
    this.btn = el;
    this.menuButtons = document.querySelectorAll('.menu-button');

    //initialization
    this.init();
};

//init
Navigation.prototype.init = function() {
    //add event listeners
    this.btn.addEventListener('click',this.toggleMenu.bind(this));
    this.menuButtons.forEach((button) => {
        button.addEventListener('click', this.closeMenu.bind(this));
    });
}

Navigation.prototype.toggleMenu = function() {
    if(this.btn.getAttribute('aria-expanded') === 'false') {
        this.btn.setAttribute('aria-expanded', 'true');
    }
    else {
        this.btn.setAttribute('aria-expanded', 'false');
    }
}

Navigation.prototype.closeMenu = function() {
    this.btn.setAttribute('aria-expanded', 'false');
}

window.addEventListener('load', function() {
    new Navigation(this.document.getElementById('hamburger'));
});
