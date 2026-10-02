-- Database Views
-- Complex queries defined as views for performance and simplicity

CREATE VIEW IF NOT EXISTS farmer_dashboard_view AS
SELECT 
    f.id,
    f.name,
    u.username,
    COUNT(DISTINCT c.id) as total_crops,
    f.size_hectares,
    f.created_at
FROM farms f
JOIN users u ON f.user_id = u.id
LEFT JOIN crops c ON f.id = c.farm_id
GROUP BY f.id, f.name, u.username, f.size_hectares, f.created_at;

CREATE VIEW IF NOT EXISTS farm_statistics_view AS
SELECT 
    f.id,
    f.name,
    COUNT(c.id) as crop_count,
    AVG(c.expected_harvest_date) as avg_harvest_date
FROM farms f
LEFT JOIN crops c ON f.id = c.farm_id
GROUP BY f.id, f.name;
