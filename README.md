# MAVUNO-GREEN-GRID

MAVUNO Green Grid is a prototype agricultural platform with a React frontend and Python service modules for farm, market, and data workflows. The frontend currently uses local sample data; it is not wired to the Python modules or a live database.

## Run the Frontend

Requirements: Node.js and npm.

```powershell
cd frontend
npm ci
npm run dev
```

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
│  ├─ .oxlintrc.json
│  ├─ admin
│  │  ├─ AdminDashboard.css
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
│  │  ├─ Dashboard.css
│  │  ├─ Dashboard.jsx
│  │  ├─ data.js
│  │  └─ README.md
│  ├─ farmer
│  │  ├─ components
│  │  │  └─ ui.jsx
│  │  ├─ constants.js
│  │  ├─ FarmerPortal.css
│  │  ├─ FarmerPortal.jsx
│  │  ├─ README.md
│  │  └─ views
│  │     ├─ AddFarmForm.jsx
│  │     ├─ Crops.jsx
│  │     ├─ FarmDetails.jsx
│  │     ├─ Forecast.jsx
│  │     ├─ Impact.jsx
│  │     ├─ Market.jsx
│  │     ├─ MyFarms.jsx
│  │     ├─ Opportunities.jsx
│  │     ├─ Overview.jsx
│  │     ├─ Profile.jsx
│  │     └─ Recommendations.jsx
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
│  │  ├─ PartnerPortal.css
│  │  ├─ PartnerPortal.jsx
│  │  ├─ README.md
│  │  └─ usePartnerStats.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ shared
│  │  ├─ Assistant.css
│  │  ├─ Assistant.jsx
│  │  ├─ charts.jsx
│  │  ├─ data.js
│  │  └─ utils.js
│  ├─ src
│  │  ├─ App.css
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
│  │  └─ main.jsx
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
└─ tests
   ├─ README.md
   └─ test_farm_service.py

```
