
from django.apps import apps
from langchain_core.tools import tool
from django.db.models import QuerySet


@tool
def search_properties(
    property_type: str = "",
    max_rent: int = 0,
    location: str = "",
    suitable_for: str = "",
) -> dict:
    """
    Search Rentora PG and flat listings using Django ORM.

    Args:
        property_type: Property type, such as pg or flat.
        max_rent: Maximum monthly rent.
        location: City or area to search in.
        suitable_for: Tenant suitability, if specified.
    """

    try:
        # Get Property model without importing models at module level.
        Property = apps.get_model("properties", "Property")

        properties: QuerySet = Property.objects.all()

        # Apply allowed filters.
        if property_type:
            properties = properties.filter(
                property_type__iexact=property_type.strip()
            )

        if max_rent and max_rent > 0:
            properties = properties.filter(rent__lte=max_rent)

        if location:
            properties = properties.filter(
                address__icontains=location.strip()
            )

        if suitable_for:
            properties = properties.filter(
                suitable_for__iexact=suitable_for.strip()
            )

        # Return only the fields needed by the chatbot.
        results = list(
            properties.values(
                "name",
                "rent",
                "property_type",
                "suitable_for",
                "description",
                "address",
                "contact_no",
                "alternate_contact_no",
                "features",
            )[:10]
        )

        # Remove empty values and avoid exposing internal IDs.
        cleaned_properties = []

        for property_data in results:
            cleaned = {
                key: value
                for key, value in property_data.items()
                if value is not None and value != ""
            }
            cleaned_properties.append(cleaned)

        return {
            "count": len(cleaned_properties),
            "properties": cleaned_properties,
        }

    except Exception:
        return {
            "error": "Unable to search properties right now."
        }
