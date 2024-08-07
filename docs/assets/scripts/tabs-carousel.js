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

/*
    TablistCarousel Component Class
*/

//accepts tablist element as argument
function TablistCarousel (el) {
    //element refs
    this.tablist = el;//tab element
    this.tabs = el.querySelectorAll('[role=tab]'); //list of tabs 
    this.tabPanels = [];//list of tabPanels
    this.descriptions = [];//list of descriptions
    this.progressBar;

    //data
    this.idBase = this.tablist.id || 'tablist';
    this.firstTab = null;
    this.lastTab = null;
    this.selectedTab;

    //state
    this.index = 0;//tab index

    if(el && this.tablist && this.tabs) {
        this.init();
    }

    if(this.tablist.querySelector('[role=progressbar]')) {
        this.progressBar = new ProgressBar(this.tablist.querySelector('[role=progressbar]'), this);//injection of tablist into progress bar
    }
}

//tablist initialization funciton
TablistCarousel.prototype.init = function() {
    //set up tabs
    for (let i = 0; i < this.tabs.length; i++) {
        //hold onto current tab
        let tab = this.tabs[i];

        this.tabPanels.push(document.getElementById(tab.getAttribute('aria-controls')));
        this.descriptions.push(document.getElementById(this.tabPanels[i].getAttribute('aria-describedby')));

        //add listener events
        tab.addEventListener('click', this.onClick.bind(this));
        tab.addEventListener('keydown', this.onKeydown.bind(this));

        //set first and last tabs
        if(!this.firstTab) {
            this.firstTab = tab;
        }
        this.lastTab = tab;
    }

    //set selected tab (default is first tab)
    this.selectTab(this.firstTab);
}

//on tab select
TablistCarousel.prototype.selectTab = function(newTab) {
    let tab = this.selectedTab;

    //remove attributes from old tab
    if(tab) {

        //reset aria-selected
        tab.setAttribute('aria-selected', 'false');

        //remove display from old tabpanel
        this.tabPanels[indexOf(this.tabs, this.selectedTab)].classList.remove('display');
        this.descriptions[indexOf(this.tabs, this.selectedTab)].classList.remove('display');
    }

    //update selected tab
    this.selectedTab = newTab;
    tab = this.selectedTab;

    /* update attributes on current tab */

    //update aria-selected
    tab.setAttribute('aria-selected', 'true');

    this.index = indexOf(this.tabs, this.selectedTab);

    //add display class to new tabpanel
    this.tabPanels[this.index].classList.add('display');
    this.descriptions[this.index].classList.add('display');

    if(this.progressBar) {
        this.progressBar.setProgress(this.index);
    }
}

//next tab function
TablistCarousel.prototype.next = function() {
    if(this.selectedTab === this.lastTab) {
        this.selectTab(this.lastTab);
    }
    else {
        let index = indexOf(this.tabs, this.selectedTab);
        this.selectTab(this.tabs[index + 1]);
    }
}

//prev tab function
TablistCarousel.prototype.prev = function() {
    if(this.selectedTab === this.firstTab) {
        this.selectTab(this.firstTab);
    }
    else {
        let index = indexOf(this.tabs, this.selectedTab);
        this.selectTab(this.tabs[index - 1]);
    }
}

//select firs tab
TablistCarousel.prototype.homeTab = function() {
    this.selectTab(this.firstTab);
}

//select last tab
TablistCarousel.prototype.endTab = function() {
    this.selectTab(this.lastTab);
}

//tab click function
TablistCarousel.prototype.onClick = function(event) {
    this.selectTab(event.currentTarget);
}

//on key down
TablistCarousel.prototype.onKeydown = function (event) {
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

TablistCarousel.prototype.tabPanelsLength = function() {
    return this.tabPanels.length;
}

/*
    Progressbar component class
*/
function ProgressBar (bar, parent) {
    //element refs
    this.parent = parent;
    this.progressBar = bar;//progress bar
    this.pauseButton = document.getElementById(bar.getAttribute('pausebtn'));
    this.slides = document.querySelectorAll('.progressbar-slide');

    //data
    this.progress = 0;
    this.slideRequirement = 0 + (100 / (this.parent.tabPanels.length - 1));//required percentage for next slide
    this.intermission = false;
    this.slideDuration = 10;//in seconds
    this.step = ((100 / ((this.parent.tabPanels.length - 1) * this.slideDuration)) / 10);//generate step amount based on 8s slides
    this._interval;
    
    if(this.progressBar) {
        this.init();
    }
}

ProgressBar.prototype.init = function() {
    
    //set timed interval for ProgressBar
    this._interval = setInterval(this.interval.bind(this),100);
    
    this.pauseButton.addEventListener('click', this.toggle.bind(this));
}

ProgressBar.prototype.interval = function() {

    //if pause button is pressed, skip
    if(this.pauseButton.getAttribute('aria-pressed') === 'true') {
        return;
    }

    this.progress += this.step;
    if(this.progress >= 100) {//if progress bar complete
        this.progress = 100;
        this.progressBar.style.setProperty('--progress', this.progress);
        this.progressBar.setAttribute('value', this.progress);
        this.intermission = true;
        this.parent.selectTab(this.parent.lastTab);
        this.halt();
        return;
    }

    this.progressBar.style.setProperty('--progress', this.progress);
    this.progressBar.setAttribute('value', this.progress);

    //change slides based on percentage
    if(this.progress > this.slideRequirement) {
        this.parent.next();
    }
}

ProgressBar.prototype.halt = function() {
    clearInterval(this._interval);//halt bar progress

    //if bar completed, wait to start the bar again
    if(this.intermission) {
        this.progress = 0;
        this.slideRequirement = 0 + (100 / (this.parent.tabPanels.length - 1));
        this.intermission = false;
        setTimeout(() => {
            this.resume();
            this.parent.selectTab(this.parent.firstTab);
        }, (this.slideDuration * 1000));
    }
}

ProgressBar.prototype.resume = function() {
    this._interval = setInterval(this.interval.bind(this) ,100);
}

ProgressBar.prototype.toggle = function(e) {
    let btn = this.pauseButton;

    if(btn.getAttribute('aria-pressed') === 'false') {
        btn.setAttribute('aria-pressed', 'true');
    }
    else {
        btn.setAttribute('aria-pressed', 'false');
    }
}

ProgressBar.prototype.setProgress = function(value) {
    this.progress = (100 / (this.parent.tabPanels.length - 1)) * value;
    this.slideRequirement = (100 / (this.parent.tabPanels.length - 1)) * (value + 1);
}

//init tabs
window.addEventListener('load', function () {
    const elements = document.querySelectorAll('[role=tablist]');

    elements.forEach((el) => {
        if(!el.classList.contains('tabs-carousel')) {
            return;
        }

        new TablistCarousel(el)
    })
});