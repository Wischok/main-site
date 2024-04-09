"use strict";

//page load function
window.addEventListener('DOMContentLoaded', () => {    
    //observer event for drawing svgs
    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            //if intersecting by 10%
            if(entry.isIntersecting) {
                console.log('observed');
                //draw svg
                DrawSVG(entry.target);

                //remove entry
                observer.unobserve(entry.target);
            }
        })
    }, {
        threshold: .3
    });
    //observe all svgs
    document.querySelectorAll(".svg").forEach((entry) => {
        observer.observe(entry);//oberve each 'svg' element
    });

    //select all svgs
    document.querySelectorAll('.svg').forEach((el) => {
        //select all paths within svg
        let paths = el.querySelectorAll('path');

        paths.forEach((path) => {
            //get total path length
            let pathLength = path.getTotalLength();

            path.style.strokeDasharray = pathLength / 2;
            path.style.strokeDashoffset = pathLength / 2;
        })
    })

    
});

function DrawSVG(svg) {
    svg.querySelectorAll('path').forEach((path) => {
        //get total path length
        let pathLength = path.getTotalLength();

        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;

        //shift path stroke to match scroll percentage of poem
        path.style.strokeDashoffset = pathLength - pathLength;
    });
}