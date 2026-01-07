// ===== AUTO-CREATE DEFAULT ADMIN (ONCE) =====
let users = JSON.parse(localStorage.getItem("users")) || [];

if (!users.some(u => u.role === "admin")) {
    users.push({
        name: "System Admin",
        email: "admin@grace.com",
        password: "admin123",
        role: "admin"
    });
    localStorage.setItem("users", JSON.stringify(users));
}

// ===== REGISTER =====
function register() {
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();

    if (!email || !password) {
        alert("All fields are required");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.email === email)) {
        alert("Email already registered");
        return;
    }

    const user = {
        email,
        password,
        role: "customer" // FIXED ROLE
    };

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
    window.location.href = "login.html";

}

// ===== LOGIN =====
function login() {
    const emailInput = email.value.trim();
    const passwordInput = password.value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.email === emailInput && u.password === passwordInput
    );

    if (!user) {
        alert("Invalid email or password");
        return;
    }

    localStorage.setItem("loggedUser", JSON.stringify(user));

    window.location.href =
        user.role === "admin" ? "admin.html" : "booking.html";
}

// ===== LOGOUT (GLOBAL) =====
function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}
