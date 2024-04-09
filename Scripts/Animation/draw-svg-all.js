"use strict";

//observer event for drawing svgs
let observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        //if intersecting by 10%
        if(entry.isIntersecting) {
            //draw svg
            DrawSVG(entry);

            //remove entry
            observer.unobserve(entry);
        }
    })
}, {
    threshold: .1
});
//observe all svgs
document.querySelectorAll("svg").forEach(entry => {
    observer.observe(entry);//oberve each 'svg' element
});

//page load function
window.addEventListener('load', function () {
    //select all svgs
    querySelectorAll('svg').foreach((el) => {
        //select all paths within svg
        let paths = el.querySelectorAll('path');

        paths.forEach((path) => {
            //get total path length
            let pathLength = path.getTotalLength();

            path.style.strokeDasharray = pathLength / 2;
            path.style.strokeDashoffset = pathLength / 2;
        })
    })

    alert('working');
});

function DrawSVG(svg) {
    svg.querySelectorAll('path').forEach((path) => {
        //get total path length
        let pathLength = path.getTotalLength();

        //set path length to full
        path.style.strokeDashoffset = pathLength;
    });
}