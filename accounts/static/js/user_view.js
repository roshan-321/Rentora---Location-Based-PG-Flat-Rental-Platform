
const userId = window.location.pathname.split("/").filter(Boolean).pop();

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
        user.is_active ? "Active" : "Inactive";

    document.getElementById("is_staff").value =
        user.is_staff ? "Yes" : "No";

    document.getElementById("is_superuser").value =
        user.is_superuser ? "Yes" : "No";

    document.getElementById("date_joined").value =
        user.date_joined
            ? new Date(user.date_joined).toLocaleString()
            : "-";

    document.getElementById("last_login").value =
        user.last_login
            ? new Date(user.last_login).toLocaleString()
            : "Never";
})
.catch(error => {
    console.error("Error fetching user:", error);
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