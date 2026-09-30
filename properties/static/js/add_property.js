const propertyForm = document.getElementById("propertyForm");

propertyForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name");
    const propertyType = document.getElementById("property_type");
    const suitableFor = document.getElementById("suitable_for")
    const description = document.getElementById("description");
    const rent = document.getElementById("rent");
    const features = document.getElementById("features");
    const address = document.getElementById("address");
    const contactNo = document.getElementById("contact_no");
    const alternateContactNo = document.getElementById("alternate_contact_no");


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
        showtoastMessage("plese Select propety Type");
        return;
    }

    if (suitableFor.value.trim() === "") {
        showtoastMessage("plese Select Suitable For ");
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
        showtoastMessage("Address is required");
        return;
    }

    if (contactNo.value.trim() === "") {
        showtoastMessage("Contact No. is required");
        return;
    }



    const payload = {
        "name": name.value,
        "property_type": propertyType.value,
        "suitable_for":suitableFor.value,
        "description": description.value,
        "rent": rent.value,
        "features": featureObject,
        "address": address.value,
        "contact_no":contactNo.value,
        "alternate_contact_no" : alternateContactNo.value
        
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
        showtoastMessage("property Added Successfully")
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


function validatePermissions() {
    if (userData.role == "tenant" && isProtectedRoute) {
        showtoastMessage("You don't have permission to access this page!");

        setTimeout(() => {
            localStorage.removeItem("access");
            window.location.href = "/accounts/user/signin";
        }, 2000);

        return false;
    }
    return true;
}