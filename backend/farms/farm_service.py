# Farm Management Service


class FarmService:
    _VALID_STATUSES = {"ACTIVE", "INACTIVE", "ARCHIVED"}

    def __init__(self, db=None):
        self.db = db
        self._store = self._resolve_store()

    def _resolve_store(self):
        if self.db is None:
            if not hasattr(self, "_memory_store"):
                self._memory_store = {}
            return self._memory_store

        if isinstance(self.db, dict):
            self.db.setdefault("farms", {})
            return self.db["farms"]

        farms = getattr(self.db, "farms", None)
        if isinstance(farms, dict):
            return farms

        if hasattr(self.db, "__getitem__") and "farms" in getattr(self.db, "__dict__", {}):
            return self.db.__dict__["farms"]

        if not hasattr(self, "_memory_store"):
            self._memory_store = {}
        return self._memory_store

    def _copy_record(self, record):
        if record is None:
            return None
        return dict(record)

    def _normalise_status(self, value):
        if value is None:
            return "ACTIVE"
        status = str(value).strip().upper()
        if status not in self._VALID_STATUSES:
            raise ValueError("Farm status must be one of: ACTIVE, INACTIVE, ARCHIVED")
        return status

    def _validate_farm_data(self, farm_data):
        validated = dict(farm_data or {})
        name = validated.get("name")
        if name is not None:
            name = str(name).strip()
            if not name:
                raise ValueError("Farm name is required")
            validated["name"] = name

        size = validated.get("size_hectares")
        if size is not None:
            size = float(size)
            if size <= 0:
                raise ValueError("Farm size must be greater than zero")
            validated["size_hectares"] = size

        if "status" in validated:
            validated["status"] = self._normalise_status(validated["status"])

        latitude = validated.get("latitude")
        if latitude is not None:
            latitude = float(latitude)
            if latitude < -90 or latitude > 90:
                raise ValueError("Latitude must be between -90 and 90")
            validated["latitude"] = latitude

        longitude = validated.get("longitude")
        if longitude is not None:
            longitude = float(longitude)
            if longitude < -180 or longitude > 180:
                raise ValueError("Longitude must be between -180 and 180")
            validated["longitude"] = longitude

        if "user_id" in validated and validated["user_id"] is not None:
            validated["user_id"] = int(validated["user_id"])

        if "id" in validated:
            validated["id"] = int(validated["id"])

        return validated

    def create_farm(self, farm_data):
        """Create a new farm record."""
        normalized = self._validate_farm_data(farm_data)
        name = normalized.get("name")
        if name is None or not str(name).strip():
            raise ValueError("Farm name is required")

        size = normalized.get("size_hectares")
        if size is None:
            raise ValueError("Farm size is required")
        if float(size) <= 0:
            raise ValueError("Farm size must be greater than zero")

        next_id = 1
        if self._store:
            next_id = max(int(record.get("id", 0)) for record in self._store.values()) + 1

        record = {
            "id": next_id,
            "user_id": normalized.get("user_id"),
            "name": str(normalized["name"]).strip(),
            "location": normalized.get("location"),
            "latitude": normalized.get("latitude"),
            "longitude": normalized.get("longitude"),
            "size_hectares": float(size),
            "soil_type": normalized.get("soil_type"),
            "climate_zone": normalized.get("climate_zone"),
            "status": self._normalise_status(normalized.get("status", "ACTIVE")),
        }
        self._store[next_id] = record
        return self._copy_record(record)

    def get_farm(self, farm_id):
        """Retrieve farm details."""
        record = self._store.get(int(farm_id))
        return self._copy_record(record)

    def update_farm(self, farm_id, farm_data):
        """Update farm information."""
        farm_id = int(farm_id)
        current = self._store.get(farm_id)
        if current is None:
            return None

        updated = self._validate_farm_data({**current, **(farm_data or {})})
        if "name" in updated and (updated["name"] is None or not str(updated["name"]).strip()):
            raise ValueError("Farm name is required")

        if "size_hectares" in updated and updated["size_hectares"] is not None and float(updated["size_hectares"]) <= 0:
            raise ValueError("Farm size must be greater than zero")

        new_record = {**current, **updated}
        new_record["status"] = self._normalise_status(new_record.get("status", current.get("status", "ACTIVE")))
        if new_record.get("user_id") is not None:
            new_record["user_id"] = int(new_record["user_id"])
        if new_record.get("name") is not None:
            new_record["name"] = str(new_record["name"]).strip()
        self._store[farm_id] = new_record
        return self._copy_record(new_record)

    def delete_farm(self, farm_id):
        """Delete a farm record."""
        farm_id = int(farm_id)
        if farm_id not in self._store:
            return False
        del self._store[farm_id]
        return True

