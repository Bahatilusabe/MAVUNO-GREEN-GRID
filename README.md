# MAVUNO-GREEN-GRID

```
MAVUNO-GREEN-GRID
├─ ai
│  ├─ explanations
│  │  ├─ explainer.py
│  │  └─ README.md
│  ├─ forecasting
│  │  ├─ forecaster.py
│  │  └─ README.md
│  ├─ matching
│  │  ├─ matcher.py
│  │  └─ README.md
│  ├─ optimization
│  │  ├─ optimizer.py
│  │  └─ README.md
│  └─ risk
│     ├─ README.md
│     └─ risk_assessor.py
├─ backend
│  ├─ api
│  │  ├─ README.md
│  │  └─ routes.py
│  ├─ auth
│  │  ├─ auth_service.py
│  │  └─ README.md
│  ├─ crops
│  │  ├─ crop_service.py
│  │  └─ README.md
│  ├─ farms
│  │  ├─ farm_service.py
│  │  └─ README.md
│  ├─ impact
│  │  ├─ impact_service.py
│  │  └─ README.md
│  ├─ interventions
│  │  ├─ intervention_service.py
│  │  └─ README.md
│  ├─ logistics
│  │  ├─ logistics_service.py
│  │  └─ README.md
│  ├─ markets
│  │  ├─ market_service.py
│  │  └─ README.md
│  ├─ matching
│  │  ├─ matching_service.py
│  │  └─ README.md
│  ├─ notifications
│  │  ├─ notification_service.py
│  │  └─ README.md
│  ├─ resources
│  │  ├─ README.md
│  │  └─ resource_service.py
│  └─ storage
│     ├─ README.md
│     └─ storage_manager.py
├─ data
│  ├─ feature_engineering
│  │  ├─ feature_engineer.py
│  │  └─ README.md
│  ├─ ingestion
│  │  ├─ ingestion_service.py
│  │  └─ README.md
│  ├─ transformation
│  │  ├─ README.md
│  │  └─ transformer.py
│  └─ validation
│     ├─ README.md
│     └─ validator.py
├─ database
│  ├─ ARCHITECTURE.md
│  ├─ ERD.md
│  ├─ migrations
│  │  ├─ 001_create_users_table.sql
│  │  ├─ 002_create_farms_table.sql
│  │  ├─ 003_create_crops_table.sql
│  │  ├─ 004_create_resources_table.sql
│  │  ├─ 005_create_interventions_table.sql
│  │  ├─ 006_create_transactions_table.sql
│  │  ├─ migrate.py
│  │  ├─ MIGRATION_GUIDE.md
│  │  └─ README.md
│  ├─ schema
│  │  ├─ README.md
│  │  └─ schema.sql
│  ├─ seeds
│  │  ├─ README.md
│  │  └─ seeder.py
│  └─ views
│     ├─ README.md
│     └─ views.sql
├─ docs
│  └─ README.md
├─ frontend
│  ├─ admin
│  │  ├─ AdminDashboard.css
│  │  ├─ AdminDashboard.jsx
│  │  └─ README.md
│  ├─ dashboard
│  │  ├─ Dashboard.css
│  │  ├─ Dashboard.jsx
│  │  └─ README.md
│  ├─ farmer
│  │  ├─ FarmerPortal.css
│  │  ├─ FarmerPortal.jsx
│  │  └─ README.md
│  └─ partner
│     ├─ PartnerPortal.css
│     ├─ PartnerPortal.jsx
│     └─ README.md
├─ integrations
│  ├─ maps
│  │  ├─ maps_service.py
│  │  └─ README.md
│  ├─ markets
│  │  ├─ market_data_service.py
│  │  └─ README.md
│  ├─ notifications
│  │  ├─ notification_providers.py
│  │  └─ README.md
│  └─ weather
│     ├─ README.md
│     └─ weather_service.py
├─ LICENSE
├─ README.md
└─ tests
   ├─ README.md
   └─ test_farm_service.py
```

