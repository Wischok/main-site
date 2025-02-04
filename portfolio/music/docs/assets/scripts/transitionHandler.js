/*
    Author: Aaron Evans
    description: handles transitions and loading different sections
    of webspage when nav menu button is selected
*/

"use strict";

//if is mobile / portrait orientation
function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

//data | current active section
var activeSection = document.getElementById('carousel');
var activeButton = document.getElementById('music');

//transition effects into loading in new section
function loadSection(section, event) {
    //if section already open, ignore
    if(!section.classList.contains('close')) {
        return;
    }

    //menu buttons
    let buttons = document.querySelectorAll('.menu-button');

    //keep all nav elements from being click during transition
    buttons.forEach((button) => {
        button.classList.add('no-pointer-events');
    });

    //if music section, close it out
    if(activeSection.classList.contains('carousel')) {
        if(activeSection.classList.contains('open')) {
            document.getElementById('music').click();
        }
    }

    //overlay out
    transitionOverlayIn();

    //switch sections
    setTimeout(() => {
        //button aria
        //if music, do different
        if(activeButton.id === 'music') {
            document.getElementById('home').setAttribute('aria-current', 'false');
            activeButton.setAttribute('aria-current', 'false');
        }
        else {
            activeButton.setAttribute('aria-current', 'false');
        }

        activeButton = event.target;


        //check if music or home
        if(activeButton.id === 'music') {
            document.getElementById('home').setAttribute('aria-current', 'true');
        }
        else {
            activeButton.setAttribute('aria-current', 'true');
        }

        //section display
        activeSection.classList.add('close');
        activeSection = section;
        activeSection.classList.remove('close');
    }, 1100);

    //overlay in
    setTimeout(() => {transitionOverlayOut()}, 1500);

    //keep all nav elements from being click during transition
    setTimeout(()=> {
        buttons.forEach((button) => {
            button.classList.remove('no-pointer-events');
        });
    }, 2350)

    //if there is an element focus destination, focus it
    if(event.target.hasAttribute('value-focus-next')) {
        document.getElementById(event.getAttribute('value-focus-next')).focus();
    }
    else { //otherwise, focus the section
        section.focus()
    }

    //set up aria-currents
    event.target.setAttribute('aria-current', true);
    
    if(isPortrait()) {
        if(activeButton.id === 'home' || 
            activeButton.id === 'shop' ||
            activeButton.id === 'touring'
        ) {
            document.getElementById('hamburger').focus()
        }
    }
}

//transition overlay in
function transitionOverlayIn() {
    document.getElementById('transition').classList.remove('slide-out');
    document.getElementById('transition').classList.add('slide-in');
}

//transition overlay out
function transitionOverlayOut() {
    document.getElementById('transition').classList.remove('slide-in');
    document.getElementById('transition').classList.add('slide-out');
}

function init() {
    //add event listeners
    document.querySelectorAll('.menu-button').forEach((button) => {
        if(button.hasAttribute('aria-controls')) {
            button.addEventListener('click', loadSection.bind(this, (document.getElementById(button.getAttribute('aria-controls')))));
        }
    });
}

window.addEventListener('load', function() {
    //init
    init();

    //remove overlay
    setTimeout(() => {
        document.getElementById('transition').classList.add('slide-out');
    }, 1800);
})