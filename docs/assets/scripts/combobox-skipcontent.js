/*

Portfolio Index Page
Author: Aaron Evans
Referenced Source: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

Description: Code for an accessible combobox element. 
This is a non form version of combobox that is not meant for
saving selection

*/
"use strict";

/*
    Helper Functions and Input Management
*/

//Save a list of actions for various UI elements
//each HTML interactive element functions off of these user actions
const SelectActions_Combo = {
    Close: 0,//escape
    CloseSelect: 1,
    First: 2,
    Last: 3,
    Next: 4,
    Open: 5,
    PageDown: 6,
    PageUp: 7,
    Previous: 8,
    Select: 9,
    Type: 10,
};

/*
    Helper Functions
*/

var event = 5;//naturally set event to open

// map a key press to an action
//when 'event', 'evt', or 'e' are used in a functinon 
//it is automatically passed to event handlers to provide extra features and information
function getActionFromKey(event, menuOpen) {
    const {key, altKey, ctrlKey, metaKey} = event;//store key information
    const openKeys = ['Enter', 'ArrowDown', 'ArrowUp', ' '];//all the keys that will cause combo box to expand

    //handle opening when closed
    if(openKeys.includes(key) && !menuOpen) {
        return SelectActions_Combo.Open;
    }

    //home and end move he selected option when open or closed
    if(key === "Home") {
        return SelectActions_Combo.First;
    }
    if(key === "End") {
        return SelectActions_Combo.Last;
    }

    //handle typing characters when open or closed
    if(//if any key, number, or symbal is pressed
        key === 'Backspace' ||
        key === 'Clear' ||
        (key.length === 1 && key != ' ' && !altKey && !ctrlKey && !metaKey)
    ) {
        return SelectActions_Combo.Type;
    }

    //handle keys when open
    if(menuOpen) {
        if(key === 'ArrowUp' && altKey) {
            return SelectActions_Combo.CloseSelect;
        } else if (key === 'ArrowDown' && !altKey) {
            return SelectActions_Combo.Next;
        } else if (key === 'ArrowUp') {
            return SelectActions_Combo.Previous;
        } else if (key === 'PageUp') {
            return SelectActions_Combo.PageUp;
        }else if (key === 'PageDown') {
            return SelectActions_Combo.PageDown;
        }else if (key === 'Escape') {
            return SelectActions_Combo.Close;
        }else if (key === 'Enter' || key === ' ') {
            return SelectActions_Combo.Select;
        }
    }
};

// return the index of an option from an array of options, based on a search string
// if the filter is multiple iterations of the same letter (e.g "aaa"), then cycle through first-letter matches
function getIndexByLetter(options, filter, startIndex = 0) {
    const orderedOptions = {
        ...options.slice(startIndex),//iterate through options and slice to the start index
        ...options.slice(0, startIndex),//iterate through options and slice to the start index
    };

    //grab the firstMatch, if present, when filtering key press against combobox array options
    const firstMatch = filterOptions(orderedOptions, filter)[0];

    //a function named allSameLetter that takes an array as a parameter
    //every method below tests whether the elemts in the array pass the test provided
    const allSameLetter = (array) => array.every((letter) => letter === array[0]);

    //first check if there is an exact match for the typed string
    if (firstMatch) {//if match exists
        return options.indexOf(firstMatch);
    }

    //if the same letter is being repeated, cycle through first letter matches
    else if (allSameLetter(filter.split(''))) {
        const matches = filterOptions(orderedOptions, filter[0]);
        return options.indexOf(matches[0]);
    }

    //if no matches, return -1
    else {
        return -1;
    }
};

//get an updated option index after performing an action
function getUpdatedIndex(currentIndex, maxIndex, action) {
    const pageSize = 4; //used for pageup/pagedown

    switch(action) {
        case SelectActions_Combo.First:
            return 0;
        case SelectActions_Combo.Last:
            return maxIndex
        case SelectActions_Combo.Previous:
            return Math.max(0, currentIndex - 1);
        case SelectActions_Combo.Next:
            return Math.min(maxIndex, currentIndex + 1);
        case SelectActions_Combo.PageUp:
            return Math.max(0, currentIndex - pageSize);
        case SelectActions_Combo.PageDown:
            return Math.min(maxIndex, currentIndex + pageSize);
        default:
            return currentIndex;
    }
};

