/*

Author: Aaron Evans
Desc: Keyboard integration for navigation elements and mobile
expansion

*/

"use strict";

//check if width is equal to or below 810px (aka mobile / tablet)
function isMobile() {
    return (window.innerWidth <= 810 ? true : false);
}

/*
    Navigation Component Class
    Accecpts a combobox element and an array of string options
*/Nav
function Nav (el) {//define as class
    
    //element refs
    this.el = el;//navigation element
    this.subMenuButtons = el.querySelectorAll('.menu-button');
    this.subMenuListItems = el.querySelectorAll('.menulistitem');
    this.hamburger = el.querySelector('.hamburger');
    this.menuBackdrop = document.getElementById('menu-backdrop');
    this.addressLinks = document.getElementById('address').querySelectorAll('a');
    this.addressButton = document.getElementById('address-btn');

    //data
    this.currentActiveSubMenu = null;
    
    //init
    if(el && this.subMenuButtons) {
        this.init();//initialization function
    }
};

Nav.prototype.init = function() {
    //add event listeners
    this.subMenuButtons.forEach((btn) => {
        btn.addEventListener('focusin', this.onSubMenuDisplay.bind(this));
    })
    this.subMenuListItems.forEach((item) => {
        item.addEventListener('focusout', this.onSubMenuNoDisplay.bind(this));
    })


    this.menuBackdrop.addEventListener('click', this.hamburgerSelect.bind(this));
    this.hamburger.addEventListener('click', this.hamburgerSelect.bind(this));
    this.addressButton.addEventListener('click', this.addressToggle.bind(this));
    this.addressButton.addEventListener('keydown', this.keyboardTrapNext.bind(this));
    document.getElementById('address1').addEventListener('keydown',this.keyboardTrapPrev.bind(this));

    this.addressLinks.forEach((link) => {
        link.addEventListener('keydown', this.addressLinkClick.bind(this));
    });

    if(isMobile()) {
        this.subMenuButtons.forEach(btn => {
            btn.setAttribute('aria-expanded', 'true');
        });
    }
};

Nav.prototype.addressLinkClick = function(event) {
    const {key} = event;

    if(key === ' ') {
        event.target.click();
        event.preventDefault();
    }
};

Nav.prototype.keyboardTrapNext = function(event) {
    const {key, shiftKey} = event;

    if(this.addressButton.getAttribute('aria-expanded') === 'false') {
        return;
    }

    if(key === "Tab" && !shiftKey) {
        document.getElementById('address1').focus()
        event.preventDefault();
    }
}

Nav.prototype.keyboardTrapPrev = function(event) {
    const {key, shiftKey} = event;

    if(this.addressButton.getAttribute('aria-expanded') === 'false') {
        return;
    }

    if(key === "Tab" && shiftKey) {
        this.addressButton.focus()
        event.preventDefault();
    }
}

Nav.prototype.onSubMenuDisplay = function(event) {
    if(isMobile()) {
        return;
    }

    let btn = event.target;

    //ignore if already displayed
    if(btn.getAttribute('aria-expanded') === 'true') {
        return;
    }
    
    btn.setAttribute('aria-expanded', 'true');
}

Nav.prototype.onSubMenuNoDisplay = function(event) {
    if(event.target.querySelector(':hover')) {
        return;
    }

    if(event.target.getAttribute('aria-expanded') == 'true') {
        event.target.setAttribute('aria-expanded','false');
        return;
    }

    let btn = document.getElementById(event.target.getAttribute('aria-labelledby'));
    if(btn) {
        btn.setAttribute('aria-expanded', 'false');
    }
}

Nav.prototype.hamburgerSelect = function() {
    if(this.hamburger.getAttribute('aria-expanded') === 'false') {
        this.hamburger.setAttribute('aria-expanded', 'true');
    }
    else {
        this.hamburger.setAttribute('aria-expanded', 'false');
    }
}

//account for window resizing for aria-exanded attribut in submenus
Nav.prototype.onWindowResize = function() {
    if(isMobile) {
        this.subMenuButtons.forEach(btn => {
            btn.setAttribute('aria-expanded', 'true');
        });
    }
    else {
        this.subMenuButtons.forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
        });
    }
}

Nav.prototype.addressToggle = function() {
    if(this.addressButton.getAttribute('aria-expanded') == 'false') {
        this.addressButton.setAttribute('aria-expanded', 'true');
        document.getElementById('address1').focus();
    }
    else {
        this.addressButton.setAttribute('aria-expanded', 'false');
    }
}

//init Nav
window.addEventListener('load', function () {
    new Nav(document.getElementById('nav'));
});