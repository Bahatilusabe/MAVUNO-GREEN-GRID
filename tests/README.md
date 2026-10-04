# Tests

The current suite consists of `test_farm_service.py`. It is a scaffold: its test methods contain `pass` and do not assert farm-service behavior. There are no unit, integration, end-to-end, or performance test subdirectories in this repository yet.

## Run

Install `pytest` in your Python environment, then run from the repository root:

```powershell
python -m pytest -q
```

The test suite should be expanded with assertions and database/service fakes before it is used as a regression gate. No CI workflow or coverage target is configured in this repository at present.
