# Database - Migrations Module

Database migrations for MAVUNO-GREEN-GRID platform.

## Overview
Manages database schema versioning and migrations.

## Migration Files
- 001_initial_schema.sql
- 002_add_columns.sql
- 003_create_indexes.sql

## Running Migrations
```bash
python migrate.py up
```

## Rollback
```bash
python migrate.py down
```

## Best Practices
- Each migration should be atomic
- Always include rollback instructions
- Test migrations locally first
