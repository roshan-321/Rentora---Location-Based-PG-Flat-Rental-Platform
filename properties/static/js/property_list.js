
function loadProperties() {

    const params = new URLSearchParams(window.location.search);

    // Get current filter values
    const propertyType = document.getElementById("property_type").value;
    const suitableFor = document.getElementById("suitable_for").value;
    const minRent = document.getElementById("min_rent").value;
    const maxRent = document.getElementById("max_rent").value;
    const location = document.getElementById("location").value.trim();

    // Update URL parameters without duplicates
    params.delete("property_type");
    params.delete("suitable_for");
    params.delete("min_rent");
    params.delete("max_rent");
    params.delete("location");

    if (propertyType) {
        params.set("property_type", propertyType);
    }

    if (suitableFor) {
        params.set("suitable_for", suitableFor);
    }

    if (minRent !== "") {
        params.set("min_rent", minRent);
    }

    if (maxRent !== "") {
        params.set("max_rent", maxRent);
    }

    if (location) {
        params.set("location", location);
    }

    const queryString = params.toString();

    // Update URL
    const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;

    history.replaceState(null, "", newUrl);

    fetch(`/api/properties/list?${queryString}`, {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load properties");
        }
        return response.json();
    })
    .then(data => {

        const properties = data.properties;

        const propertyList = document.getElementById("propertyList");
        const noPropertyMessage = document.getElementById("noPropertyMessage");

        // Clear previous properties
        propertyList.innerHTML = "";

        if (properties.length === 0) {
            noPropertyMessage.classList.remove("d-none");
            return;
        }

        noPropertyMessage.classList.add("d-none");

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


// Load filters from URL only once
const initialParams = new URLSearchParams(window.location.search);

document.getElementById("property_type").value =
    initialParams.get("property_type") || "";

document.getElementById("suitable_for").value =
    initialParams.get("suitable_for") || "";

document.getElementById("min_rent").value =
    initialParams.get("min_rent") || "";

document.getElementById("max_rent").value =
    initialParams.get("max_rent") || "";

document.getElementById("location").value =
    initialParams.get("location") || "";


// Apply Filters

document.getElementById("filterForm").addEventListener("submit", function(event) {
    event.preventDefault();
    loadProperties();
});


// Clear Filters

document.getElementById("resetFilters").addEventListener("click", function() {
    setTimeout(() => {
        loadProperties();
    }, 0);
});


// Load Properties

if (localStorage.getItem("access")) {

    document.addEventListener("userDataLoaded", function () {
        loadProperties();
    });

} else {

    loadProperties();

}


// Delete Property

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