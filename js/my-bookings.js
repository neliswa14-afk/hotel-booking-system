//AUTH CHECK
let user = JSON.parse(localStorage.getItem("loggedUser"));
if(!user){
    window.location.href = "index.html";
}

//LOAD BOOKINGS
let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
let table = document.getElementById("bookingTable");
let emptyMsg = document.getElementById("emptyMsg");

//FILTER USER BOOKINGS
let userBookings = allBookings.filter(b => b.user === user.email);

//RENDER BOOKINGS
function renderBookings(){
    table.innerHTML = "";

    if(userBookings.length === 0){
        emptyMsg.innerHTML = "You have no bookings yet.";
        return;
    }

    userBookings.forEach((b, index) => {
        table.innerHTML +=`
        <tr>
            <td>${b.room}</td>
            <td>${b.checkin} → ${b.checkout}</td>
            <td>${b.total}</td>
            <td class="status-${b.status.toLowerCase()}">${b.status}</td>
            <td>${b.paymentMethod}</td>
            <td>${b.refund > 0 ? "R" + b.refund : "-"}</td>
            <td>${b.status === "Paid" ?
                `<button class="cancel-btn" onclick="cancelBooking(${index})">Cancel</button>`
                : "-"}
            </td>
        </tr>`
    });
}

//CANCEL + REDUND
function cancelBooking(index){
    if(!confirm("Cancel this booking and request refund?"))
        return;

    //Find real booking index in allBookings
    let bookingIndex = allBookings.findIndex(b =>
        b.user === user.email && b.checkin === userBookings[index].checkin 
        && b.room === userBookings[index].room
    );

    if(bookingIndex !== 1){
        allBookings[bookingIndex].status = "Cancelled";
        allBookings[bookingIndex].refund = allBookings[bookingIndex].total;
    }

    localStorage.s("allBookings", JSON.stringify(allBookings));

    userBookings = allBookings.filter(b => 
        b.user === user.email);
        renderBookings();
}

// LOGOUT
function logout(){
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}

// INIT
renderBookings();