//check if element is visible in browser view port
function isElementInView(element) {
    var bounding  = element.getBoundingClientRect();

    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
};

//check if an element currently scrollable
function isScrollable(element) {
    return element && element.clientHeight < element.scrollHeight;
}

//ensure a given child element is within the parent's visible scroll area
//if the child is not visible, scroll the parent
function maintainScrollVisibility(activeElement, scrollParent) {
    const {offsetHeight, offsetTop} = activeElement;
    const {offsetHeight: parentOffsetHeight, scrollTop} = scrollParent;

    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight >  scrollTop + parentOffsetHeight;

    if(isAbove) {
        scrollParent.scrollTo(0,offsetTop);
    } else if (isBelow) {
        scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }//if else, then the element is already in view
};

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
    Select Component Class
    Accecpts a combobox element and an array of string options
*/Select
function Select (el) {//define as class
    //element refs
    this.el = el;
    this.comboEl = el.querySelector('[role=combobox]');
    this.listboxEl = el.querySelector('[role=listbox');

    //data
    this.idBase = this.comboEl.id || 'combo'; //short curcuit evaluation for 'combo' default
    this.options = el.querySelectorAll('[role=option]');

    //state
    this.activeIndex = 0;
    this.open = false;
    this.searchString = '';
    this.searchTimeout = null;

    //init
    if(el && this.comboEl && this.listboxEl) {
        this.init();//initialization function
    }
};

Select.prototype.init = function() {
    //add event listeners
    this.comboEl.addEventListener('blur', this.onComboBlur.bind(this));
    this.listboxEl.addEventListener('focusout', this.onComboBlur.bind(this));
    this.comboEl.addEventListener('click', this.onComboClick.bind(this));
    this.comboEl.addEventListener('keydown', this.onComboKeyDown.bind(this))
    this.el.querySelector('.combo-input').addEventListener('focusin', this.onSelectFocus.bind(this));
    this.el.querySelector('.combo-input').addEventListener('focusout', this.onSelectNoFocus.bind(this));

    //setup options
    this.options.forEach((el) => {
        this.setupOption(el)
    });
};

//create and return Option Html element
Select.prototype.setupOption = function (option) {
    let index = indexOf(this.options, option);

    option.addEventListener('click', (event) => {
        this.onOptionClick(index);
    });

    option.addEventListener('mouseenter', () => {
        this.onOptionHover(index);
    });

    option.addEventListener('mousedown', this.onOptionMouseDown.bind(this));

    return option;
};

