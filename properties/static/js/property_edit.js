const propertyId = window.location.pathname.split("/").filter(Boolean).pop();



fetch(`/api/properties/list/${propertyId}`, {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("access")
    }
})
.then(response => {
    return response.json();
})
.then(property => {

    document.getElementById("name").value = property.name;

    document.getElementById("property_type").value = property.property_type;

    document.getElementById("description").value = property.description;

    document.getElementById("rent").value = property.rent;

    document.getElementById("address").value = property.address;


    const features = Object.keys(property.features);

    document.getElementById("features").value = features.join(", ");

});


document.getElementById("editPropertyForm").addEventListener("submit", function(event) {

    event.preventDefault();


    const name = document.getElementById("name").value;

    const propertyType = document.getElementById("property_type").value;

    const description = document.getElementById("description").value;

    const rent = document.getElementById("rent").value;

    const address = document.getElementById("address").value;

    const featuresInput = document.getElementById("features").value;


    const featureList = featuresInput
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
        name: name,
        property_type: propertyType,
        description: description,
        rent: rent,
        features: featureObject,
        address: address
    };


    fetch(`/api/properties/list/${propertyId}`, {

        method: "PATCH",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
        },

        body: JSON.stringify(payload)

    })
    .then(response => {
        return response.json();
    })
    .then(data => {

        console.log(data);

        showtoastMessage("Property updated successfully!");

        setTimeout(() => {
            window.location.href = "/properties/list";
        }, 2000);

    })
    .catch(error => {
        console.log(error);
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