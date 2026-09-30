const propertyId = window.location.pathname
    .split("/")
    .filter(Boolean)
    .pop();

fetch(`/api/properties/list/${propertyId}`, {
    method: "GET"
})
.then(response => {

    if (!response.ok) {
        throw new Error("Failed to fetch property details");
    }

    return response.json();
})
.then(property => {
    console.log(property);

    document.getElementById("name").textContent = property.name;

    document.getElementById("property_type").textContent =
        property.property_type;

    document.getElementById("suitable_for").textContent =
        property.suitable_for;


    document.getElementById("description").textContent =
        property.description;

    document.getElementById("rent").textContent =
        property.rent;

    document.getElementById("address").textContent =
        property.address;

    const features = property.features
        ? Object.keys(property.features)
        : [];

    document.getElementById("features").textContent =
        features.join(", ");

    document.getElementById("contact_no").textContent =
        property.contact_no;
    
    document.getElementById("alternate_contact_no").textContent =
        property.alternate_contact_no || "-";

})
.catch(error => {
    console.log(error);
});