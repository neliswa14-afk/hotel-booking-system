// Load booking & user
let booking = JSON.parse(localStorage.getItem("booking"));
let user = JSON.parse(localStorage.getItem("loggedUser"));

if (!booking || !user) {
    window.location.href = "booking.html";
}

// Display summary
document.getElementById("room").innerText = booking.room;
document.getElementById("dates").innerText = `${booking.checkin} / ${booking.checkout}`;
document.getElementById("amount").innerText = "R" + booking.total;
document.getElementById("eftRef").innerText = "BK" + Date.now();

// Payment method switching
const method = document.getElementById("paymentMethod");
const cardForm = document.getElementById("cardForm");
const eftForm = document.querySelector(".eftform");
const mobileForm = document.querySelector(".mobileForm");

function switchPayment() {
    cardForm.classList.add("hidden");
    eftForm.classList.add("hidden");
    mobileForm.classList.add("hidden");

    if (method.value === "card") cardForm.classList.remove("hidden");
    if (method.value === "eft") eftForm.classList.remove("hidden");
    if (method.value === "mobile") mobileForm.classList.remove("hidden");
}

method.addEventListener("change", switchPayment);
switchPayment(); // initialize

// Mask card number
document.getElementById("cardNumber").addEventListener("input", function(e){
    let value = e.target.value.replace(/\D/g,"").substring(0,16);
    e.target.value = value.replace(/(.{4})/g,"$1 ").trim();
});

// Card payment
cardForm.addEventListener("submit", function(e){
    e.preventDefault();
    let cardNumber = document.getElementById("cardNumber").value.replace(/\s/g,"");
    if(cardNumber.length !== 16){
        showMessage("Invalid card number", "red");
        return;
    }
    completePayment("Card ****" + cardNumber.slice(-4));
});

// Complete payment (generic for all methods)
function completePayment(paymentMethod){
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];

    booking.user = user.email;
    booking.status = "Paid";
    booking.paymentMethod = paymentMethod;
    booking.refund = 0;

    allBookings.push(booking);
    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    localStorage.removeItem("booking");

    showMessage("Payment Successful! Booking Confirmed", "green");

    setTimeout(() => {
        window.location.href = "my-bookings.html";
    }, 1500);
}

// EFT and Mobile buttons
document.querySelector(".eftform button").addEventListener("click", () => {
    completePayment("EFT " + document.getElementById("eftRef").innerText);
});

document.querySelector(".mobileForm button").addEventListener("click", () => {
    let mobileNumber = document.querySelector(".mobileForm input").value;
    if (!mobileNumber) {
        showMessage("Enter mobile number", "red");
        return;
    }
    completePayment("Mobile " + mobileNumber);
});

// Helpers
function showMessage(msg, color){
    let m = document.getElementById("message");
    m.innerText = msg;
    m.style.color = color;
}

function logout(){
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}
