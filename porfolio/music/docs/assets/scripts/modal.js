/*
    Author: Aaron Evans
    desc: modal controls
*/

"use strict";

function Dialog (el) {
    //element references
    this.dialog = el;
    this.exit = document.getElementById('dialog1_exit');
    this.submit = document.getElementById('dialog1_submit');
    this.trigger = document.getElementById('subscribe');
    this.thanks = document.getElementById('dialog1_thankyou');
    this.form = document.getElementById('dialog1_form');
 
    this.init();
};

//dialog initialization function
Dialog.prototype.init = function() {
    //add event listeners
    this.exit.addEventListener('click', this.close.bind(this));
    this.trigger.addEventListener('click', this.open.bind(this));
    //keyboard trap event listeners
    this.submit.addEventListener('keydown', this.keyboardTrapNext.bind(this, this.exit));
    this.exit.addEventListener('keydown', this.keyboardTrapPrev.bind(this, this.submit));
    this.form.addEventListener('submit', this.submitForm.bind(this));
}

//open dialog
Dialog.prototype.open = function () {
    this.dialog.classList.add('open');
    this.exit.focus();
}

//close
Dialog.prototype.close = function() {
    this.dialog.classList.remove('open');

    if(window.innerHeight > window.innerWidth) {
        document.getElementById('hamburger').focus();
    }
    else {
        this.trigger.focus();
    }
    
}

Dialog.prototype.keyboardTrapNext = function(element, event) {
    const {key,shiftKey} = event;
    if(key === 'Tab' && !shiftKey) {
        element.focus();
        event.preventDefault();
    }
}

Dialog.prototype.keyboardTrapPrev = function(element, event) {

    const {key, shiftKey} = event;
    if(shiftKey && key === "Tab") {
        element.focus();
        event.preventDefault();
    }
}

//submition api
Dialog.prototype.submitForm = function(event) {
    //this is a portfolio website, only a message will display upon submission
    this.dialog.classList.add('submit');
    this.exit.focus();
    event.preventDefault();
}

window.addEventListener('load', function() {
    new Dialog(document.getElementById('dialog1'));
});