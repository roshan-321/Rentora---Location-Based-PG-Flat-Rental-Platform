
document.getElementById("searchProperties").addEventListener("click", function () {

    const location = document.getElementById("location").value.trim();
    const propertyType = document.getElementById("property_type").value;

    const params = new URLSearchParams();

    if (location) {
        params.append("location", location);
    }

    if (propertyType && propertyType !== "Property Type") {
        params.append("property_type", propertyType);
    }

    window.location.href = `/properties/list?${params.toString()}`;
});