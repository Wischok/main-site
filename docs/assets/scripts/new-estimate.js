/*
    Author: Aaron Evans
    Desc: Handle new estimate

    Required Information:
        First Name
        Last Name
        email
        phone
        service
        amount
        deposit percentage

    Optional Information:
        Phone
        opt in
*/

const form = document.getElementById("estimate");

async function newSale() {
    // Construct a FormData object using subscriber form
    var formData = new FormData(form);

    //create object with form data values
    var elements = document.getElementById("estimate").elements;
    var obj = {};
    for(var i = 0 ; i < elements.length ; i++){
        var item = elements.item(i);
        obj[item.name] = item.value;
    }

    //Get Today's Date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    //update data
    formData.set("MERGE1", formData.get("fname") + " " + formData.get("lname"));//merge name to full
    formData.set("fullEstimate", formData.get("estimate"));//record full estimate

    //determine discount amount
    formData.set("discountAmount", (formData.get("estimate") * 0.01 * formData.get("discount")));
    
    //retrieve date
    formData.set("date", today);

    //adjust full estimate for discount
    if(formData.get("discount") > 0) {
        formData.set("estimate", formData.get("estimate") - (formData.get("estimate") * 0.01 * formData.get("discount")));
    }

    //determine down payment amount
    let downPayment = formData.get("estimate") * formData.get("down") * 0.01;//get downpayment
    formData.set("downPayment", downPayment);//downpayment
    
    if(formData.get("down") > 0) {
        formData.set("estimate", formData.get("estimate") - (formData.get("estimate") * 0.01 * formData.get("down")));
    }

    formData.set("estimate_noDeposit", (formData.get("fullEstimate") - formData.get("downPayment")))

    try {
        const response = await fetch("https://hooks.zapier.com/hooks/catch/18878383/3vha5ec/", {
            method: "POST",
            body: formData,
        });
    } catch (e) {
        console.error(e);
    }
}

//trigger on submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    newSale();
    form.classList.add('complete');
})