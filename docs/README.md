# Documentation Map

The repository is a prototype. The React application is runnable; Python backend, AI, data, and integration modules are a mixture of small working examples and unfinished scaffolds. There is no shared Python requirements file, production API server, or generated API reference at this time.

## Areas

- `frontend/README.md`: install, run, lint, and build the Vite application.
- `frontend/dashboard/README.md`, `frontend/farmer/README.md`, `frontend/partner/README.md`, and `frontend/admin/README.md`: portal behavior and sample-data limitations.
- `backend/`: service classes and the Flask blueprint in `backend/api/routes.py`. The blueprint currently exposes health and version routes only.
- `ai/`, `data/`, and `integrations/`: module READMEs describe which methods are implemented and which remain placeholders.
- `database/`: SQL examples and incomplete Python helpers. Review `database/migrations/MIGRATION_GUIDE.md` alongside the SQL before applying anything; the helper is not a complete migration CLI.
- `tests/README.md`: current test inventory and limitations.

## Frontend Routes

The Vite app is served from `frontend/`. Its hash routes are `#/dashboard`, `#/farmer`, `#/admin`, and `#/partner`; farmer views use `#/farmer/<view>`. The portals currently read local fixture data and keep changes in browser memory.

## Python Modules

There is no root `requirements.txt` or executable backend app. Install module-specific dependencies in an isolated environment before importing Python examples. Many service methods intentionally remain unimplemented; the module READMEs identify those limits.
