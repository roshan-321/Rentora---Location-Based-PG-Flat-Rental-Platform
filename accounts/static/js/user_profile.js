const userId = window.location.pathname
    .split("/")
    .filter(Boolean)
    .pop();


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

    document.getElementById("firstName").textContent =
        user.first_name;

    document.getElementById("lastName").textContent =
        user.last_name;

    document.getElementById("email").textContent =
        user.email;

    document.getElementById("phoneNumber").textContent =
        user.phone_number || "-";

    document.getElementById("username").textContent =
        user.username;

    document.getElementById("role").textContent =
        user.role;

    document.getElementById("profileName").textContent =
        `${user.first_name} ${user.last_name}`;

    document.getElementById("profileRole").textContent =
        user.role;

    document.getElementById("profileInitial").textContent =
        user.first_name.charAt(0).toUpperCase();

})
.catch(error => {

    console.log(error);

});