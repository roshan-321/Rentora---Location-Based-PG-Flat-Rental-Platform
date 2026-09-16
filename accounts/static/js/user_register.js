const userRegisterForm = document.getElementById("userRegisterForm");

console.log("userRegisterForm :", userRegisterForm);


function userRegisterFormSubmit(event) {

    event.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm_password");
    const role = document.getElementById("role");


    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match");
        return;
    }


    


    const payload = {

        "email": email.value,
        "password": password.value,
        "role": role.value,
        "username":email.value

    };


    console.log("payload :", payload);


    fetch("/api/accounts/user/register", {

        "method": "POST",

        "headers": {
            "content-type": "application/json"
        },

        "body": JSON.stringify(payload)

    })
    .then(response => response.json())
    .then(data => {

        console.log("data :", data);

        if (data.id || data.email) {
            window.location.href = "/accounts/user/signin";
        }

    })
    .catch(error => {
        console.error("error posting data:", error);
    });
}


userRegisterForm.addEventListener(
    "submit",
    userRegisterFormSubmit
);