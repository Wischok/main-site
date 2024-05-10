/*
    Author: Aaron Evans
    Desc: Automatic Loading bar loading
*/

/*
    Progressbar component class
*/
function ProgressBar (el) {
    //element refs
    this.progressBar = el;//progress bar
    this.pauseButton = document.querySelector('.progressbar-pause')
    this.slides = document.querySelectorAll('.progressbar-slide')

    //data
    this.idBase = this.tablist.id || 'tablist';
    this.progress = 0;

    if(el) {
        this.init();
    }
}

ProgressBar.prototype.init = function() {
    //set timed interval for ProgressBar
    setInterval(this.interval.bind(this),100);
}

ProgressBar.prototype.interval = function() {
    //if pause button is pressed, skip
    if(this.pauseButton.getAttribute('aria-pressed') === 'true') {
        return;
    }

    this.progress += 0.5;//5% per second
    this.progressBar.style.setProperty('--width', this.progress);
}

//init tabs
window.addEventListener('load', function () {
    const elements = document.querySelectorAll('[role=progressbar]');

    elements.forEach((el) => {
        new ProgressBar(el);
    })
});