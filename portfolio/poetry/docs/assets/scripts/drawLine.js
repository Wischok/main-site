/*
    Author: Aaron Evans
    Desc: set all paths to 0 for when they load in
*/

let paths = document.querySelectorAll('path');
paths.forEach((path) => {
    let pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength + ' ' + pathLength;
    path.style.strokeDashoffset = pathLength;
});