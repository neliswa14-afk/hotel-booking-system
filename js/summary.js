 // Get booking from LocalStorage
const booking = JSON.parse(localStorage.getItem("booking"));

if (!booking) {
    alert("No booking found.");
    window.location.href = "booking.html";
}

// Populate summary fields
document.getElementById("name").innerText = booking.user || "Guest";
document.getElementById("room").innerText = booking.room;
document.getElementById("checkin").innerText = booking.checkin;
document.getElementById("checkout").innerText = booking.checkout;
document.getElementById("nights").innerText = booking.nights + " night(s)";
document.getElementById("total").innerText = booking.total;

// Extras
document.getElementById("extras").innerText = 
    booking.extras.length > 0 ? booking.extras.join(", ") : "None";

document.getElementById("extrasCost").innerText = (booking.extrasTotal + booking.breakfastTotal);

// Breakfast
document.getElementById("breakfast").innerText = booking.breakfast ? "Yes (+R150)" : "No";

// BUTTONS
function goBack() {
    window.location.href = "booking.html";
}

function goToPayment() {
    localStorage.setItem("booking", JSON.stringify(booking)); // keep booking for payment
    window.location.href = "payment.html";
}

// LOGOUT
function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}
