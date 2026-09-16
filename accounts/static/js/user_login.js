const userLoginForm = document.getElementById("userLoginForm");

console.log("userLoginForm :", userLoginForm);

function userLoginFormSubmit(event) {
    event.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const payload = {
        "email": email.value,
        "password": password.value,
    };

    fetch("/api/accounts/token", {
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "body": JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {

        console.log("data :", data);

        localStorage.setItem("access", data.access);

        const token = JSON.parse(atob(data.access.split(".")[1]));

        console.log("token :", token);
        console.log("user id :", token.user_id);

         
        return fetch(`/api/accounts/users/${token.user_id}`, {
            "headers": {
                "Authorization": "Bearer " + data.access
            }
        });

    })
    .then(userResponse => {

        console.log("userResponse :", userResponse);

        return userResponse.json();

    })
    .then(userdata => {

        console.log("userdata :", userdata);

        if (userdata.role === "tenant") {

            console.log("Redirecting to home...");
            window.location.href = "http://127.0.0.1:8000";

        } else {

            console.log("Role is:", userdata.role);
        }

    })
    .catch(error => {
        console.error("Error posting data:", error);
    });
}

userLoginForm.addEventListener("submit", userLoginFormSubmit);