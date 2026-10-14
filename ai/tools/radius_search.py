import math
import os

import requests


OVERPASS_URL = os.getenv("OVERPASS_URL", "https://overpass-api.de/api/interpreter")
RESOURCE_FILTERS = {
    # Public map leads; being listed does not mean the site is currently buying.
    "market": [
        '["amenity"="marketplace"]',
        '["shop"="wholesale"]',
        '["shop"="greengrocer"]',
        '["shop"="supermarket"]',
        '["craft"="food"]',
        '["industrial"="food"]',
        '["industrial"="food_processing"]',
    ],
    "cold_store": [
        '["industrial"="cold_storage"]',
        '["building"="warehouse"]["name"~"cold|storage|cool",i]',
    ],
    "water": [
        '["natural"="water"]',
        '["man_made"="water_well"]',
        '["amenity"="drinking_water"]',
    ],
}


def _distance_km(lat_a: float, lng_a: float, lat_b: float, lng_b: float) -> float:
    radians = math.radians
    delta_lat = radians(lat_b - lat_a)
    delta_lng = radians(lng_b - lng_a)
    haversine = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(radians(lat_a))
        * math.cos(radians(lat_b))
        * math.sin(delta_lng / 2) ** 2
    )
    return 6371 * 2 * math.atan2(math.sqrt(haversine), math.sqrt(1 - haversine))


def search_nearby_resources(
    lat: float,
    lng: float,
    radius_km: float = 5.0,
    resource_type: str = "market",
    limit: int = 10,
) -> list:
    """Return mapped OpenStreetMap resources within the requested radius."""
    filters = RESOURCE_FILTERS.get(resource_type)
    if not filters:
        raise ValueError(f"Unsupported resource type: {resource_type}")
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        raise ValueError("Coordinates are outside valid latitude/longitude ranges")

    radius_m = max(100, min(int(radius_km * 1000), 50_000))
    clauses = [
        f"{element}{tag_filter}(around:{radius_m},{lat},{lng});"
        for tag_filter in filters
        for element in ("node", "way", "relation")
    ]
    query = f"[out:json][timeout:15];({''.join(clauses)});out center 200;"

    response = requests.post(
        OVERPASS_URL,
        data={"data": query},
        headers={"User-Agent": "MAVUNO-Green-Grid/1.0", "Accept": "application/json"},
        timeout=20,
    )
    response.raise_for_status()

    resources = []
    for element in response.json().get("elements", []):
        point_lat = element.get("lat", element.get("center", {}).get("lat"))
        point_lng = element.get("lon", element.get("center", {}).get("lon"))
        if point_lat is None or point_lng is None:
            continue

        distance = _distance_km(lat, lng, float(point_lat), float(point_lng))
        if distance > radius_km:
            continue

        tags = element.get("tags") or {}
        address = ", ".join(
            str(tags[key]) for key in (
                "addr:housenumber", "addr:street", "addr:place", "addr:suburb", "addr:city", "addr:county"
            ) if tags.get(key)
        ) or None
        buyer_type = (
            "Produce market" if tags.get("amenity") == "marketplace" else
            "Wholesaler prospect" if tags.get("shop") == "wholesale" else
            "Produce retailer prospect" if tags.get("shop") == "greengrocer" else
            "Retail buyer prospect" if tags.get("shop") == "supermarket" else
            "Food processor prospect" if tags.get("craft") == "food" or "food" in tags.get("industrial", "") else
            "Mapped market site"
        ) if resource_type == "market" else resource_type.replace("_", " ").title()
        resources.append(
            {
                "name": tags.get("name") or tags.get("name:en") or "Unnamed mapped site",
                "type": resource_type,
                "buyer_type": buyer_type,
                "lat": float(point_lat),
                "lng": float(point_lng),
                "address": address,
                "phone": tags.get("contact:phone") or tags.get("contact:mobile") or tags.get("phone"),
                "website": tags.get("contact:website") or tags.get("website"),
                "distance_km": round(distance, 2),
                "source": "OpenStreetMap",
                "map_url": f"https://www.google.com/maps/search/?api=1&query={point_lat},{point_lng}",
                "tags": {
                    key: tags[key]
                    for key in (
                        "amenity", "natural", "man_made", "industrial", "building", "shop", "craft",
                        "operator", "brand", "phone", "contact:phone", "contact:mobile", "website",
                        "contact:website", "addr:housenumber", "addr:street", "addr:place", "addr:suburb",
                        "addr:city", "addr:county",
                    )
                    if tags.get(key)
                },
            }
        )

    resources.sort(key=lambda resource: resource["distance_km"])
    return resources[: max(1, min(limit, 50))]
