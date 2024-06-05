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

    function RadioGroup (el, dialog) {
        //element refs
        this.group = el;//radio group
        this.dialog = dialog;
        this.radios = el.querySelectorAll('[role=radio]');

        this.init();
    }

    RadioGroup.prototype.init = function() {
        this.radios.forEach((radio) => {
            radio.addEventListener('click', this.onClick.bind(this));
            radio.addEventListener('keydown', this.onKeyDown.bind(this));

            if(radio.getAttribute('aria-checked') === 'true') {
                this.radio = radio;
            }
        })

        this.index = indexOf(this.radios, this.radio);
    }

    RadioGroup.prototype.select = function(r) {
        this.radio.setAttribute('aria-checked', 'false');
        this.radio = r;
        this.radio.setAttribute('aria-checked', 'true');
        this.index = indexOf(this.radios, this.radio);

        //select form
        this.dialog.selectService(indexOf(this.radios, this.radio));
    }

    RadioGroup.prototype.onClick = function(event) {
        let r = event.target;
        this.select(r);
    }

    RadioGroup.prototype.next = function() {
        //ignore if at end
        if((this.index + 1) > (this.radios.length - 1)) {
            return;
        }

        this.radios[this.index + 1].focus();
        this.index += 1;
    }

    RadioGroup.prototype.prev = function() {
        //ignore if at begin
        if((this.index - 1) < 0) {
            return;
        }

        this.radios[this.index - 1].focus();
        this.index -= 1;
    }

    RadioGroup.prototype.onKeyDown = function(event) {
        const {key} = event;

        if(key === " ") {
            this.select(event.target);
            return;
        }

        //prev and next buttons
        if(key === 'ArrowRight') {
            this.next();
            return;
        }

        if(key === 'ArrowLeft') {
            this.prev();
            return;
        }
    }

    //element refs
    this.dialog = el;//dialog element
    this.triggers = document.querySelectorAll(".modal1_trigger");
    this.exit = document.getElementById(el.id + "_exit");//exit
    this.backdrop = document.getElementById(this.dialog.id + '-backdrop');//backdrop exit
    this.firstElement = document.getElementById(this.dialog.getAttribute('value-focus-first'));
    this.formGroups = el.querySelectorAll('.forms');
    this.continueButton = document.getElementById('modal1-continue');
    this.submitButton = document.getElementById('modal1-submit');
    this.stepButtons = document.getElementById('modal1-steps').querySelectorAll('button');
    //set up radio groups
    document.querySelectorAll('[role=radiogroup]').forEach((el) => {
        let t = new RadioGroup(el, this);
    })

    //data
    this.trigger = null;
    this.formGroup = null;
    this.activeForm = null;
    this.firstForm = null;
   
    //formIndex
    this.index = 0;//first form
    this.s_index = 0;//default service selection
    // 0 = web design / 1 = SEO / 2 = Accessibility / 3 = Maintenance

    if(el) {
        this.init();
    }
}

//dialog int
Dialog.prototype.init = function() {
    document.querySelectorAll("." + this.dialog.id + "-trigger").forEach((trigger) => {
        trigger.addEventListener('click', this.open.bind(this));
    });
    
    this.exit.addEventListener('click', this.close.bind(this));
    this.backdrop.addEventListener('click', this.close.bind(this));
    this.dialog.addEventListener('keydown', this.onKeyDown.bind(this));
    this.submitButton.addEventListener('click', this.onSubmit.bind(this));
    this.continueButton.addEventListener('click', this.onContinue.bind(this));

    this.formGroup = this.formGroups[0];//web design form group by default
    this.firstForm = document.getElementById('form1')
    this.activeForm = this.firstForm;

    this.stepButtons.forEach((button) => {
        button.addEventListener('click', this.onStepSelect.bind(this));
    });
}

//open dialog
Dialog.prototype.open = function(event) {
    this.dialog.classList.add("active");

    this.trigger = event.target;
    this.dialog.querySelectorAll('[role=form]').forEach((form) => {
        if(form.classList.contains('active')) {
            document.getElementById(form.getAttribute('value-focusNext')).focus();
            return;
        }
    });
}

//close dialog
Dialog.prototype.close = function() {
    this.dialog.classList.remove("active");
    this.trigger.focus();
}

//select form
Dialog.prototype.selectForm = function(form) {
    let forms = this.formGroup.querySelectorAll('[role=form]');

    //switch buttons if on final form
    if((this.index) >= forms.length) {
        this.continueButton.classList.remove('active');
        this.submitButton.classList.add('active');
    }
    else {
        this.continueButton.classList.add('active');
        this.submitButton.classList.remove('active');
    }

    this.activeForm.classList.remove('active');
    this.activeForm = form;
    this.activeForm.classList.add('active');

    //focus first element on form
    document.getElementById(this.activeForm.getAttribute('value-focusNext')).focus();

    //top button controls
    this.stepButtons.forEach((button) => {
        button.removeAttribute('aria-current');
        button.classList.remove('active');
    });
    for(let i = 0; i <= this.index; i++) {
        this.stepButtons[i].classList.add('active');
    }
    this.stepButtons[this.index].setAttribute('aria-current', 'step');
}

//key down
Dialog.prototype.onKeyDown = function(event) {
    const {key} = event;

    if(key === 'Escape') {
        this.close();
    }
}

Dialog.prototype.selectService = function(index) {
    this.formGroup = this.formGroups[index];//swap service

    if((this.formGroup.querySelectorAll('[role=form]').length + 1) < this.stepButtons.length) {
        this.stepButtons[this.stepButtons.length - 1].setAttribute('aria-disabled', 'true');
    }
    else {
        this.stepButtons[this.stepButtons.length - 1].setAttribute('aria-disabled', 'false');
    }
}

//select steps in form
Dialog.prototype.onStepSelect = function(e) {
    //determine form and index
    let btnIndex = (this.stepButtons) ? indexOf(this.stepButtons, e.target) : 
    indexOf(document.getElementById('modal1-steps').querySelectorAll('button'), e.target);
    if(btnIndex === this.index) {return;}//skip function if on current form

    this.index = btnIndex;

    if(this.index === 0) {
        this.selectForm(this.firstForm);
    }
    else {
        this.selectForm(this.formGroup.querySelectorAll('[role=form]')[this.index - 1]);
    }
}

//continue button
Dialog.prototype.onContinue = function(event) {
    let forms = this.formGroup.querySelectorAll('[role=form]');
    this.index++;
    this.selectForm(forms[this.index - 1]);
}

//submit button
Dialog.prototype.onSubmit = function(event) {
    console.log('submitted');
}

//init
window.addEventListener('load', function () {
    const elements = document.querySelectorAll('[role=dialog]');

    elements.forEach((el) => {
        new Dialog(el);
    })
});