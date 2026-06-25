USE pm_timesheet_evm;

INSERT INTO timesheet_clients (
    name,
    created_at,
    updated_at
)
VALUES (
    'BDT Global',
    NOW(),
    NOW()
);

SET @client_id = LAST_INSERT_ID();

INSERT INTO timesheet_projects (
    timesheet_project_id,
    name,
    code,
    client_id,
    status,
    start_date,
    end_date_planned,
    bac_base_hours,
    bac_base_cost,
    bac_total_hours,
    bac_total_cost,
    hourly_rate,
    etc_calculation_mode,
    created_at,
    updated_at
)
VALUES
(UUID(), 'Sistema Gestión Proyectos', 'SGP-001', @client_id, 'activo', '2026-05-01', '2026-09-01', 120, 5400, 120, 5400, 45, 'manual', NOW(), NOW()),
(UUID(), 'Dashboard Ejecutivo', 'DASH-002', @client_id, 'activo', '2026-05-03', '2026-08-15', 80, 3200, 80, 3200, 40, 'automatic', NOW(), NOW()),
(UUID(), 'Migración Backend .NET', 'NET-003', @client_id, 'pausado', '2026-04-10', '2026-10-01', 200, 12000, 200, 12000, 60, 'manual', NOW(), NOW()),
(UUID(), 'Portal Recursos Humanos', 'RRHH-004', @client_id, 'cerrado', '2026-01-15', '2026-04-15', 60, 2400, 60, 2400, 40, 'manual', NOW(), NOW()),
(UUID(), 'Integración Clockify', 'CLK-005', @client_id, 'activo', '2026-05-07', '2026-07-20', 90, 4500, 90, 4500, 50, 'automatic', NOW(), NOW()),
(UUID(), 'Sistema Capacidades', 'CAP-006', @client_id, 'activo', '2026-05-10', '2026-10-15', 300, 18000, 300, 18000, 60, 'manual', NOW(), NOW()),
(UUID(), 'App Mobile Tracking', 'MOB-007', @client_id, 'activo', '2026-05-11', '2026-11-01', 220, 15400, 220, 15400, 70, 'automatic', NOW(), NOW()),
(UUID(), 'Portal Analytics', 'ANA-008', @client_id, 'pausado', '2026-03-01', '2026-08-01', 140, 7000, 140, 7000, 50, 'manual', NOW(), NOW()),
(UUID(), 'Sistema Tickets', 'TCK-009', @client_id, 'activo', '2026-04-05', '2026-09-30', 160, 9600, 160, 9600, 60, 'automatic', NOW(), NOW()),
(UUID(), 'Proyecto IA Forecast', 'IA-010', @client_id, 'activo', '2026-05-15', '2027-01-10', 400, 32000, 400, 32000, 80, 'manual', NOW(), NOW());

USE pm_timesheet_evm;

INSERT IGNORE INTO app_user_visible_projects (
    user_id,
    project_id
)
SELECT
    u.id,
    p.id
FROM users u
CROSS JOIN timesheet_projects p
WHERE u.email = 'diego@test.com';