Select.prototype.getSearchString = function (char) {
    // reset typing timeout and start new timeout
    // this allows us to make multiple-letter matches, like a native select
    if(typeof this.searchTimeout === 'number') {//couldn't we just perform type conversion through '=='?
        window.clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(() => {
        this.searchString = '';
    }, 500);

    //add most recent letter to saved search string
    this.searchString += char;
    return this.searchString;
};

Select.prototype.onComboBlur = function (event) {
    // do nothing if relatedTarget is contained within listboxEl
    if (this.listboxEl.contains(event.relatedTarget)) {
        return;
    }

    //select current option and close
    if (this.open) {
        this.updateMenuState(false, false);
    }
};

Select.prototype.onComboClick = function (event) {
    this.updateMenuState(!this.open, false);
};

Select.prototype.onComboKeyDown = function (event) {
    const {key} = event;
    const max = this.options.length - 1;

    const action = getActionFromKey(event, this.open);

    switch(action) {
        case SelectActions_Combo.Last:
        case SelectActions_Combo.First:
            this.updateMenuState(true);
        //intentional fallthrough
        case SelectActions_Combo.Next:
        case SelectActions_Combo.Previous:
        case SelectActions_Combo.PageUp:
        case SelectActions_Combo.PageDown:
            event.preventDefault();
            return this.onOptionChange(
                getUpdatedIndex(this.activeIndex, max, action)
            );
        case SelectActions_Combo.CloseSelect:
            event.preventDefault();
            this.selectOption(this.activeIndex);
        //intential fallthrough
        case SelectActions_Combo.Close:
            event.preventDefault();
            return this.updateMenuState(false);
        case SelectActions_Combo.Type:
            return this.onComboKeyDown(key);
        case SelectActions_Combo.Open:
            event.preventDefault();
            return this.updateMenuState(true);
        case SelectActions_Combo.Select:
            return this.onOptionSelect(this.activeIndex);
    }
};

Select.prototype.onComboType = function (letter) {
    //open the listbox if it is closed
    this.updateMenuState(true);

    //find the index of the first matching option
    const searchString = this.getSearchString(letter);
    const searchIndex = getIndexByLetter(
        this.options,
        searchString,
        this.activeIndex + 1
    );

    //if a match was found, go for it
    if(searchIndex >= 0) {
        this.onOptionChange(searchIndex);
    }
    //if no matches, clear the timeout and search string
    else {
        window.clearTimeout(this.searchTimeout);
        this.searchString = '';
    }
};

Select.prototype.onOptionChange = function (index) {
    //update state
    this.activeIndex = index;

    //update aria-activedescendent
    this.comboEl.setAttribute('aria-activedescendent', `${this.idBase}-${index}`);

    //update active option styles
    [...this.options].forEach((optionEl) => {//this method works for option lists with < 50 options
        optionEl.classList.remove('option-current');
    });
    this.options[index].classList.add('option-current');

    //ensure the new option is in view
    if(isScrollable(this.listboxEl)) {
        maintainScrollVisibility(this.options[index], this.listboxEl);
    }

    //ensure the new options is visible on screen
    //ensure the new option is in view
    if(!isElementInView(this.options[index])) {
        this.options[index].scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
};

Select.prototype.onOptionClick = function (index) {
    this.onOptionChange(index);
    this.selectOption(index);
    this.updateMenuState(false);
}

Select.prototype.onOptionHover = function (index) {
    this.onOptionChange(index);
    this.selectOption(index);
}

Select.prototype.onSelectFocus = function () {
    this.updateMenuState(true);
}

Select.prototype.onSelectNoFocus = function () {
    this.updateMenuState(false);
}

Select.prototype.onOptionMouseDown = function () {
    //clicking an optoin will causee a blur event.
    //but we don't want to perform hte default keyboard blur action
    this.ignoreBlur = true;
}

Select.prototype.selectOption = function (index) {
    //update state
    this.activeIndex = index;

    //focus element
    this.options[index].focus();
};

Select.prototype.onOptionSelect = function (index) {
    //focus element
    this.options[index].click();
}

Select.prototype.updateMenuState = function (open, callFocus = true) {
    //if the state we want it to be in is already it's current state, ignore
    if (this.open === open) {
        return;
    }

    //update state
    this.open = open;

    //update aria-expanded and styles
    this.comboEl.setAttribute('ariaexpanded', `${open}`);
    if(open) {
        this.el.classList.remove('hide-visually');
        this.el.classList.add('open');
    }
    else { 
        this.el.classList.add('hide-visually');
        this.el.classList.remove('open');
    }

    //update activedescendent
    const activeID = open ? `${this.idBase}-${this.activeIndex}` : '';
    this.comboEl.setAttribute('aria-activedescendent', activeID);

    if (activeID === '' && !isElementInView(this.comboEl)) {
        this.comboEl.scrollIntoView({behavior: 'smooth', block: 'nearest' });
    }

    //move focus back to the combobox, if needed
    callFocus && this.comboEl.focus();
}

//init select
window.addEventListener('load', function () {
    const comboEls = document.querySelectorAll('.skip-combo');

    comboEls.forEach((el) => {
        new Select(el);
    })
});