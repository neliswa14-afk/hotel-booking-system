// ===== ROOM CAPACITY & PRICES =====
const roomCapacity = { single: 15, double: 13, suite: 10 };
const prices = { single: 500, double: 800, suite: 1500 };

// ===== CALCULATE NIGHTS =====
function calculateNights() {
    let checkin = document.getElementById("checkin").value;
    let checkout = document.getElementById("checkout").value;

    if(!checkin || !checkout){
        document.getElementById("nights").value = "";
        return;
    }

    let nights = (new Date(checkout) - new Date(checkin)) / (1000*60*60*24);
    if(nights <= 0){
        document.getElementById("nights").value = "Invalid dates";
        return;
    }

    document.getElementById("nights").value = nights + " night(s)";
}

// ===== CHECK AVAILABILITY =====
function checkAvailability() {
    let room = document.getElementById("room").value;
    let availability = document.getElementById("availability");

    if(room === "choose"){
        availability.innerText = "Please select a room type";
        return;
    }

    let checkin = new Date(document.getElementById("checkin").value);
    let checkout = new Date(document.getElementById("checkout").value);

    if(!checkin || !checkout || checkout <= checkin){
        availability.innerText = "Please select valid dates";
        return;
    }

    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];

    let bookedCount = allBookings.filter(b =>
        b.room === room &&
        new Date(b.checkin) < checkout &&
        new Date(b.checkout) > checkin &&
        b.status === "Paid"
    ).length;

    if(bookedCount >= roomCapacity[room]){
        availability.innerText = "Sold Out for selected dates";
    } else {
        availability.innerText = "Room Available";
    }
}

// ===== CONTINUE BOOKING =====
function continueBooking() {
    let room = document.getElementById("room").value;
    let checkin = document.getElementById("checkin").value;
    let checkout = document.getElementById("checkout").value;
    let nightsText = document.getElementById("nights").value;

    if(room === "choose" || !checkin || !checkout || nightsText.includes("Invalid")){
        alert("Please fill in valid booking details");
        return;
    }

    let nights = parseInt(nightsText); // extracts number

    // Extras
    let extras = [];
    let extrasTotal = 0;
    document.querySelectorAll('.options input[type="checkbox"]:checked').forEach(extra => {
        extras.push(extra.dataset.name);
        extrasTotal += Number(extra.value);
    });

    // Breakfast
    let breakfast = document.querySelector('input[name="breakfast"]:checked').value;
    let breakfastTotal = breakfast === "yes" ? 150 : 0;

    // Logged in user
    let user = JSON.parse(localStorage.getItem("loggedUser"))?.email || "Guest";

    let booking = {
        user,
        room,
        pricePerNight: prices[room],
        checkin,
        checkout,
        nights,
        extras,
        extrasTotal,
        breakfast: breakfast === "yes",
        breakfastTotal,
        total: prices[room]*nights + extrasTotal + breakfastTotal,
        status: "Paid",
        paymentMethod: null,
        refund: 0
    };

    localStorage.setItem("booking", JSON.stringify(booking));
    window.location.href = "summary.html";
}

// ===== OPTIONAL: FORM SUBMIT PREVENT =====
document.querySelector(".booking-form").addEventListener("submit", function(e){
    e.preventDefault();
});
