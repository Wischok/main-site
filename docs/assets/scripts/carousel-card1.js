/*
    Author: Aaron Evans
    Reference: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
    
    Desc: Script for implementing tabs element into webpage
*/

'use strict';

/*
    Helper functions for Component
*/

//Select Actions
var SelectActions = {
    First: 0,
    Last: 1,
    Next: 2,
    Previous: 3,
}

//map a key press to an action
function getActionFromKey(event) {
    const {key, shiftkey} = event;

    //home and end buttons
    if (key === 'Home') {
        return SelectActions.First;
    }
    if (key === 'End') {
        return SelectActions.Last;
    }

    //prev and next buttons | escape and delete (works same as next)
    if(key === 'ArrowRight' || key === 'Escape' || key === 'Delete') {
        return SelectActions.Next;
    }
    if(key === 'ArrowLeft') {
        return SelectActions.Previous;
    }

    //shift + 10 | opens associated popup menu

    return -1;
}

//get index of item from an array
function indexOf(array, key) {
    for(let i = 0; i < array.length; i++) {
        if(array[i] === key) {
            return i;
        }
    }

    return -1;
}

//

/*
    Carousel Component Class
*/

//accepts Carousel element as argument
function Carousel (el) {
    //element refs
    this.carousel = el;//tab element
    this.slides = el.querySelectorAll('[role=group]');//list of tabPanels
    this.btnPrev = document.getElementById('carousel_prev1');
    this.btnNext = document.getElementById('carousel_prev2');

    //data
    this.idBase = this.carousel.id || 'Carousel';
    this.firstSlide = null;
    this.lastSlide = null;
    this.selectedSlide;

    //state
    this.index = 0;//tab index

    if(el && this.slides && this.btnPrev && this.btnNext) {
        this.init();
    }
}

//Carousel initialization funciton
Carousel.prototype.init = function() {
    this.firstSlide = this.slides[0];
    this.lastSlide = this.slides[this.slides.length - 1];

    //set up tabs
    for (let i = 0; i < this.slides.length; i++) {
        //hold onto current tab
        let slide = this.slides[i];

        //set first and last tabs
        if(!this.firstSlide) {
            this.firstSlide = slide;
        }
        this.lastSlide = slide;
    }

    this.btnPrev.addEventListener('keydown',this.onKeydown.bind(this));
    this.btnPrev.addEventListener('click',this.prev.bind(this));
    this.btnNext.addEventListener('keydown', this.onKeydown.bind(this));
    this.btnNext.addEventListener('click', this.next.bind(this));


    //set selected tab (default is first tab)
    this.selectSlide(this.firstSlide);
}

//on Slide select
Carousel.prototype.selectSlide = function(newSlide) {
    //disable old slide
    if(this.selectedSlide) {
        let oldIndex = indexOf(this.slides, this.selectedSlide);
        this.slides[oldIndex].setAttribute('aria-selected', 'false');
        this.carousel.classList.remove('slide' + (oldIndex + 1));
    }

    //get new index
    let index = indexOf(this.slides, newSlide);

    //add current slide class and aria
    this.slides[index].setAttribute('aria-selected', 'true');
    this.carousel.classList.add('slide' + (index + 1));
    this.selectedSlide = this.slides[index];
}

//next slide function
Carousel.prototype.next = function() {
    if(this.selectedSlide === this.lastSlide) {
        this.selectSlide(this.lastSlide);
    }
    else {
        let index = indexOf(this.slides, this.selectedSlide);
        this.selectSlide(this.slides[index + 1]);
    }
}

//prev slide function
Carousel.prototype.prev = function() {
    if(this.selectedSlide === this.firstSlide) {
        this.selectSlide(this.firstSlide);
    }
    else {
        let index = indexOf(this.slides, this.selectedSlide);
        this.selectSlide(this.slides[index - 1]);
    }
}

//select firs tab
Carousel.prototype.homeTab = function() {
    this.selectSlide(this.firstSlide);
}

//select last tab
Carousel.prototype.endTab = function() {
    this.selectSlide(this.lastSlide);
}

//on key down
Carousel.prototype.onKeydown = function (event) {
    //get action from key pressed
    const action = getActionFromKey(event);
    
    //if no action found, skip function
    if(action === -1) {
        return;
    }
    
    //put action into effect
    switch(action) {
        case SelectActions.First:
            this.selectSlide(this.firstSlide);
            break;
        case SelectActions.Last:
            this.selectSlide(this.lastSlide);
            break;
        case SelectActions.Previous:
            this.prev();
            break;
        case SelectActions.Next:
            this.next();
            break;
        default:
            break;
    }

    event.stopPropagation();
    event.preventDefault();
}

//init tabs
window.addEventListener('load', function () {
    const element = document.getElementById('carousel-tri1');
    new Carousel(element);
});