fetch("/api/properties/list", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("access")
    }
})
.then(response => {
    return response.json();
})
.then(properties => {

    const propertyList = document.getElementById("propertyList");

    properties.forEach(property => {

        const row = `
            <div>
                <h3>${property.name}</h3>

                <p>${property.property_type}</p>

                <p>${property.description}</p>

                <p>Rent: ₹${property.rent}</p>

                <p>Address: ${property.address}</p>
            </div>
        `;

        propertyList.innerHTML += row;
    });

})
.catch(error => {
    console.log(error);
});