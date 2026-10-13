"""Run relevant farm data tools and format successful results for the advisor."""

import json
import logging
import math
from concurrent.futures import ThreadPoolExecutor, as_completed

logger = logging.getLogger(__name__)


def collect_farm_context(lat: float | None, lng: float | None, question: str) -> str:
    if lat is None or lng is None:
        return ""
    if not (math.isfinite(lat) and math.isfinite(lng) and -90 <= lat <= 90 and -180 <= lng <= 180):
        logger.warning("Skipping farm tools because coordinates are invalid")
        return ""

    text = question.lower()
    jobs = {
        "current agronomic conditions": lambda: _get_agronomics(lat, lng),
        "baseline soil profile": lambda: _get_soil(lat, lng),
    }

    if any(word in text for word in (
        "slope", "elevation", "drainage", "erosion", "runoff", "mteremko", "mafuriko"
    )):
        jobs["farm elevation"] = lambda: _get_elevation(lat, lng)

    if any(word in text for word in (
        "weather", "forecast", "rain", "season", "climate", "drought", "mvua", "msimu"
    )):
        jobs["historical climate baseline"] = lambda: _get_climate(lat, lng)

    if any(word in text for word in (
        "health", "stress", "disease", "pest", "crop", "plant", "leaf", "leaves",
        "tomato", "tomatoes", "kale", "maize", "yellow", "wilting", "afya", "ugonjwa",
    )):
        jobs["satellite vegetation health"] = lambda: _get_ndvi(lat, lng)

    resource_type = _resource_type(text)
    if resource_type:
        jobs["nearby mapped resources"] = lambda: _get_resources(lat, lng, resource_type)

    results = []
    with ThreadPoolExecutor(max_workers=len(jobs)) as executor:
        futures = {executor.submit(tool): name for name, tool in jobs.items()}
        try:
            for future in as_completed(futures, timeout=22):
                name = futures[future]
                try:
                    result = future.result()
                    if result not in (None, {}, [], ""):
                        results.append((name, result))
                except Exception as error:
                    logger.warning("Farm context tool '%s' failed: %s", name, error)
        except TimeoutError:
            for future, name in futures.items():
                if not future.done():
                    logger.warning("Farm context tool '%s' exceeded the context deadline", name)
                    future.cancel()

    if not results:
        return ""

    lines = [
        "Farm context readings (use only relevant items; distinguish current readings from long-term estimates):"
    ]
    for name, result in results:
        lines.append(f"- {name}: {json.dumps(result, ensure_ascii=False, default=str)}")
    lines.append(
        "Treat soil maps and historical climate as regional baselines, not field tests or forecasts. "
        "Mapped places are leads; do not claim their opening status or services are verified."
    )
    return "\n".join(lines)


def _get_agronomics(lat: float, lng: float):
    from tools.openmeteo_agro import get_agronomic_data

    return get_agronomic_data(lat, lng)


def _get_soil(lat: float, lng: float):
    from tools.soil_baseline import get_soil_baseline

    return get_soil_baseline(lat, lng)


def _get_elevation(lat: float, lng: float):
    from tools.terrain import get_elevation

    return {"elevation_m": get_elevation(lat, lng)}


def _get_climate(lat: float, lng: float):
    from tools.nasa_power import get_historical_climatology

    return get_historical_climatology(lat, lng)


def _get_ndvi(lat: float, lng: float):
    from tools.copernicus_ndvi import get_satellite_ndvi

    return get_satellite_ndvi(lat, lng)


def _get_resources(lat: float, lng: float, resource_type: str):
    from tools.radius_search import search_nearby_resources

    return search_nearby_resources(lat, lng, radius_km=25, resource_type=resource_type)


def _resource_type(text: str) -> str | None:
    if any(word in text for word in ("cold store", "cold storage", "warehouse", "ghala", "hifadhi")):
        return "cold_store"
    if any(word in text for word in ("water", "borehole", "well", "river", "maji", "mto")):
        return "water"
    if any(word in text for word in ("market", "buyer", "sell", "selling", "price", "soko", "mnunuzi", "kuuza", "bei")):
        return "market"
    return None
