/*
    Author: Aaron Evans
    Desc: a script to handle API between Mailchimp and a new 
    subscriber

    Required Information:
        Name
        email
        service
        opt in
    Optional Information:
        Phone
*/

const form = document.getElementById("subscribe");

async function newSubscriber() {
    // Construct a FormData object using subscriber form
    const formData = new FormData(form);

    try {
        const response = await fetch("https://wischok.us17.list-manage.com/subscribe/post", {
            method: "POST",
            body: formData,
        });
        console.log(await response.json());
    } catch (e) {
        console.error(e);
    }
}

//trigger on submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    newSubscriber();
    form.classList.add('complete');
})