const propertyForm = document.getElementById("propertyForm");

propertyForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name");
    const propertyType = document.getElementById("property_type");
    const description = document.getElementById("description");
    const rent = document.getElementById("rent");
    const features = document.getElementById("features");
    const address = document.getElementById("address");


    const featureList = features.value
        .split(",")
        .map(feature => feature.trim())
        .filter(feature => feature !== "");


    const featureObject = {};

    featureList.forEach(feature => {
        featureObject[feature] = true;
    });

    
    if (name.value.trim() === "") {
        showtoastMessage("property name is required");
        return;
    }

    if (propertyType.value.trim() === "") {
        showtoastMessage("property type is required");
        return;
    }

    if (description.value.trim() === "") {
        showtoastMessage("description is required");
        return;
    }

    if (features.value.trim() === "") {
        showtoastMessage("please add some features");
        return;
    }

    
    if (rent.value.trim() === "") {
        showtoastMessage("rent is required");
        return;
    }

    if (address.value.trim() === "") {
        showtoastMessage("address is required");
        return;
    }



    const payload = {
        "name": name.value,
        "property_type": propertyType.value,
        "description": description.value,
        "rent": rent.value,
        "features": featureObject,
        "address": address.value
    };


    console.log("payload :", payload);


    fetch("/api/properties/list", {

        "method": "POST",

        "headers": {
            "content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
        },

        "body": JSON.stringify(payload)

    })
    .then(response => response.json())
    .then(data => {

        console.log("data :", data);

        setTimeout(() => {
            window.location.href = "/properties/list";
            }, 2000);

    })
    .catch(error => {

        console.error("Error:", error);

    });

});

function validatePermissions() {
    if (userData.role == "tenant" && isProtectedRoute) {
        showtoastMessage("You don't have permission to access this page!");

        setTimeout(() => {
            localStorage.removeItem("access");
            window.location.href = "/accounts/user/signin";
        }, 2000);

        return;
    }
}