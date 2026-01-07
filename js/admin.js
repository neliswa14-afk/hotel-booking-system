// ===== ADMIN ACCESS CHECK =====
let admin = JSON.parse(localStorage.getItem("loggedUser"));
if (!admin || admin.role !== "admin") {
    alert("Access denied");
    window.location.href = "index.html";
}

// ===== DATA =====
let bookings = JSON.parse(localStorage.getItem("allBookings")) || [];
const bookingTable = document.getElementById("bookingTable");

// ===== PAGINATION =====
let currentPage = 1;
const rowsPerPage = 5;

// ===== RENDER TABLE =====
function renderTable(page = 1) {
    bookingTable.innerHTML = "";

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageBookings = bookings.slice(start, end);

    pageBookings.forEach((b, i) => {
        const realIndex = start + i;

        bookingTable.innerHTML += `
        <tr>
            <td>${b.user}</td>
            <td>${b.room}</td>
            <td>${b.checkin} → ${b.checkout}</td>
            <td>R${b.total}</td>
            <td class="status-${b.status.toLowerCase()}">${b.status}</td>
            <td>${b.paymentMethod || "-"}</td>
            <td>${b.refund ? "R" + b.refund : "-"}</td>
            <td>
                ${b.status === "Paid" ? 
                `<button class="cancel-btn" onclick="cancelBooking(${realIndex})">Cancel</button>` 
                : "-"}
            </td>
        </tr>`;
    });

    document.getElementById("pageInfo").innerText =
        `Page ${currentPage} of ${Math.ceil(bookings.length / rowsPerPage)}`;
}

// ===== CANCEL + REFUND =====
function cancelBooking(index) {
    if (!confirm("Cancel booking and refund?")) return;

    bookings[index].status = "Cancelled";
    bookings[index].refund = bookings[index].total;

    localStorage.setItem("allBookings", JSON.stringify(bookings));
    renderTable(currentPage);
    updateStats();
}

// ===== STATS =====
function updateStats() {
    document.getElementById("totalBookings").innerText = bookings.length;

    const revenue = bookings
        .filter(b => b.status === "Paid")
        .reduce((sum, b) => sum + Number(b.total), 0);

    document.getElementById("totalRevenue").innerText = revenue;
}

// ===== CHARTS =====
function loadCharts() {
    const roomData = {};
    const paymentData = {};

    bookings.forEach(b => {
        roomData[b.room] = (roomData[b.room] || 0) + 1;
        if (b.paymentMethod) {
            paymentData[b.paymentMethod] = (paymentData[b.paymentMethod] || 0) + 1;
        }
    });

    new Chart(document.getElementById("roomChart"), {
        type: "bar",
        data: {
            labels: Object.keys(roomData),
            datasets: [{ data: Object.values(roomData) }]
        }
    });

    new Chart(document.getElementById("paymentChart"), {
        type: "pie",
        data: {
            labels: Object.keys(paymentData),
            datasets: [{ data: Object.values(paymentData) }]
        }
    });
}

// ===== PAGINATION BUTTONS =====
prevPage.onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable(currentPage);
    }
};

nextPage.onclick = () => {
    if (currentPage < Math.ceil(bookings.length / rowsPerPage)) {
        currentPage++;
        renderTable(currentPage);
    }
};

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}

// ===== INIT =====
renderTable();
updateStats();
loadCharts();
