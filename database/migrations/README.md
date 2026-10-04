# Database Migrations

The SQL migration files are numbered and must be reviewed and applied in order. Current files create users, farms, crops, resources, interventions, and transactions tables. They use MySQL-style syntax (`AUTO_INCREMENT`, `ON UPDATE CURRENT_TIMESTAMP`).

`migrate.py` only defines a `MigrationRunner` class. It has a method for executing one supplied SQL file, but applying all pending migrations and rollback are unimplemented; there is no `python migrate.py up/down` command or database connection setup.

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) before applying migrations. Its Oracle-specific instructions are not compatible with the checked-in MySQL-style SQL and should not be followed as-is.
