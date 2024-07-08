/*
    Author: Aaron Evans
    description: carousel for music website | record slider
*/

"use strict";

/* Useful functions for carousel */

//get index of item from an array
function indexOf(array, key) {
    for(let i = 0; i < array.length; i++) {
        if(array[i] === key) {
            return i;
        }
    }

    return -1;
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

//Carousel 'class'
function Carousel (el) {
    //instance
    this.instance = this;

    //element refs
    this.carousel = el;
    this.mute = document.getElementById('carousel-mute');//mute carousel music
    this.exit = document.getElementById('carousel-exit');//exit carousel
    this._prev = document.querySelector('.prev');
    this._next = document.querySelector('.next');
    this.trigger = document.getElementById('music');
    this.disableAnimation = document.getElementById('carousel-animation');
    this.records = this.carousel.querySelectorAll('.carousel-item');
    this.recordsParent = document.getElementById('carousel-items');
    this.recordsParent2 = document.getElementById('rotation2');
    this.title =  document.getElementById('song-title');
    this.menuButtons = document.querySelectorAll('.menu-button');

    //data
    this.activeRecord = null;
    this.theta = 0;
    this.noRotate = false;
    this.noRotate2 = false;

    //init
    if(el && this.mute && this.exit && this._prev && this._next
        && this.trigger && this.records && this.recordsParent
    ) {
        this.init();
    }
    else {
        console.log('error: couldnt load carousel');
    }
};

Carousel.prototype.init = function () {
    //set event listeners
    this.mute.addEventListener('click', this.onMute.bind(this));
    this.exit.addEventListener('click',this.close.bind(this));
    this.trigger.addEventListener('click', this.open.bind(this));
    this._prev.addEventListener('click', this.next.bind(this));
    this._next.addEventListener('keydown', this.keyboardTrap.bind(this));
    this.exit.addEventListener('keydown', this.keyboardTrap.bind(this));
    this.carousel.addEventListener('keydown', this.onKeyDown.bind(this));

    //prev and next functions are switched on buttons due to records orientation
    this._next.addEventListener('click', this.prev.bind(this));
    
    //disable animations button
    if(this.disableAnimation) {
        this.disableAnimation.addEventListener('click', this.disableAnimation.bind(this));
    }
    else {
        console.log('error: disable animation button not loaded')
    }

    //start rotation animation
    setInterval(function(carousel) {
        if(carousel.noRotate) {
            return;
        }

        if(isPortrait()) {
            return;
        }
        
    
        let tick = 3 / 20;
        carousel.theta += tick;
    
        //set angle
        carousel.recordsParent.style.webkitTransform = 'rotate('+carousel.theta+'deg)'; 
        carousel.recordsParent.style.mozTransform    = 'rotate('+carousel.theta+'deg)'; 
        carousel.recordsParent.style.msTransform     = 'rotate('+carousel.theta+'deg)'; 
        carousel.recordsParent.style.oTransform      = 'rotate('+carousel.theta+'deg)'; 
        carousel.recordsParent.style.transform       = 'rotate('+carousel.theta+'deg)'; 
    }, 50, this.instance)

    //mobile
    if(isPortrait()) {
        this.theta = 45;
        this.activeRecord = this.records[5];
    }
};

Carousel.prototype.select = function (record) {
    //remove active class if record already active
    if(this.activeRecord) {
        this.activeRecord.classList.remove('active');
    }

    //add active class to record
    this.activeRecord = record;
    this.activeRecord.classList.add('active');

    //set music title
    this.title.innerHTML = this.activeRecord.getAttribute('value-title')

    //set song links
    // won't be done in portfolio version
}

Carousel.prototype.resetMenuButtons = function(event) {
    let flag = false;

    //flag carousel to pause before expanding if coming from another page section
    if(event.target.hasAttribute('aria-current')) {
        if(event.target.getAttribute('aria-current') === 'true') {
            if(event.target.id === 'shop' || event.target.id === 'touring')
            flag = true;
        }
    }

    return flag;
}

//open Carousel
Carousel.prototype.open = function () {
    //check if already expanded
    if(this.trigger.getAttribute('aria-pressed') === 'true') {
        this.close();
        return;
    }

    //stop open, wait, and run again if another section of page is already expanded
    let flag = this.resetMenuButtons(event);
    if(flag) {
        setTimeout((carousel) => {
            carousel.open();
        }, 2200, this);
        return;
    }

    //remove classes
    this.carousel.classList.add('open');
    if(this.activeRecord) {
        this.activeRecord.classList.add('active');
    }

    //set aria
    this.trigger.setAttribute('aria-pressed', 'true');
    this.carousel.setAttribute('aria-expanded', 'true');
    this.trigger.setAttribute('aria-current', 'true');

    //focus exit button first
    this.exit.focus();

    //skip the rest if on portrait
    if(isPortrait()) {
        return;
    }

    //remove active from all records
    this.records.forEach((record) => {
        record.classList.remove('active');
    })

    //rotation adjustments
    this.activeRecord = this.findRecord();

    this.noRotate = true;

    //select record
    this.select(this.activeRecord);
}

//close Carousel
Carousel.prototype.close = function () {
    //remove classes
    this.carousel.classList.remove('open');

    //set aria
    this.trigger.setAttribute('aria-pressed', 'false');
    this.carousel.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-current', 'false');

    //if mobile, skip remaining steps and perform others
    if(isPortrait()) {
        document.getElementById('hamburger').focus();
        return;
    }

    //reset carousel
    this.activeRecord = null;
    this.noRotate = false;

    //set focus back to trigger
    document.getElementById('home').focus();
}

//toggle Carousel music sound | mute
Carousel.prototype.onMute = function () {
    if(this.mute.getAttribute('aria-pressed') === 'false') {
        this.mute.setAttribute('aria-pressed', 'true');
    }
    else {
        this.mute.setAttribute('aria-pressed', 'false');
    }
}

//previous record in carousel
Carousel.prototype.prev = function () {
    let i = indexOf(this.records, this.activeRecord);

    //skip going to previous record if already at the end of records
    if(i <= 0) {
        i = 8;
    }

    i = i - 1;
    this.theta += 45;
    this.rotationAdjustment(this.theta);

    //select previous record
    this.select(this.records[i]);
}

//next record in carousel
Carousel.prototype.next = function () {
    let i = indexOf(this.records, this.activeRecord);

    //skip going to next record if already at the end of records
    if(i >= (this.records.length - 1)) {
        i = -1;
    }
    
    i = i + 1;
    this.theta -= 45;
    this.rotationAdjustment(this.theta);
    
    //select next record
    this.select(this.records[i]);
}

//handle keydown events for carousel
Carousel.prototype.onKeyDown = function(event) {
    if(this.carousel.getAttribute('aria-expanded') === 'false') {
        return;
    }

    const {key} = event;

    if(key === 'ArrowRight') {
        this.next();
        event.stopDefault();
        return;
    }

    if(key === 'ArrowLeft') {
        this.prev();
        event.stopDefault();
        return;
    }

    if(key === 'Escape') {
        this.close()
        event.stopDefault();
        return;
    }
}

//determine the currently most exposed record based on rotation
//rotations will seem off from normal. This is due to the record 1
//not showing at 0deg, rather, is shows at 42deg
Carousel.prototype.findRecord = function () {
    let angle2 = null;
    let angle = this.theta % 360;

    if (angle < 0) {
        angle2 = angle;
        angle = angle + 360;
    }

    //create degree offset 0deg and 360 deg
    let offset = -3 - (45 / 2);
    let circleStart = 0 + offset;

    //8 records exits. move 45 deg (1/8) of the circle at a time
    //to determine which angle the circle is currently in
    //after finding current angle, return corresponding record
    let i = 1;//keep track of index
    for(let theta = circleStart; theta <= 360; theta += 45) {
        if(angle >= theta && angle <= (theta + 45)) {

            if(i < 0) {
                //acount for the chance it'll be in between 357deg and 360deg
                if(i < -6) {
                    i = -6;
                }
                i += 8;
            }

            //temp adjustment to remove double negative issue
            if(angle2) {
                theta -= 360;
            }

            //find center and adjust
            theta += 3;
            let center = theta + 22.5;
            let adjustment = center - (this.theta % 360);
            adjustment = (this.theta + adjustment) - 3;
            
            
            this.theta = adjustment;
            this.rotationAdjustment(adjustment);

            return this.records[i];
            
        }
        i--;
    }
    

    console.log(this.theta);
    console.log(i + ' is the index. Error: not found.');
    return this.records[0];
}

//rotation function
Carousel.prototype.rotate = function () {
    if(this.noRotate) {
        return;
    }

    if(this.rotate2) {
        return;
    }

    let tick = 3 / 20;
    this.theta += tick;

    //set angle
    this.recordsParent.style.webkitTransform = 'rotate('+this.theta+'deg)'; 
    this.recordsParent.style.mozTransform    = 'rotate('+this.theta+'deg)'; 
    this.recordsParent.style.msTransform     = 'rotate('+this.theta+'deg)'; 
    this.recordsParent.style.oTransform      = 'rotate('+this.theta+'deg)'; 
    this.recordsParent.style.transform       = 'rotate('+this.theta+'deg)'; 
}


//adjusts the records rotation for smoother animations
Carousel.prototype.rotationAdjustment = function (deg) {
    if(isPortrait()) {
        //if mobile / portrait, do choose different angle source
        this.recordsParent2.style.webkitTransform = 'rotate('+deg+'deg)'; 
        this.recordsParent2.style.mozTransform    = 'rotate('+deg+'deg)'; 
        this.recordsParent2.style.msTransform     = 'rotate('+deg+'deg)'; 
        this.recordsParent2.style.oTransform      = 'rotate('+deg+'deg)'; 
        this.recordsParent2.style.transform       = 'rotate('+deg+'deg)'; 
        return;
    }


    //set angle
    this.recordsParent.style.webkitTransform = 'rotate('+deg+'deg)'; 
    this.recordsParent.style.mozTransform    = 'rotate('+deg+'deg)'; 
    this.recordsParent.style.msTransform     = 'rotate('+deg+'deg)'; 
    this.recordsParent.style.oTransform      = 'rotate('+deg+'deg)'; 
    this.recordsParent.style.transform       = 'rotate('+deg+'deg)'; 
}

//toggle carousel animations
Carousel.prototype.disableAnimation = function () {
    //toggle button
    if(this.disableAnimation.getAttribute('aria-pressed') === 'false') {
        this.disableAnimation.setAttribute('aria-pressed', 'true');
    }
    else {
        this.disableAnimation.setAttribute('aria-pressed', 'false')
    }

    //set animation classes
}

//keyboard trap while expanded
Carousel.prototype.keyboardTrap = function(event) {
    if(this.carousel.getAttribute('aria-expanded') === 'false') {
        return;
    }

    const {key, shiftKey} = event;
    
    if(shiftKey && key === "Tab") {
        if(event.target === this.exit) {
            this._next.focus();
            event.preventDefault();
            return;
        }
    }

    if(key === "Tab" && !shiftKey) {
        if(event.target === this._next) {
            this.exit.focus();
            event.preventDefault();
            return;
        }
    }
}

Carousel.prototype.resize = function() {
    //stop rotations if on smaller screen size
    if(window.innerWidth < window.innerHeight) {
        this.noRotate2 = true;
    }
    else {
        this.noRotate2 = false;
    }
}

//init window
window.addEventListener('load', function() {
    new Carousel(this.document.getElementById('carousel'));
});