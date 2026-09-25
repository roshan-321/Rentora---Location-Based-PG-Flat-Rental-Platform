function loadProperties() {

    fetch("/api/properties/list", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {

        const properties = data.properties;

        const propertyList = document.getElementById("propertyList");

        properties.forEach(property => {


            const row = `
                <div class="col-md-6 col-lg-4">

                    <div class="card shadow-sm property-card h-100">

                        <div class="card-body">

                            <h5 class="card-title">
                                ${property.name}
                            </h5>

                            <span class="property-type">
                                ${property.property_type}
                            </span>

                            <p class="property-description mt-3">
                                ${property.description}
                            </p>

                            <p class="property-rent">
                                Rent: ₹${property.rent}
                            </p>

                            <p class="property-features">
                                <strong>Features:</strong>
                                ${Object.keys(property.features).join(", ")}
                            </p>

                            <p class="property-address">
                                <strong>Address:</strong>
                                ${property.address}
                            </p>

                            <div class="property-actions">

                                <a href="/properties/view/${property.id}"
                                   class="btn btn-sm btn-primary">
                                    View
                                </a>

                                ${
                                   userData &&
                                   userData.role == "owner" &&
                                   userData.id == property.owner
                                    ?
                                    `
                                    <a href="/properties/edit/${property.id}"
                                       class="btn btn-sm btn-warning">
                                        Edit
                                    </a>

                                    <button
                                        class="btn btn-sm btn-danger"
                                        onclick="deleteProperty(${property.id})">
                                        Delete
                                    </button>
                                    `
                                    :
                                    ""
                                }

                            </div>

                        </div>

                    </div>

                </div>
            `;

            propertyList.innerHTML += row;

        });

    })
    .catch(error => {

        console.log(error);

    });

}



if (localStorage.getItem("access")) {

    document.addEventListener("userDataLoaded", function () {

        loadProperties();

    });

}
else {

    loadProperties();

}


// delete

function deleteProperty(propertyId) {

    if (!confirm("Are you sure you want to delete this property?")) {
        return;
    }


    fetch(`/api/properties/list/${propertyId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        }
    })
    .then(response => {

        return response.json();

    })
    .then(data => {

        showtoastMessage("Property deleted successfully!");

        setTimeout(() => {

            window.location.reload();

        }, 1000);

    })
    .catch(error => {

        console.log(error);

    });

}
