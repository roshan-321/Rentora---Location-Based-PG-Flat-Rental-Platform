
const userId = window.location.pathname.split("/").filter(Boolean).pop();

const editUserForm = document.getElementById("editUserForm");

// Load User Details
fetch(`/api/accounts/users/${userId}`, {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("access")
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error("Failed to fetch user details");
    }
    return response.json();
})
.then(user => {

    if (!validatePermissions()) {
    return;
    }

    document.getElementById("id").value = user.id ?? "";
    document.getElementById("username").value = user.username ?? "";
    document.getElementById("first_name").value = user.first_name ?? "";
    document.getElementById("last_name").value = user.last_name ?? "";
    document.getElementById("email").value = user.email ?? "";
    document.getElementById("phone_number").value = user.phone_number ?? "";
    document.getElementById("gender").value = user.gender ?? "";
    document.getElementById("role").value = user.role ?? "";

    document.getElementById("is_active").value =
        String(user.is_active);

    document.getElementById("is_staff").value =
        String(user.is_staff);

    document.getElementById("is_superuser").value =
        String(user.is_superuser);

    document.getElementById("date_joined").value =
        user.date_joined
            ? new Date(user.date_joined).toLocaleString()
            : "";

    document.getElementById("last_login").value =
        user.last_login
            ? new Date(user.last_login).toLocaleString()
            : "Never";
})
.catch(error => {
    console.error("Error fetching user:", error);
});

// Update User
editUserForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const userData = {
        username: document.getElementById("username").value.trim(),
        first_name: document.getElementById("first_name").value.trim(),
        last_name: document.getElementById("last_name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone_number: document.getElementById("phone_number").value.trim(),
        gender: document.getElementById("gender").value,
        role: document.getElementById("role").value,
        is_active: document.getElementById("is_active").value === "true",
        is_staff: document.getElementById("is_staff").value === "true",
        is_superuser: document.getElementById("is_superuser").value === "true"
    };

    fetch(`/api/accounts/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update user");
        }
        return response.json();
    })
    .then(data => {
        
        showtoastMessage("User updated successfully.");
         setTimeout(() => {
            window.location.href = "/accounts/user/list";
        }, 2000);

    })
    .catch(error => {
        console.error("Error updating user:", error);
        alert("Unable to update user.");
    });
});

function validatePermissions() {
    if (!userData.is_superuser && isProtectedRoute) {
        showtoastMessage("You don't have permission to access this page!");

        setTimeout(() => {
            localStorage.removeItem("access");
            window.location.href = "/accounts/user/signin";
        }, 2000);

        return false;
    }

    return true;
}