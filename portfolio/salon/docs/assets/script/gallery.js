/*
    Author: Aaron Evans
    Desc: gallery class that handles the images of the 
    website expanding and contracting on the gallery webpage
*/

'use strict';

//get index of item from an array
function indexOf(array, key) {
    for(let i = 0; i < array.length; i++) {
        if(array[i] === key) {
            return i;
        }
    }

    return -1;
}


// Gallery prototype
function Gallery(el) {
    // references
    this.gallery = el;
    this.images = el.querySelectorAll('button');
    this.expandedImageEl = document.getElementById('expanded-image');
    this.backdrop = null;
    this._exit = null;
    this._prev = null;
    this._next = null;
    this.expandedImage = null;
    

    //data
    this.trigger = null;
    this.firstImage = null;
    this.lastImage = null;

    // initialize
    if(el) {
        this.init();
    }
}

Gallery.prototype.init = function() {
    if(this.expandedImageEl) {
        this.backdrop = this.expandedImageEl.querySelector('.backdrop');
        this.expandedImage = this.expandedImageEl.querySelector('img');
        this._exit = this.expandedImageEl.querySelector('.exit');
        this._prev = this.expandedImageEl.querySelector('.prev');
        this._next = this.expandedImageEl.querySelector('.next');
    }

    this.images.forEach((image) => {
        image.addEventListener('click', this.open.bind(this));

        if(!this.firstImage) {
            this.firstImage = image;
        }
        this.lastImage = image;
    });

    this._exit.addEventListener('click', this.exit.bind(this));
    this._next.addEventListener('click', this.next.bind(this));
    this._prev.addEventListener('click', this.prev.bind(this));
    this._next.addEventListener('keydown', this.keyBoardTrapNext.bind(this));
    this._exit.addEventListener('keydown', this.keyBoardTrapPrev.bind(this));
}

//exit image
Gallery.prototype.exit = function() {
    //hide expanded image
    this.expandedImageEl.classList.remove('display');

    //go back to image that initiated the modal
    this.trigger.focus()
}

//open expanded image
Gallery.prototype.open = function(event) {
    //set image
    this.selectImage(event.target);

    //display expanded image
    this.expandedImageEl.classList.add('display');

    //focus exit button
    this._exit.focus();
}

Gallery.prototype.selectImage = function(imageButton) {
    if(this.trigger) {
        this.trigger.setAttribute('aria-expanded', 'false')
    }

    this.trigger = imageButton;
    this.trigger.setAttribute('aria-expanded', 'true');
    let image = imageButton.querySelector('img');

    //display
    this.expandedImage.setAttribute('src', image.getAttribute('src'));
    this.expandedImage.setAttribute('alt', image.getAttribute('alt'));
}

Gallery.prototype.next = function(event) {
    if(this.trigger === this.lastImage) {
        this.selectImage(this.firstImage);
    }
    else {
        this.selectImage(this.images[indexOf(this.images, this.trigger) + 1]);
    }
}

Gallery.prototype.prev = function() {
    if(this.trigger === this.firstImage) {
        this.selectImage(this.lastImage);
    }
    else {
        this.selectImage(this.images[indexOf(this.images, this.trigger) - 1]);
    }
}

Gallery.prototype.keyBoardTrapPrev = function(event) {
    const {key, shiftKey} = event;

    if(key === "Tab" && shiftKey) {
        this._next.focus();
        event.preventDefault();
    }
}

Gallery.prototype.keyBoardTrapNext = function(event) {
    const {key, shiftKey} = event;

    if(key === "Tab" && !shiftKey) {
        this._exit.focus();
        event.preventDefault();
    }
}

// initialize gallery
window.addEventListener('load', function() {
    
    new Gallery(document.getElementById('gallery'))
})
