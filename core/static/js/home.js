document.addEventListener("DOMContentLoaded", function () {

    // ================= SEARCH PROPERTIES =================

    const searchButton = document.getElementById("searchProperties");

    if (searchButton) {
        searchButton.addEventListener("click", function () {

            const locationInput = document.getElementById("location");
            const propertyTypeInput = document.getElementById("property_type");

            const location = locationInput
                ? locationInput.value.trim()
                : "";

            const propertyType = propertyTypeInput
                ? propertyTypeInput.value
                : "";

            const params = new URLSearchParams();

            if (location) {
                params.append("location", location);
            }

            if (propertyType && propertyType !== "Property Type") {
                params.append("property_type", propertyType);
            }

            const queryString = params.toString();

            window.location.href = queryString
                ? `/properties/list?${queryString}`
                : "/properties/list";
        });
    }

});