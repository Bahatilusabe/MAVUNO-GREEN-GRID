# MAVUNO-GREEN-GRID Database Architecture

## Overview
Oracle Database is the central transactional data store for the MAVUNO-GREEN-GRID platform. This document outlines the database architecture, schema design, and key entities.

## Database Technology Stack
- **Primary Database**: Oracle Database 19c+ / 21c
- **Connection Pool**: Oracle UCP (Universal Connection Pool)
- **ORM**: SQLAlchemy with Oracle dialect or native JDBC
- **Migration Tool**: Liquibase or Flyway with Oracle support
- **Backup Strategy**: Oracle RMAN
- **High Availability**: Oracle Data Guard or Oracle RAC

## Key Design Principles
1. **Normalization**: Third normal form (3NF) for data integrity
2. **Scalability**: Partitioning strategy for large tables (USERS, TRANSACTIONS, AUDIT_LOGS)
3. **Performance**: Indexes on frequently queried columns
4. **Audit Trail**: Timestamp columns (created_at, updated_at) on all tables
5. **Data Integrity**: Foreign key constraints and check constraints
6. **Security**: Role-based access control (RBAC) at database level

## Core Entities

### 1. USERS (Central entity)
Stores all platform users with role-based differentiation.

**Columns:**
- `id` (BIGINT): Primary key, auto-increment
- `full_name` (VARCHAR2): User's full name
- `email` (VARCHAR2): Unique email address
- `phone` (VARCHAR2): Contact phone number
- `password_hash` (VARCHAR2): Bcrypt/Argon2 hashed password
- `role` (VARCHAR2): User role (see role definitions below)
- `location` (VARCHAR2): User's location/address
- `status` (VARCHAR2): Account status (ACTIVE, INACTIVE, SUSPENDED, DELETED)
- `created_at` (TIMESTAMP): Record creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Indexes:**
- PRIMARY KEY: id
- UNIQUE: email
- INDEX: role, status, created_at

---

## User Roles and Permissions

### 1. FARMER
**Description**: Agricultural producers managing farms and crops
**Capabilities:**
- Register and manage farm profiles
- Log crop information and planting schedules
- Report harvest data and yields
- Request resources and interventions
- View market prices and trends
- Access weather forecasts
- Receive recommendations and alerts
- Track shipments
- View financial transactions

### 2. BUYER
**Description**: Agricultural product purchasers (retail, processors, exporters)
**Capabilities:**
- Post purchase orders
- Browse available crops by region/season
- Negotiate pricing
- Review farmer profiles and ratings
- Track shipments and delivery status
- Process payments
- Provide feedback and ratings
- View market analytics

### 3. PROCESSOR
**Description**: Food processing and value-addition companies
**Capabilities:**
- Post purchase orders for raw materials
- Manage processing workflows
- Track inventory of processed goods
- Access quality specifications
- Connect with certified farmers
- Manage logistics partnerships
- Report production data

### 4. STORAGE_PROVIDER
**Description**: Warehouse and cold storage operators
**Capabilities:**
- Manage storage facility information
- Track inventory in storage
- Monitor storage conditions (temperature, humidity)
- Report storage events and issues
- Manage pricing for storage services
- Track in/out transactions
- Provide availability reports

### 5. TRANSPORTER
**Description**: Logistics and transportation service providers
**Capabilities:**
- Manage fleet and vehicle information
- Accept shipment requests
- Update delivery status in real-time
- Report costs and timing
- Track fuel consumption and efficiency
- Manage driver information
- Generate delivery reports

### 6. RECOVERY_PARTNER
**Description**: Post-harvest loss prevention and recovery specialists
**Capabilities:**
- Identify at-risk crops and farms
- Recommend interventions
- Track intervention implementation
- Measure impact and outcomes
- Report sustainability metrics
- Provide training and advisory
- Monitor climate risks

### 7. ADMIN
**Description**: Platform administrators
**Capabilities:**
- Full system access
- User management (create, edit, deactivate)
- System configuration
- Access control management
- Data backup and recovery
- Audit log review
- System performance monitoring
- Generate system reports

