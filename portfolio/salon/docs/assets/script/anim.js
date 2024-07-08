/*
    Author: Aaron Evans
    desc: website animation handler. begins animation once elements
    have crossed a certain threshold
*/

const _entries = document.querySelectorAll('.js-anim');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
},
{
    threshold: .3,
}
)

_entries.forEach((entry) => {
    observer.observe(entry);
});