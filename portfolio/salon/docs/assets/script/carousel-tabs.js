/*
    Author: Aaron Evans
    Reference: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
    
    Desc: Script for implementing tabs element into webpage
*/

'use strict';

/*
    Helper functions for Component
*/

const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) ||
          (bottom > 0 && bottom < innerHeight)) &&
          ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

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
    Tablist Component Class
*/

//accepts tablist element as argument
function CarouselTabs (el) {
    //element refs
    this.carousel = el;
    this.tablist = el.querySelector('[role=tablist]');//tab element
    this.tabs = el.querySelectorAll('[role=tab]'); //list of tabs 
    this.tabPanels = [];//list of tabPanels
    this._next = el.querySelector('.next');

    //data
    this.idBase = this.tablist.id || 'tablist';
    this.firstTab = null;
    this.lastTab = null;
    this.selectedTab;
    this.firstLoad = true;
    this.halt = false;

    //state
    this.index = 0;//tab index

    if(el && this.tablist && this.tabs) {
        this.init();
    }
}

//tablist initialization funciton
CarouselTabs.prototype.init = function() {
    //set up tabs
    for (let i = 0; i < this.tabs.length; i++) {
        //hold onto current tab
        let tab = this.tabs[i];

        //add listener events
        tab.addEventListener('click', this.onClick.bind(this));
        tab.addEventListener('keydown', this.onKeydown.bind(this));

        //set first and last tabs
        if(!this.firstTab) {
            this.firstTab = tab;
        }
        this.lastTab = tab;

        //grab tabpanel
        this.tabPanels.push(document.getElementById(tab.getAttribute('aria-controls')));
    }

    this._next.addEventListener('click', this.next.bind(this));

    //set selected tab (default is first tab)
    this.selectTab(this.firstTab);
}

//on tab select
CarouselTabs.prototype.selectTab = function(newTab) {
    if(this.halt) {
        return;
    }
    else {
        this.halt = true;
        setTimeout(() => {
            this.halt = false;
        }, 500);
    }

    let tab = this.selectedTab;

    //remove attributes from old tab
    if(tab) {

        //reset aria-selected
        tab.setAttribute('aria-selected', 'false');

        //remove display from old tabpanel
        let tabpanel = this.tabPanels[indexOf(this.tabs, this.selectedTab)];
        tabpanel.classList.remove('display');
        tabpanel.classList.add('exit');

        setTimeout(() => {
            tabpanel.classList.remove('exit')
        }, 500);
    }

    //update selected tab
    this.selectedTab = newTab;
    tab = this.selectedTab;

    /* update attributes on current tab */

    //update aria-selected
    tab.setAttribute('aria-selected', 'true');

    //focus tab
    if(this.firstLoad) {
        this.firstLoad = false;
    } else {
        if(!elementIsVisibleInViewport(tab)) {
            tab.focus();
        }
    }
    

    //add display class to new tabpanel
    this.tabPanels[indexOf(this.tabs, this.selectedTab)].classList.add('display');
}

//next tab function
CarouselTabs.prototype.next = function() {
    if(this.selectedTab === this.lastTab) {
        this.selectTab(this.firstTab);
    }
    else {
        let index = indexOf(this.tabs, this.selectedTab);
        this.selectTab(this.tabs[index + 1]);
    }
}

//prev tab function
CarouselTabs.prototype.prev = function() {
    if(this.selectedTab === this.firstTab) {
        this.selectTab(this.lastTab);
    }
    else {
        let index = indexOf(this.tabs, this.selectedTab);
        this.selectTab(this.tabs[index - 1]);
    }
}

//select firs tab
CarouselTabs.prototype.homeTab = function() {
    this.selectTab(this.firstTab);
}

//select last tab
CarouselTabs.prototype.endTab = function() {
    this.selectTab(this.lastTab);
}

//tab click function
CarouselTabs.prototype.onClick = function(event) {
    this.selectTab(event.currentTarget);
}

//on key down
CarouselTabs.prototype.onKeydown = function (event) {
    //get action from key pressed
    const action = getActionFromKey(event);
    
    //if no action found, skip function
    if(action === -1) {
        return;
    }
    
    //put action into effect
    switch(action) {
        case SelectActions.First:
            this.selectTab(this.firstTab);
            break;
        case SelectActions.Last:
            this.selectTab(this.lastTab);
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
    new CarouselTabs(document.getElementById('carousel1'));
});