### 8. ANALYST
**Description**: Data analysts and business intelligence users
**Capabilities:**
- Generate analytical reports
- Access data warehouse/BI tools
- Create dashboards
- Export data for analysis
- Run ad-hoc queries
- Access market intelligence
- Generate impact assessments
- Create predictive models

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USERS (Central Hub)                       │
│  (FARMER, BUYER, PROCESSOR, STORAGE_PROVIDER, TRANSPORTER)  │
└─────────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    ┌────────┐     ┌────────┐     ┌──────────┐
    │ FARMS  │     │ CROPS  │     │RESOURCES │
    └────────┘     └────────┘     └──────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
  ┌──────────┐   ┌────────────┐   ┌────────┐
  │WEATHER   │   │INTERVENTIONS│  │IMPACT  │
  │DATA      │   └────────────┘   │METRICS │
  └──────────┘                     └────────┘
        │
        ▼
  ┌──────────────────┐
  │ MARKET_PRICES    │
  │ MARKET_TRENDS    │
  └──────────────────┘
        │
        ▼
  ┌──────────────────┐
  │ TRANSACTIONS     │
  │ SHIPMENTS        │
  │ STORAGE          │
  │ LOGISTICS        │
  └──────────────────┘
        │
        ▼
  ┌──────────────────┐
  │ NOTIFICATIONS    │
  │ AUDIT_LOGS       │
  └──────────────────┘
```

---

## Partitioning Strategy

Large tables should be partitioned for performance:

**USERS** - Partition by range (status) or hash for load distribution
**TRANSACTIONS** - Partition by range (created_at) - monthly partitions
**AUDIT_LOGS** - Partition by range (created_at) - monthly partitions
**WEATHER_DATA** - Partition by range (created_at) - daily partitions
**MARKET_PRICES** - Partition by range (created_at) - daily partitions

---

## Security Architecture

### Database-Level Security
1. **User Authentication**: Oracle users with role-based access
2. **Row-Level Security (RLS)**: Virtual Private Database (VPD) policies
3. **Column-Level Security**: Encryption for sensitive data (passwords, phone)
4. **Data Encryption**: Transparent Data Encryption (TDE) for at-rest data
5. **Audit Trail**: Comprehensive audit logging of all changes

### Application-Level Security
1. **JWT Tokens**: For API authentication
2. **Role-Based Access Control**: Enforced at application layer
3. **SQL Injection Prevention**: Prepared statements and parameterized queries
4. **Rate Limiting**: On API endpoints

---

## Backup and Recovery Strategy

**Backup Schedule:**
- Full backup: Weekly (Sunday)
- Incremental backup: Daily
- Archive logs: Every 4 hours
- Recovery Point Objective (RPO): 1 hour
- Recovery Time Objective (RTO): 4 hours

**Backup Location:**
- Primary: Local SAN storage
- Secondary: Cloud storage (Oracle Cloud or AWS S3)

---

## Performance Optimization

1. **Connection Pooling**: Oracle UCP with min=10, max=100 connections
2. **Query Optimization**: Use EXPLAIN PLAN for slow queries
3. **Materialized Views**: For complex aggregations
4. **Indexes**: B-tree indexes on foreign keys and frequently filtered columns
5. **Statistics**: Regular DBMS_STATS collection for optimizer

---

## Monitoring and Maintenance

1. **Real-time Monitoring**: Oracle Enterprise Manager (OEM)
2. **Performance Tuning**: Automatic SQL Tuning
3. **Space Management**: Automated segment space management (ASSM)
4. **Alert Thresholds**:
   - Tablespace usage > 80%
   - CPU usage > 75%
   - Connection pool > 90%
   - Response time > 1 second

---

## Database Naming Conventions

- **Tables**: UPPERCASE, plural nouns (e.g., USERS, FARMS, CROPS)
- **Columns**: UPPERCASE (e.g., id, full_name, email)
- **Constraints**: Prefix with constraint type (PK_, UK_, FK_, CK_)
- **Indexes**: Prefix with idx_ (e.g., idx_users_email)
- **Sequences**: Prefix with seq_ (e.g., seq_users_id)
- **Triggers**: Prefix with trg_ (e.g., trg_users_updated_at)
- **Procedures**: Prefix with proc_ (e.g., proc_calculate_yield)
- **Functions**: Prefix with fn_ (e.g., fn_get_farm_summary)

---

## Migration Tool Configuration

Using Liquibase with Oracle:
- Changelog format: XML or YAML
- Changelog table: DATABASECHANGELOG
- Lock table: DATABASECHANGELOGLOCK
- Contexts: dev, test, prod
- Labels: v1.0, v1.1, etc.

---

## Next Steps

1. Create Oracle database instance
2. Create tablespace for MAVUNO-GREEN-GRID
3. Create database user with appropriate privileges
4. Run migrations in order
5. Create indexes and constraints
6. Set up backup schedule
7. Configure monitoring and alerts
8. Load initial reference data
9. Run performance tests
10. Document connection strings and credentials (securely)
