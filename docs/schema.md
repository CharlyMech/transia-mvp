# Database Schema Reference

Formal description of database tables.
*(For creation scripts, see `DATA_MODELING_ANALYSIS.md` in root)*

## Tables

### `drivers`
Driver user profile.
- Relationship: 1:1 with `auth.users`.
- Key: Personal info and operational status.

### `vehicles`
Fleet inventory.
- Key: `plate_number` (Unique).

### `reports`
Incidents/Reports.
- Relationship: Links `driver` and `vehicle`.
- Data: Includes geolocation (JSONB) and image array.

### `time_registrations`
Daily shift header.
- Key: Unique by `(driver_id, date)`.

### `time_ranges`
Time interval details.
- Purpose: Allows multiple work blocks and pauses within a single day.
