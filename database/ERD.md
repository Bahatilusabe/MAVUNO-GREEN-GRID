# MAVUNO-GREEN-GRID Database ERD

## Entity Relationship Diagram

```
┌─────────────────────┐
│      USERS          │
├─────────────────────┤
│ id (PK)             │
│ username (UNIQUE)   │
│ email (UNIQUE)      │
│ password_hash       │
│ first_name          │
│ last_name           │
│ phone               │
│ role                │
│ status              │
│ created_at          │
│ updated_at          │
└─────────────────────┘
        │ 1
        │
        │ N
        ├──────────────────────┐
        │                      │
        ▼ N                    ▼ N
┌─────────────────────┐  ┌──────────────────┐
│      FARMS          │  │   PARTNERSHIPS   │
├─────────────────────┤  ├──────────────────┤
│ id (PK)             │  │ id (PK)          │
│ user_id (FK)        │  │ farmer_id (FK)   │
│ name                │  │ partner_id (FK)  │
│ location            │  │ status           │
│ latitude            │  │ start_date       │
│ longitude           │  │ end_date         │
│ size_hectares       │  │ created_at       │
│ soil_type           │  └──────────────────┘
│ climate_zone        │
│ status              │
│ created_at          │
│ updated_at          │
└─────────────────────┘
        │ 1
        │
        │ N
        ├──────────────────────┐
        │                      │
        ▼ N                    ▼ N
┌─────────────────────┐  ┌──────────────────┐
│      CROPS          │  │   RESOURCES      │
├─────────────────────┤  ├──────────────────┤
│ id (PK)             │  │ id (PK)          │
│ farm_id (FK)        │  │ farm_id (FK)     │
│ crop_type           │  │ resource_type    │
│ variety             │  │ name             │
│ planting_date       │  │ quantity         │
│ expected_harvest    │  │ unit             │
│ actual_harvest      │  │ status           │
│ area_planted        │  │ purchase_date    │
│ expected_yield      │  │ expiry_date      │
│ actual_yield        │  │ cost             │
│ status              │  │ supplier         │
│ created_at          │  │ created_at       │
│ updated_at          │  │ updated_at       │
└─────────────────────┘  └──────────────────┘
        │ 1                   │ 1
        │                     │
        │ N                   │ N
        ├─────────────────────┤
        │                     │
        ▼ N                   ▼ N
┌──────────────────────────────────────────┐
│     CROP_RESOURCE_ALLOCATION             │
├──────────────────────────────────────────┤
│ id (PK)                                  │
│ crop_id (FK)                             │
│ resource_id (FK)                         │
│ quantity_allocated                       │
│ allocation_date                          │
│ usage_date                               │
│ status                                   │
│ created_at                               │
└──────────────────────────────────────────┘

┌─────────────────────┐
│    INTERVENTIONS    │
├─────────────────────┤
│ id (PK)             │
│ farm_id (FK)        │
│ crop_id (FK)        │
│ intervention_type   │
│ description         │
│ recommended_date    │
│ implementation_date │
│ status              │
│ outcome             │
│ cost                │
│ priority            │
│ created_at          │
│ updated_at          │
└─────────────────────┘
        │ 1
        │
        │ N
        ▼
┌──────────────────────────────────────────┐
│     INTERVENTION_ACTIONS                 │
├──────────────────────────────────────────┤
│ id (PK)                                  │
│ intervention_id (FK)                     │
│ action_description                       │
│ status                                   │
│ completed_date                           │
│ notes                                    │
│ created_at                               │
└──────────────────────────────────────────┘

┌─────────────────────┐
│    WEATHER_DATA     │
├─────────────────────┤
│ id (PK)             │
│ farm_id (FK)        │
│ date                │
│ temperature_min     │
│ temperature_max     │
│ humidity            │
│ rainfall            │
│ wind_speed          │
│ uv_index            │
│ conditions          │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│   MARKET_PRICES     │
├─────────────────────┤
│ id (PK)             │
│ crop_type           │
│ date                │
│ price_per_unit      │
│ region              │
│ quality_grade       │
│ source              │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│   SHIPMENTS         │
├─────────────────────┤
│ id (PK)             │
│ farm_id (FK)        │
│ buyer_id (FK)       │
│ crop_id (FK)        │
│ quantity            │
│ unit                │
│ origin_location     │
│ destination         │
│ shipment_date       │
│ expected_delivery   │
│ actual_delivery     │
│ status              │
│ tracking_number     │
│ cost                │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│   IMPACT_METRICS    │
├─────────────────────┤
│ id (PK)             │
│ farm_id (FK)        │
│ metric_type         │
│ value               │
│ unit                │
│ measurement_date    │
│ notes               │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│  NOTIFICATIONS      │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ type                │
│ title               │
│ message             │
│ is_read             │
│ read_at             │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│   AUDIT_LOGS        │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ action              │
│ table_name          │
│ record_id           │
│ old_values          │
│ new_values          │
│ created_at          │
└─────────────────────┘
```

## Key Relationships

### Users (1:N) Farms
- One user can own multiple farms
- Each farm belongs to one user

### Farms (1:N) Crops
- One farm can have multiple crops
- Each crop belongs to one farm

### Farms (1:N) Resources
- One farm can have multiple resources
- Each resource belongs to one farm

### Crops (M:N) Resources via Crop_Resource_Allocation
- A crop can use multiple resources
- A resource can be allocated to multiple crops

### Farms (1:N) Interventions
- One farm can have multiple interventions
- Each intervention targets one farm

### Crops (1:N) Interventions
- One crop can have multiple interventions
- Each intervention can target one crop

### Users (M:N) Users (via Partnerships)
- A farmer can have partnerships with multiple partners
- A partner can have partnerships with multiple farmers

### Farms (1:N) Weather_Data
- One farm can have multiple weather records

### Farms (1:N) Shipments
- One farm can have multiple shipments

### Shipments (N:1) Users
- Shipments reference buyer (another user)

### Farms (1:N) Impact_Metrics
- One farm can have multiple impact metrics

### Users (1:N) Notifications
- One user can have multiple notifications

### Users (1:N) Audit_Logs
- One user can have multiple audit log entries

## Indexes

Key columns indexed for performance:
- users.username, users.email
- farms.user_id, farms.location
- crops.farm_id, crops.crop_type
- resources.farm_id, resources.resource_type
- interventions.farm_id, interventions.crop_id, interventions.status
- weather_data.farm_id, weather_data.date
- market_prices.crop_type, market_prices.date
- shipments.farm_id, shipments.status, shipments.tracking_number
- impact_metrics.farm_id, impact_metrics.metric_type
- notifications.user_id, notifications.is_read
- audit_logs.user_id, audit_logs.created_at

## Data Types

- **id**: Auto-incrementing integer (Primary Key)
- **FK**: Foreign Key references
- **UNIQUE**: Enforces unique constraint
- **Timestamps**: created_at, updated_at for audit trail
- **Status fields**: ENUM or VARCHAR for state tracking
- **Monetary fields**: DECIMAL(10, 2) for precision
- **Spatial fields**: DECIMAL(10, 8) for lat/long
- **JSON fields**: For flexible metadata storage
