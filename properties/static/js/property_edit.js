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

    if (!validatePermissions(property)){
        return;
    }


    document.getElementById("name").value = property.name;

    document.getElementById("suitable_for").value = property.suitable_for

    document.getElementById("property_type").value = property.property_type;

    document.getElementById("description").value = property.description;

    document.getElementById("rent").value = property.rent;

    document.getElementById("address").value = property.address;

    document.getElementById("contact_no").value = property.contact_no;

    document.getElementById("alternate_contact_no").value = property.alternate_contact_no;


    const features = Object.keys(property.features);

    document.getElementById("features").value = features.join(", ");

});


document.getElementById("editPropertyForm").addEventListener("submit", function(event) {

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
        showtoastMessage("property type is required");
        return;
    }

    if (suitableFor.value.trim() === "") {
        showtoastMessage("Suitable For is required");
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


    fetch(`/api/properties/list/${propertyId}`, {

        method: "PATCH",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("access")
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



function validatePermissions(property) {
    if (
        userData.id != property.owner &&
        !userData.is_superuser &&
        isProtectedRoute
    ) {
        showtoastMessage("You don't have permission to access this page!");

        setTimeout(() => {
            localStorage.removeItem("access");
            window.location.href = "/accounts/user/signin";
        }, 2000);

        return false;
    }

    return true;
}