# MAVUNO-GREEN-GRID Database Migration Guide

## Overview
This guide explains how to execute database migrations for the MAVUNO-GREEN-GRID platform on Oracle Database.

## Prerequisites

1. Oracle Database 19c or later installed and running
2. SQL*Plus or SQL Developer installed
3. Database user with DBA or appropriate privileges
4. Migration files in correct order

## Migration Files

The migrations should be executed in the following order:

1. **001_create_users_table.sql** - Create USERS table (central entity)
2. **002_create_farms_table.sql** - Create FARMS table (depends on USERS)
3. **003_create_crops_table.sql** - Create CROPS table (depends on FARMS)
4. **004_create_resources_table.sql** - Create RESOURCES table (depends on FARMS)
5. **005_create_interventions_table.sql** - Create INTERVENTIONS table (depends on FARMS, CROPS)
6. **006_create_transactions_table.sql** - Create TRANSACTIONS table (depends on USERS, CROPS)

## Execution Methods

### Method 1: Using SQL*Plus

```bash
# Connect to Oracle database
sqlplus username/password@database

# Execute migration file
@001_create_users_table.sql
@002_create_farms_table.sql
@003_create_crops_table.sql
@004_create_resources_table.sql
@005_create_interventions_table.sql
@006_create_transactions_table.sql

# Exit
EXIT;
```

### Method 2: Using SQL Developer

1. Open SQL Developer
2. Connect to your Oracle database
3. Open each SQL file
4. Execute each file in order
5. Verify successful execution

### Method 3: Using Liquibase (Recommended)

#### Setup Liquibase

```bash
# Download Liquibase
wget https://github.com/liquibase/liquibase/releases/download/v4.x.x/liquibase-4.x.x.tar.gz
tar xzf liquibase-4.x.x.tar.gz
cd liquibase
```

#### Create liquibase.properties

```properties
classPath=path/to/oracle-jdbc-driver.jar
driver=oracle.jdbc.OracleDriver
url=jdbc:oracle:thin:@localhost:1521:ORCL
username=mavuno_user
password=your_password
changeLogFile=changelog.xml
```

#### Run migrations

```bash
./liquibase update
```

#### Rollback migrations

```bash
./liquibase rollback-by-tag v1.0
```

### Method 4: Using Python with cx_Oracle

```python
import cx_Oracle

# Connect to database
connection = cx_Oracle.connect(
    username='mavuno_user',
    password='password',
    dsn='localhost:1521/ORCL'
)

cursor = connection.cursor()

# Read and execute migration files
migration_files = [
    '001_create_users_table.sql',
    '002_create_farms_table.sql',
    '003_create_crops_table.sql',
    '004_create_resources_table.sql',
    '005_create_interventions_table.sql',
    '006_create_transactions_table.sql',
]

for migration_file in migration_files:
    with open(migration_file, 'r') as f:
        sql = f.read()
    try:
        cursor.execute(sql)
        connection.commit()
        print(f"✓ {migration_file} executed successfully")
    except cx_Oracle.DatabaseError as e:
        print(f"✗ Error in {migration_file}: {e}")
        connection.rollback()

cursor.close()
connection.close()
```

## Verification

After running all migrations, verify the schema:

```sql
-- List all tables
SELECT table_name FROM user_tables ORDER BY table_name;

-- Verify USERS table structure
DESC users;

-- Check indexes
SELECT index_name, table_name FROM user_indexes WHERE table_owner = 'MAVUNO_USER';

-- Verify sequences
SELECT sequence_name FROM user_sequences;

-- Check triggers
SELECT trigger_name, table_name FROM user_triggers;

-- Test auto-increment
INSERT INTO users (full_name, email, password_hash, role, status)
VALUES ('Test User', 'test@example.com', 'hash', 'FARMER', 'ACTIVE');

SELECT * FROM users WHERE email = 'test@example.com';

-- Rollback test
ROLLBACK;
```

## Rollback Procedures

### Rolling back a single migration

```sql
-- Disable foreign keys
ALTER TABLE farms DISABLE CONSTRAINT fk_farms_user_id;
ALTER TABLE crops DISABLE CONSTRAINT fk_crops_farm_id;
ALTER TABLE resources DISABLE CONSTRAINT fk_resources_farm_id;
ALTER TABLE interventions DISABLE CONSTRAINT fk_interventions_farm_id;
ALTER TABLE interventions DISABLE CONSTRAINT fk_interventions_crop_id;
ALTER TABLE transactions DISABLE CONSTRAINT fk_trans_buyer;
ALTER TABLE transactions DISABLE CONSTRAINT fk_trans_seller;
ALTER TABLE transactions DISABLE CONSTRAINT fk_trans_crop;

-- Drop tables in reverse order
DROP TABLE transactions;
DROP TABLE interventions;
DROP TABLE resources;
DROP TABLE crops;
DROP TABLE farms;
DROP TABLE users;

-- Drop sequences
DROP SEQUENCE seq_transactions_id;
DROP SEQUENCE seq_interventions_id;
DROP SEQUENCE seq_resources_id;
DROP SEQUENCE seq_crops_id;
DROP SEQUENCE seq_farms_id;
DROP SEQUENCE seq_users_id;
```

## Performance Considerations

1. **Parallel Execution**: Large migrations can run in parallel
2. **Batch Commits**: Insert large volumes in batches (1000 rows at a time)
3. **Index Rebuilding**: After large data loads, rebuild indexes
   ```sql
   ALTER INDEX idx_users_email REBUILD;
   ```
4. **Statistics Update**: Update table statistics after large operations
   ```sql
   EXEC DBMS_STATS.GATHER_TABLE_STATS('MAVUNO_USER', 'USERS');
   ```

## Troubleshooting

### ORA-00001: Unique constraint violated
**Cause**: Trying to insert duplicate email
**Solution**: Check for existing data before insert

### ORA-02291: Integrity constraint violated
**Cause**: Foreign key constraint violation
**Solution**: Ensure parent records exist before inserting child records

### ORA-00060: Deadlock detected
**Cause**: Lock contention
**Solution**: Reduce batch size or add waits between batches

### Out of memory during migration
**Cause**: Loading too much data at once
**Solution**: Process in smaller batches or restart database

## Best Practices

1. **Backup before migrations**: Always back up before running migrations
   ```bash
   rman target / <<EOF
   BACKUP DATABASE;
   EXIT;
   EOF
   ```

2. **Test in development first**: Run all migrations in dev/test environment
3. **Use transaction control**: Wrap migrations in BEGIN/COMMIT blocks
4. **Document changes**: Maintain changelog of all schema modifications
5. **Monitor execution**: Check Oracle Alert log for errors
   ```bash
   tail -f $ORACLE_BASE/diag/rdbms/*/*/trace/alert_*.log
   ```

## Next Steps

1. Create additional tables for:
   - WEATHER_DATA
   - MARKET_PRICES
   - SHIPMENTS
   - STORAGE_RECORDS
   - NOTIFICATIONS
   - AUDIT_LOGS

2. Set up materialized views for reporting
3. Create stored procedures for common operations
4. Implement row-level security (RLS) policies
5. Set up archival strategy for old data

## Support

For issues or questions:
1. Check Oracle documentation
2. Review error logs
3. Consult database administrator
4. Check MAVUNO-GREEN-GRID documentation
