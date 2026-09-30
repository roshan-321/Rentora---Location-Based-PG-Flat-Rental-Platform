const userList = document.getElementById("userList");
const noUsersMessage = document.getElementById("noUsersMessage");

const filterId = document.getElementById("filterId");
const filterRole = document.getElementById("filterRole");
const filterGender = document.getElementById("filterGender");
const filterName = document.getElementById("filterName");
const filterEmail = document.getElementById("filterEmail");
const filterStatus = document.getElementById("filterStatus");

const applyFilters = document.getElementById("applyFilters");
const resetFilters = document.getElementById("resetFilters");

function fetchUsers() {
    const params = new URLSearchParams();

    if (filterId.value) {
        params.append("id", filterId.value);
    }

    if (filterRole.value) {
        params.append("role", filterRole.value);
    }

    if (filterGender.value) {
        params.append("gender", filterGender.value);
    }

    if (filterName.value.trim()) {
        params.append("name", filterName.value.trim());
    }

    if (filterEmail.value.trim()) {
        params.append("email", filterEmail.value.trim());
    }

    if (filterStatus.value !== "") {
        params.append("is_active", filterStatus.value);
    }

    fetch(`/api/accounts/users?${params.toString()}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        }
    })
    .then(response => {
        console.log("Status:", response.status);
        return response.json();
    })
    .then(users => {

        if (!validatePermissions()) {
            return;
        }

        console.log("Users:", users);

        userList.innerHTML = "";

        if (users.length === 0) {
            noUsersMessage.style.display = "block";
            return;
        }

        noUsersMessage.style.display = "none";

        users.forEach(user => {
            const fullName = `${user.first_name} ${user.last_name}`.trim();

            userList.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${fullName}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <a href="/accounts/user/view/${user.id}"
                        class="btn btn-primary btn-sm">
                            View
                        </a>

                        <a href="/accounts/user/edit/${user.id}"
                        class="btn btn-warning btn-sm">
                            Edit
                        </a>

                        <button class="btn btn-danger btn-sm"
                            onclick="deleteUser(${user.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.error("Error fetching users:", error);
        noUsersMessage.textContent = "Unable to load users.";
        noUsersMessage.style.display = "block";
    });
}

applyFilters.addEventListener("click", fetchUsers);

resetFilters.addEventListener("click", () => {
    filterId.value = "";
    filterRole.value = "";
    filterGender.value = "";
    filterName.value = "";
    filterEmail.value = "";
    filterStatus.value = "";

    fetchUsers();
});

function deleteUser(userId) {

    if (!confirm("Are you sure you want to delete this User?")) {
        return;
    }

    fetch(`/api/accounts/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {

        showtoastMessage("User deleted successfully!");

        setTimeout(() => {
            fetchUsers();
        }, 1000);

    })
    .catch(error => {
        console.log(error);
    });

}

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

fetchUsers();