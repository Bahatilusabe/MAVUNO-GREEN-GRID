 

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
├─ .xgrok
│  ├─ BEST_PRACTICES.md
│  ├─ project.json
│  └─ SECURITY.md
├─ AGENTS.md
├─ ai
│  ├─ .dockerignore
│  ├─ audio_cache
│  │  └─ 08cee41502c24ff682436a12fd88aad8.mp3
│  ├─ Dockerfile
│  ├─ explanations
│  │  ├─ explainer.py
│  │  └─ README.md
│  ├─ forecasting
│  │  ├─ forecaster.py
│  │  └─ README.md
│  ├─ main.py
│  ├─ matching
│  │  ├─ matcher.py
│  │  └─ README.md
│  ├─ optimization
│  │  ├─ optimizer.py
│  │  └─ README.md
│  ├─ pipeline
│  │  ├─ assembly.py
│  │  ├─ brain.py
│  │  ├─ brain_schema.py
│  │  ├─ impact.py
│  │  ├─ llm_client.py
│  │  ├─ prompt_builder.py
│  │  └─ run_pipeline.py
│  ├─ requirements.txt
│  ├─ risk
│  │  ├─ README.md
│  │  └─ risk_assessor.py
│  ├─ tools
│  │  ├─ copernicus_ndvi.py
│  │  ├─ nasa_power.py
│  │  ├─ openmeteo_agro.py
│  │  ├─ plant_health.py
│  │  ├─ radius_search.py
│  │  ├─ soil_baseline.py
│  │  └─ terrain.py
│  └─ weather
│     └─ weather_client.py
├─ backend
│  ├─ .dockerignore
│  ├─ api
│  │  ├─ README.md
│  │  └─ routes.py
│  ├─ auth
│  │  ├─ auth_service.py
│  │  └─ README.md
│  ├─ crops
│  │  ├─ crop_service.py
│  │  └─ README.md
│  ├─ database
│  │  └─ legacy
│  ├─ docker-compose.old.yml
│  ├─ docker-compose.yml
│  ├─ Dockerfile
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
│  ├─ scripts
│  │  └─ smoke.ps1
│  ├─ src
│  │  ├─ app.js
│  │  ├─ config.js
│  │  ├─ db
│  │  │  ├─ migrate.js
│  │  │  ├─ migrations
│  │  │  │  ├─ 001_init.sql
│  │  │  │  ├─ 002_notifications_actions.sql
│  │  │  │  ├─ 003_roles.sql
│  │  │  │  ├─ 004_crop_lifecycle.sql
│  │  │  │  ├─ 005_geo_cache_and_matches.sql
│  │  │  │  └─ 006_transport_orders.sql
│  │  │  ├─ oracle.js
│  │  │  ├─ pool.js
│  │  │  ├─ seed.js
│  │  │  └─ splitSql.js
│  │  ├─ middleware
│  │  │  ├─ auth.js
│  │  │  ├─ error.js
│  │  │  ├─ rateLimit.js
│  │  │  └─ validate.js
│  │  ├─ modules
│  │  │  ├─ auth
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ chat
│  │  │  │  └─ routes.js
│  │  │  ├─ crops
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ farms
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ impact
│  │  │  │  └─ service.js
│  │  │  ├─ interventions
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ marketplace
│  │  │  │  └─ service.js
│  │  │  ├─ matches
│  │  │  │  ├─ routes.js
│  │  │  │  └─ service.js
│  │  │  ├─ notifications
│  │  │  │  ├─ routes.js
│  │  │  │  └─ service.js
│  │  │  ├─ opportunities
│  │  │  │  ├─ routes.js
│  │  │  │  └─ service.js
│  │  │  ├─ overview
│  │  │  │  ├─ routes.js
│  │  │  │  └─ service.js
│  │  │  ├─ places
│  │  │  │  ├─ routes.js
│  │  │  │  └─ service.js
│  │  │  ├─ resources
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ routing
│  │  │  │  └─ routes.js
│  │  │  ├─ storage
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ surplus-alerts
│  │  │  │  └─ routes.js
│  │  │  ├─ transactions
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ transport
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ tts
│  │  │  │  └─ routes.js
│  │  │  └─ weather
│  │  │     ├─ routes.js
│  │  │     ├─ schemas.js
│  │  │     └─ service.js
│  │  ├─ routes
│  │  │  └─ overview.js
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
│  │  ├─ 007_create_transactions_workflow.sql
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
├─ docker-compose.yml
├─ docs
│  └─ README.md
├─ frontend
│  ├─ .dockerignore
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
│  ├─ Dockerfile
│  ├─ farmer
│  │  ├─ components
│  │  │  ├─ page-parts.jsx
│  │  │  └─ ui.jsx
│  │  ├─ constants.js
│  │  ├─ FarmerPortal.jsx
│  │  ├─ README.md
│  │  └─ views
│  │     ├─ AddCropForm.jsx
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
│  │     │  ├─ adapter.js
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
│  │     ├─ Transport.jsx
│  │     └─ Weather.jsx
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
│  │  ├─ geo.js
│  │  ├─ Loader.jsx
│  │  ├─ MapView.jsx
│  │  ├─ nav.js
│  │  ├─ RouteMap.jsx
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
│  │  ├─ hooks
│  │  │  ├─ useFarms.js
│  │  │  └─ useOverview.js
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  ├─ api.js
│  │  │  └─ utils.js
│  │  └─ main.jsx
│  ├─ vercel.json
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