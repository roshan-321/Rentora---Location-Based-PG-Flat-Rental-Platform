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

    document.getElementById("first_name").value =
        user.first_name;

    document.getElementById("last_name").value =
        user.last_name;

    document.getElementById("email").value =
        user.email;

    document.getElementById("phone_number").value =
        user.phone_number || "";

    document.getElementById("username").value =
        user.username;

    document.getElementById("role").value =
        user.role;

});


document.getElementById("editProfileForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const firstName =
            document.getElementById("first_name").value;

        const lastName =
            document.getElementById("last_name").value;

        const phoneNumber =
            document.getElementById("phone_number").value;


        const payload = {

            first_name: firstName,

            last_name: lastName,

            phone_number: phoneNumber

        };


        fetch(`/api/accounts/users/${userId}`, {

            method: "PATCH",

            headers: {

                "Content-Type": "application/json",

                "Authorization":
                    "Bearer " + localStorage.getItem("access")

            },

            body: JSON.stringify(payload)

        })
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            return response.json();

        })
        .then(data => {

            console.log(data);

            showtoastMessage("Profile updated successfully!");

            setTimeout(() => {
                 window.location.href = `/accounts/user/profile/${userId}`;
            }, 2000);

        })
        .catch(error => {

            console.log(error);

        });

    });