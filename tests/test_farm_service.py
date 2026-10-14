# Sample Unit Tests

import pytest

from backend.farms.farm_service import FarmService


class TestFarmService:
    @pytest.fixture
    def farm_service(self):
        return FarmService(db={})

    def test_create_farm(self, farm_service):
        """Test farm creation."""
        farm_data = {
            "user_id": 7,
            "name": "Test Farm",
            "location": "Test Location",
            "size_hectares": 10,
        }

        farm = farm_service.create_farm(farm_data)

        assert farm["id"] == 1
        assert farm["name"] == "Test Farm"
        assert farm["location"] == "Test Location"
        assert farm["size_hectares"] == 10.0
        assert farm["status"] == "ACTIVE"

    def test_get_farm(self, farm_service):
        """Test retrieving farm."""
        created = farm_service.create_farm({
            "user_id": 9,
            "name": "Alpha Farm",
            "location": "Nakuru",
            "size_hectares": 5,
        })

        fetched = farm_service.get_farm(created["id"])

        assert fetched is not None
        assert fetched["id"] == created["id"]
        assert fetched["name"] == "Alpha Farm"
        assert fetched["location"] == "Nakuru"

    def test_update_farm(self, farm_service):
        """Test updating farm."""
        created = farm_service.create_farm({
            "user_id": 12,
            "name": "Beta Farm",
            "location": "Kiambu",
            "size_hectares": 7,
        })

        updated = farm_service.update_farm(
            created["id"],
            {"name": "Beta Farm Updated", "status": "INACTIVE", "size_hectares": 12},
        )

        assert updated["id"] == created["id"]
        assert updated["name"] == "Beta Farm Updated"
        assert updated["status"] == "INACTIVE"
        assert updated["size_hectares"] == 12.0

    def test_delete_farm(self, farm_service):
        """Test deleting farm."""
        created = farm_service.create_farm({
            "user_id": 15,
            "name": "Gamma Farm",
            "location": "Makueni",
            "size_hectares": 3,
        })

        assert farm_service.delete_farm(created["id"]) is True
        assert farm_service.get_farm(created["id"]) is None

