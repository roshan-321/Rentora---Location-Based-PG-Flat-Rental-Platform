const userRegisterForm = document.getElementById("userRegisterForm");

console.log("userRegisterForm :", userRegisterForm);


function userRegisterFormSubmit(event) {

    event.preventDefault();

    const firstName = document.getElementById("first_name");
    const lastName = document.getElementById("last_name");
    const email = document.getElementById("email");
    const phoneNumber = document.getElementById("phone_number");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm_password");
    const role = document.getElementById("role");

    

    if (firstName.value.trim() === "") {
        showtoastMessage("first name is required");
        return;
    }

    if (lastName.value.trim() === "") {
        showtoastMessage("last name is required");
        return;
    }

    if (email.value.trim() === "") {
        showtoastMessage("Email is required");
        return;
    }

    if (password.value.trim() === "") {
        showtoastMessage("password is required");
        return;
    }

    if (password.value.length < 8) {
        showtoastMessage("Password must be at least 8 characters");
        return;
    }


    if (confirmPassword.value.trim() === "") {
        showtoastMessage("confirm password is required");
        return;
    }

    if (password.value !== confirmPassword.value) {
        showtoastMessage("Passwords do not match");
        return;
    }

    if (role.value.trim() === "") {
        showtoastMessage("role is required");
        return;
    }


    

   const payload = {
    "first_name": firstName.value,
    "last_name": lastName.value,
    "email": email.value,
    "username":email.value,
    "phone_number": phoneNumber.value,
    "password": password.value,
    "role": role.value
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

        if (data.email) {
            showtoastMessage(data.email[0]);
            return;
        } 
        else{
            showtoastMessage("register successfully")
        }
        
        setTimeout(() => {
        window.location.href = "/accounts/user/signin"; 
        }, 2000);
    

    })
    .catch(error => {
        console.error("error posting data:", error);
    });
}


userRegisterForm.addEventListener("submit", userRegisterFormSubmit);