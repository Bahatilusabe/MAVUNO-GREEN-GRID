# MAVUNO-GREEN-GRID

MAVUNO Green Grid is a prototype agricultural platform with a React frontend and Python service modules for farm, market, and data workflows. The frontend currently uses local sample data; it is not wired to the Python modules or a live database.

## Run the Frontend

Requirements: Node.js and npm.

The Vite server prints the local URL. The app uses hash routes: `#/dashboard`, `#/farmer`, `#/admin`, and `#/partner`. Farmer subviews are available under `#/farmer/<view>`.

Useful frontend checks, from `frontend/`:

```powershell
npm run lint
npm run build
```

## Repository Status

- `frontend/`: Vite/React dashboards and portals backed by in-memory fixtures and local component state.
- `backend/`: Python API blueprint, JWT token helper, and service-class scaffolds. There is no backend application entry point or shared Python dependency manifest yet.
- `ai/`, `data/`, and `integrations/`: prototype model, pipeline, and provider modules; several methods are unimplemented placeholders.
- `database/`: SQL schema, migrations, seed, and view examples. The Python migration and seed helpers are incomplete; see their module READMEs before using them.
- `tests/`: currently contains a farm-service test scaffold; it does not yet assert service behavior.

See [docs/README.md](docs/README.md) for the component map and [frontend/README.md](frontend/README.md) for frontend routes and commands.

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
│  ├─ pipeline
│  │  ├─ allocation.py
│  │  ├─ brain.py
│  │  ├─ brain_schema.py
│  │  ├─ check_nvidia.py
│  │  ├─ compare_models.py
│  │  ├─ explanation.py
│  │  ├─ impact.py
│  │  ├─ list_models.py
│  │  ├─ matching_scores.py
│  │  ├─ run_pipeline.py
│  │  ├─ surplus_forecast.py
│  │  └─ __pycache__
│  │     ├─ allocation.cpython-314.pyc
│  │     ├─ brain.cpython-314.pyc
│  │     ├─ brain_schema.cpython-314.pyc
│  │     ├─ explanation.cpython-314.pyc
│  │     ├─ impact.cpython-314.pyc
│  │     ├─ matching_scores.cpython-314.pyc
│  │     ├─ run_pipeline.cpython-314.pyc
│  │     └─ surplus_forecast.cpython-314.pyc
│  └─ risk
│     ├─ README.md
│     └─ risk_assessor.py
├─ backend
│  ├─ .env
│  ├─ .env.example
│  ├─ api
│  │  ├─ README.md
│  │  └─ routes.py
│  ├─ auth
│  │  ├─ auth_service.py
│  │  └─ README.md
│  ├─ crops
│  │  ├─ crop_service.py
│  │  └─ README.md
│  ├─ docker-compose.yml
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
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ resources
│  │  ├─ README.md
│  │  └─ resource_service.py
│  ├─ src
│  │  ├─ app.js
│  │  ├─ config.js
│  │  ├─ db
│  │  │  ├─ migrate.js
│  │  │  ├─ migrations
│  │  │  │  ├─ 001_init.sql
│  │  │  │  ├─ middleware
│  │  │  │  │  ├─ auth.js
│  │  │  │  │  ├─ error.js
│  │  │  │  │  └─ validate.js
│  │  │  │  └─ utils
│  │  │  │     └─ errors.js
│  │  │  ├─ pool.js
│  │  │  └─ seed.js
│  │  ├─ modules
│  │  │  ├─ auth
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  └─ farms
│  │  │     ├─ routes.js
│  │  │     ├─ schemas.js
│  │  │     └─ service.js
│  │  ├─ pool.js
│  │  ├─ server.js
│  │  └─ utils
│  │     └─ errors.js
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
│  ├─ .oxlintrc.json
│  ├─ admin
│  │  ├─ AdminDashboard.jsx
│  │  ├─ components
│  │  │  ├─ AlertsCard.jsx
│  │  │  ├─ ChartCards.jsx
│  │  │  ├─ FarmersTable.jsx
│  │  │  ├─ HealthCard.jsx
│  │  │  ├─ KpiGrid.jsx
│  │  │  └─ PartnersCard.jsx
│  │  ├─ data.js
│  │  └─ README.md
│  ├─ components.json
│  ├─ dashboard
│  │  ├─ components
│  │  │  ├─ ActivityCard.jsx
│  │  │  ├─ CropsCard.jsx
│  │  │  ├─ ForecastCard.jsx
│  │  │  ├─ KpiGrid.jsx
│  │  │  ├─ OpportunitiesCard.jsx
│  │  │  ├─ PricesCard.jsx
│  │  │  ├─ RecsCard.jsx
│  │  │  └─ WeatherCard.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ data.js
│  │  └─ README.md
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ AdminDashboard-BbAAEN6P.js
│  │  │  ├─ Assistant-B8jNffVY.js
│  │  │  ├─ charts-CBBI-Ads.js
│  │  │  ├─ Dashboard-Bw-0TDE0.js
│  │  │  ├─ FarmerPortal-CYBkQHlO.js
│  │  │  ├─ geist-cyrillic-ext-wght-normal-DjL33-gN.woff2
│  │  │  ├─ geist-cyrillic-wght-normal-BEAKL7Jp.woff2
│  │  │  ├─ geist-latin-ext-wght-normal-DC-KSUi6.woff2
│  │  │  ├─ geist-latin-wght-normal-BgDaEnEv.woff2
│  │  │  ├─ geist-vietnamese-wght-normal-6IgcOCM7.woff2
│  │  │  ├─ index-Cim8bZbt.css
│  │  │  ├─ index-C_8KvbLx.js
│  │  │  ├─ leaf-9KuagMQM.js
│  │  │  ├─ PartnerPortal-DgDS-EKm.js
│  │  │  ├─ recycle-B4KQj1sD.js
│  │  │  └─ triangle-alert-DG-dIYod.js
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ farmer
│  │  ├─ components
│  │  │  ├─ page-parts.jsx
│  │  │  └─ ui.jsx
│  │  ├─ constants.js
│  │  ├─ FarmerPortal.jsx
│  │  ├─ README.md
│  │  └─ views
│  │     ├─ AddFarmForm.jsx
│  │     ├─ Crops.jsx
│  │     ├─ FarmDetails.jsx
│  │     ├─ Forecast.jsx
│  │     ├─ impact
│  │     │  ├─ data.js
│  │     │  ├─ Interventions.jsx
│  │     │  ├─ Recovery.jsx
│  │     │  ├─ Reports.jsx
│  │     │  ├─ Sources.jsx
│  │     │  └─ Trend.jsx
│  │     ├─ Impact.jsx
│  │     ├─ Market.jsx
│  │     ├─ messages
│  │     │  ├─ data.js
│  │     │  └─ NotificationItem.jsx
│  │     ├─ Messages.jsx
│  │     ├─ MyFarms.jsx
│  │     ├─ Opportunities.jsx
│  │     ├─ overview
│  │     │  ├─ data.js
│  │     │  ├─ EnvImpact.jsx
│  │     │  ├─ FarmsTable.jsx
│  │     │  ├─ GridActivity.jsx
│  │     │  ├─ HarvestOutlook.jsx
│  │     │  ├─ RiskWatch.jsx
│  │     │  ├─ StatCards.jsx
│  │     │  └─ TodayRecs.jsx
│  │     ├─ Overview.jsx
│  │     ├─ Profile.jsx
│  │     ├─ Recommendations.jsx
│  │     ├─ storage
│  │     │  ├─ CapacityTimeline.jsx
│  │     │  ├─ data.js
│  │     │  ├─ FacilitiesTable.jsx
│  │     │  ├─ MapCard.jsx
│  │     │  ├─ RecommendedCard.jsx
│  │     │  └─ Reservations.jsx
│  │     ├─ Storage.jsx
│  │     ├─ transport
│  │     │  ├─ data.js
│  │     │  ├─ Deliveries.jsx
│  │     │  ├─ MapCard.jsx
│  │     │  ├─ PlanCard.jsx
│  │     │  ├─ QuickActions.jsx
│  │     │  └─ RequestsTable.jsx
│  │     └─ Transport.jsx
│  ├─ index.html
│  ├─ jsconfig.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ partner
│  │  ├─ components
│  │  │  ├─ CapacityBar.jsx
│  │  │  ├─ KpiGrid.jsx
│  │  │  ├─ ListingTab.jsx
│  │  │  ├─ OrdersTab.jsx
│  │  │  ├─ RequestsTab.jsx
│  │  │  └─ VolumeCard.jsx
│  │  ├─ data.js
│  │  ├─ PartnerPortal.jsx
│  │  ├─ README.md
│  │  └─ usePartnerStats.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ shared
│  │  ├─ Assistant.jsx
│  │  ├─ chartColors.js
│  │  ├─ charts.jsx
│  │  ├─ data.js
│  │  ├─ EmptyState.jsx
│  │  ├─ nav.js
│  │  ├─ Shell.jsx
│  │  ├─ Skeleton.jsx
│  │  └─ utils.js
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  └─ ui
│  │  │     └─ button.jsx
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  └─ utils.js
│  │  ├─ main.jsx
│  │  └─ styles
│  │     ├─ admin.css
│  │     ├─ app.css
│  │     ├─ assistant.css
│  │     ├─ dashboard.css
│  │     ├─ farmer.css
│  │     ├─ overview.css
│  │     ├─ pages.css
│  │     ├─ partner.css
│  │     └─ shell.css
│  └─ vite.config.js
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
├─ src
│  └─ styles
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
│  ├─ pipeline
│  │  ├─ allocation.py
│  │  ├─ brain.py
│  │  ├─ brain_schema.py
│  │  ├─ check_nvidia.py
│  │  ├─ compare_models.py
│  │  ├─ explanation.py
│  │  ├─ impact.py
│  │  ├─ list_models.py
│  │  ├─ matching_scores.py
│  │  ├─ run_pipeline.py
│  │  ├─ surplus_forecast.py
│  │  └─ __pycache__
│  │     ├─ allocation.cpython-314.pyc
│  │     ├─ brain.cpython-314.pyc
│  │     ├─ brain_schema.cpython-314.pyc
│  │     ├─ explanation.cpython-314.pyc
│  │     ├─ impact.cpython-314.pyc
│  │     ├─ matching_scores.cpython-314.pyc
│  │     ├─ run_pipeline.cpython-314.pyc
│  │     └─ surplus_forecast.cpython-314.pyc
│  └─ risk
│     ├─ README.md
│     └─ risk_assessor.py
├─ backend
│  ├─ .env
│  ├─ .env.example
│  ├─ api
│  │  ├─ README.md
│  │  └─ routes.py
│  ├─ auth
│  │  ├─ auth_service.py
│  │  └─ README.md
│  ├─ crops
│  │  ├─ crop_service.py
│  │  └─ README.md
│  ├─ docker-compose.yml
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
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ resources
│  │  ├─ README.md
│  │  └─ resource_service.py
│  ├─ src
│  │  ├─ app.js
│  │  ├─ config.js
│  │  ├─ db
│  │  │  ├─ migrate.js
│  │  │  ├─ migrations
│  │  │  │  ├─ 001_init.sql
│  │  │  │  ├─ middleware
│  │  │  │  │  ├─ auth.js
│  │  │  │  │  ├─ error.js
│  │  │  │  │  └─ validate.js
│  │  │  │  └─ utils
│  │  │  │     └─ errors.js
│  │  │  ├─ pool.js
│  │  │  └─ seed.js
│  │  ├─ modules
│  │  │  ├─ auth
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  └─ farms
│  │  │     ├─ routes.js
│  │  │     ├─ schemas.js
│  │  │     └─ service.js
│  │  ├─ pool.js
│  │  ├─ server.js
│  │  └─ utils
│  │     └─ errors.js
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
│  ├─ .oxlintrc.json
│  ├─ admin
│  │  ├─ AdminDashboard.jsx
│  │  ├─ components
│  │  │  ├─ AlertsCard.jsx
│  │  │  ├─ ChartCards.jsx
│  │  │  ├─ FarmersTable.jsx
│  │  │  ├─ HealthCard.jsx
│  │  │  ├─ KpiGrid.jsx
│  │  │  └─ PartnersCard.jsx
│  │  ├─ data.js
│  │  └─ README.md
│  ├─ components.json
│  ├─ dashboard
│  │  ├─ components
│  │  │  ├─ ActivityCard.jsx
│  │  │  ├─ CropsCard.jsx
│  │  │  ├─ ForecastCard.jsx
│  │  │  ├─ KpiGrid.jsx
│  │  │  ├─ OpportunitiesCard.jsx
│  │  │  ├─ PricesCard.jsx
│  │  │  ├─ RecsCard.jsx
│  │  │  └─ WeatherCard.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ data.js
│  │  └─ README.md
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ AdminDashboard-BbAAEN6P.js
│  │  │  ├─ Assistant-B8jNffVY.js
│  │  │  ├─ charts-CBBI-Ads.js
│  │  │  ├─ Dashboard-Bw-0TDE0.js
│  │  │  ├─ FarmerPortal-CYBkQHlO.js
│  │  │  ├─ geist-cyrillic-ext-wght-normal-DjL33-gN.woff2
│  │  │  ├─ geist-cyrillic-wght-normal-BEAKL7Jp.woff2
│  │  │  ├─ geist-latin-ext-wght-normal-DC-KSUi6.woff2
│  │  │  ├─ geist-latin-wght-normal-BgDaEnEv.woff2
│  │  │  ├─ geist-vietnamese-wght-normal-6IgcOCM7.woff2
│  │  │  ├─ index-Cim8bZbt.css
│  │  │  ├─ index-C_8KvbLx.js
│  │  │  ├─ leaf-9KuagMQM.js
│  │  │  ├─ PartnerPortal-DgDS-EKm.js
│  │  │  ├─ recycle-B4KQj1sD.js
│  │  │  └─ triangle-alert-DG-dIYod.js
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ farmer
│  │  ├─ components
│  │  │  ├─ page-parts.jsx
│  │  │  └─ ui.jsx
│  │  ├─ constants.js
│  │  ├─ FarmerPortal.jsx
│  │  ├─ README.md
│  │  └─ views
│  │     ├─ AddFarmForm.jsx
│  │     ├─ Crops.jsx
│  │     ├─ FarmDetails.jsx
│  │     ├─ Forecast.jsx
│  │     ├─ impact
│  │     │  ├─ data.js
│  │     │  ├─ Interventions.jsx
│  │     │  ├─ Recovery.jsx
│  │     │  ├─ Reports.jsx
│  │     │  ├─ Sources.jsx
│  │     │  └─ Trend.jsx
│  │     ├─ Impact.jsx
│  │     ├─ Market.jsx
│  │     ├─ messages
│  │     │  ├─ data.js
│  │     │  └─ NotificationItem.jsx
│  │     ├─ Messages.jsx
│  │     ├─ MyFarms.jsx
│  │     ├─ Opportunities.jsx
│  │     ├─ overview
│  │     │  ├─ data.js
│  │     │  ├─ EnvImpact.jsx
│  │     │  ├─ FarmsTable.jsx
│  │     │  ├─ GridActivity.jsx
│  │     │  ├─ HarvestOutlook.jsx
│  │     │  ├─ RiskWatch.jsx
│  │     │  ├─ StatCards.jsx
│  │     │  └─ TodayRecs.jsx
│  │     ├─ Overview.jsx
│  │     ├─ Profile.jsx
│  │     ├─ Recommendations.jsx
│  │     ├─ storage
│  │     │  ├─ CapacityTimeline.jsx
│  │     │  ├─ data.js
│  │     │  ├─ FacilitiesTable.jsx
│  │     │  ├─ MapCard.jsx
│  │     │  ├─ RecommendedCard.jsx
│  │     │  └─ Reservations.jsx
│  │     ├─ Storage.jsx
│  │     ├─ transport
│  │     │  ├─ data.js
│  │     │  ├─ Deliveries.jsx
│  │     │  ├─ MapCard.jsx
│  │     │  ├─ PlanCard.jsx
│  │     │  ├─ QuickActions.jsx
│  │     │  └─ RequestsTable.jsx
│  │     └─ Transport.jsx
│  ├─ index.html
│  ├─ jsconfig.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ partner
│  │  ├─ components
│  │  │  ├─ CapacityBar.jsx
│  │  │  ├─ KpiGrid.jsx
│  │  │  ├─ ListingTab.jsx
│  │  │  ├─ OrdersTab.jsx
│  │  │  ├─ RequestsTab.jsx
│  │  │  └─ VolumeCard.jsx
│  │  ├─ data.js
│  │  ├─ PartnerPortal.jsx
│  │  ├─ README.md
│  │  └─ usePartnerStats.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ shared
│  │  ├─ Assistant.jsx
│  │  ├─ chartColors.js
│  │  ├─ charts.jsx
│  │  ├─ data.js
│  │  ├─ EmptyState.jsx
│  │  ├─ nav.js
│  │  ├─ Shell.jsx
│  │  ├─ Skeleton.jsx
│  │  └─ utils.js
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  └─ ui
│  │  │     └─ button.jsx
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  └─ utils.js
│  │  ├─ main.jsx
│  │  └─ styles
│  │     ├─ admin.css
│  │     ├─ app.css
│  │     ├─ assistant.css
│  │     ├─ dashboard.css
│  │     ├─ farmer.css
│  │     ├─ overview.css
│  │     ├─ pages.css
│  │     ├─ partner.css
│  │     └─ shell.css
│  └─ vite.config.js
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
├─ src
│  └─ styles
└─ tests
   ├─ README.md
   └─ test_farm_service.py

```