```
MAVUNO-GREEN-GRID
├─ ai
│  ├─ explanations
│  │  ├─ explainer.py
│  │  └─ README.md
│  ├─ forecasting
│  │  ├─ forecaster.py
│  │  └─ README.md
│  ├─ matching
│  │  ├─ matcher.py
│  │  └─ README.md
│  ├─ optimization
│  │  ├─ optimizer.py
│  │  └─ README.md
│  └─ risk
│     ├─ README.md
│     └─ risk_assessor.py
├─ backend
│  ├─ api
│  │  ├─ README.md
│  │  └─ routes.py
│  ├─ auth
│  │  ├─ auth_service.py
│  │  └─ README.md
│  ├─ crops
│  │  ├─ crop_service.py
│  │  └─ README.md
│  ├─ farms
│  │  ├─ farm_service.py
│  │  └─ README.md
│  ├─ impact
│  │  ├─ impact_service.py
│  │  └─ README.md
│  ├─ interventions
│  │  ├─ intervention_service.py
│  │  └─ README.md
│  ├─ logistics
│  │  ├─ logistics_service.py
│  │  └─ README.md
│  ├─ markets
│  │  ├─ market_service.py
│  │  └─ README.md
│  ├─ matching
│  │  ├─ matching_service.py
│  │  └─ README.md
│  ├─ notifications
│  │  ├─ notification_service.py
│  │  └─ README.md
│  ├─ resources
│  │  ├─ README.md
│  │  └─ resource_service.py
│  └─ storage
│     ├─ README.md
│     └─ storage_manager.py
├─ data
│  ├─ feature_engineering
│  │  ├─ feature_engineer.py
│  │  └─ README.md
│  ├─ ingestion
│  │  ├─ ingestion_service.py
│  │  └─ README.md
│  ├─ transformation
│  │  ├─ README.md
│  │  └─ transformer.py
│  └─ validation
│     ├─ README.md
│     └─ validator.py
├─ database
│  ├─ ARCHITECTURE.md
│  ├─ ERD.md
│  ├─ migrations
│  │  ├─ 001_create_users_table.sql
│  │  ├─ 002_create_farms_table.sql
│  │  ├─ 003_create_crops_table.sql
│  │  ├─ 004_create_resources_table.sql
│  │  ├─ 005_create_interventions_table.sql
│  │  ├─ 006_create_transactions_table.sql
│  │  ├─ migrate.py
│  │  ├─ MIGRATION_GUIDE.md
│  │  └─ README.md
│  ├─ schema
│  │  ├─ README.md
│  │  └─ schema.sql
│  ├─ seeds
│  │  ├─ README.md
│  │  └─ seeder.py
│  └─ views
│     ├─ README.md
│     └─ views.sql
├─ docs
│  └─ README.md
├─ frontend
│  ├─ admin
│  │  ├─ AdminDashboard.css
│  │  ├─ AdminDashboard.jsx
│  │  └─ README.md
│  ├─ dashboard
│  │  ├─ Dashboard.css
│  │  ├─ Dashboard.jsx
│  │  └─ README.md
│  ├─ farmer
│  │  ├─ FarmerPortal.css
│  │  ├─ FarmerPortal.jsx
│  │  └─ README.md
│  └─ partner
│     ├─ PartnerPortal.css
│     ├─ PartnerPortal.jsx
│     └─ README.md
├─ integrations
│  ├─ maps
│  │  ├─ maps_service.py
│  │  └─ README.md
│  ├─ markets
│  │  ├─ market_data_service.py
│  │  └─ README.md
│  ├─ notifications
│  │  ├─ notification_providers.py
│  │  └─ README.md
│  └─ weather
│     ├─ README.md
│     └─ weather_service.py
├─ LICENSE
├─ README.md
└─ tests
   ├─ README.md
   └─ test_farm_service.py
```
