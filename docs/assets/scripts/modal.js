/*
    Author: Aaron Evans
    Desc: modal functionality
*/

"use strict";

//get index of item from an array
function indexOf(array, key) {
    for(let i = 0; i < array.length; i++) {
        if(array[i] === key) {
            return i;
        }
    }

    return -1;
}

function Dialog (el) {
    //element refs
    this.dialog = el;//dialog element
    this.triggers = document.querySelectorAll("[aria-controls=" + el.id + "]")
    this.exit = document.getElementById(el.id + "_exit");//exit
    this.backdrop = el.querySelector('.backdrop');//backdrop exit
    this.formGroups = el.querySelectorAll('.forms');

    //service
    this.index = 0;//default service selection
    // 0 = web design / 1 = SEO / 2 = Accessibility / 3 = Maintenance

    if(el) {
        this.init();
    }

    function RadioGroup (el, dialog) {
        //element refs
        this.group = el;//radio group
        this.dialog = dialog;
        this.radios = el.querySelectorAll('[role=radio]');

        this.radio = this.radios[0];
        this.index = 0;

        this.init();
    }

    RadioGroup.prototype.init = function() {
        this.radios.forEach((radio) => {
            radio.addEventListener('click', this.select(radio));
            radio.addEventListener('focusin', this.onFocus(radio));
            radio.addEventListener('blur', this.onBlur(radio));
        })
    }

    RadioGroup.prototype.select = function(r) {
        this.radio.setAttribute('aria-checked', 'false');
        this.radio = r;
        this.radio.setAttribute('aria-checked', 'true');

        this.index = indexOf(this.radios, this.radio);
    }

    RadioGroup.prototype.next = function() {
        //ignore if at end
        if((this.index + 1) > (this.radios.length - 1)) {
            return;
        }

        this.index = this.index + 1;
        this.select(this.radios[this.index]);
    }

    RadioGroup.prototype.prev = function() {
        //ignore if at begin
        if((this.index - 1) < 0) {
            return;
        }

        this.index = this.index - 1;
        this.select(this.radios[this.index]);
    }

    RadioGroup.prototype.onFocus = function(r) {
        r.addEventListener('keydown', this.keyDown(r));
    }

    RadioGroup.prototype.onBlur = function(r) {
        r.removeEventListener('keydown', this.keyDown(r));
    }

    RadioGroup.prototype.keyDown = function(radio,e) {
        if(e.key === "Space") {
            this.select(radio);
            return;
        }

        //prev and next buttons
        if(e.key === 'ArrowRight') {
            this.next();
            return;
        }

        if(e.key === 'ArrowLeft') {
            this.prev();
            return;
        }
    }
}

//dialog int
Dialog.prototype.init = function() {
    this.triggers.forEach((trigger) => {
        trigger.addEventListener('click', this.open.bind(this));
    });
    
    this.exit.addEventListener('click', this.close.bind(this));
    this.backdrop.addEventListener('click', this.close.bind(this));

    //set up radio groups
    const rGroups = document.querySelectorAll('[role=radiogroup]');
    rGroups.forEach((el) => {
        new RadioGroup(el, this.dialog);
    })
}

//radioGroup interactions
Dialog.

//open dialog
Dialog.prototype.open = function() {
    this.dialog.classList.add("active");
}

//close dialog
Dialog.prototype.close = function() {
    this.dialog.classList.remove("active");
}

//init
window.addEventListener('load', function () {
    const elements = document.querySelectorAll('[role=dialog]');

    elements.forEach((el) => {
        new Dialog(el);
    })
});