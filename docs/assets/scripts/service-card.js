/*
    Author: Aaron Evans
    Desc: button handling for service forms on service page
*/

"use strict";

document.getElementById('service-btn1').addEventListener('click', menuExpand);
document.getElementById('service-btn2').addEventListener('click', menuExpand);
document.getElementById('service-btn3').addEventListener('click', menuExpand);

//expand menu for services
function menuExpand(e) {
    let form = document.getElementById(e.target.getAttribute('aria-controls'));
    //add classlist to form
    form.classList.add('active');
}