# Referencia del Esquema de Datos

Descripción formal de las tablas de la base de datos.
*(Para scripts de creación, ver `DATA_MODELING_ANALYSIS.md` en el root)*

## Tablas

### `drivers`
Perfil del usuario conductor.
- Relación: 1:1 con `auth.users`.
- Clave: Información personal y estado operativo.

### `vehicles`
Inventario de flota.
- Clave: `plate_number` (Matrícula única).

### `reports`
Incidencias.
- Relación: Vincula `driver` y `vehicle`.
- Datos: Incluye geolocalización (JSONB) y array de imágenes.

### `time_registrations`
Cabecera de jornada diaria.
- Clave: Único por `(driver_id, date)`.

### `time_ranges`
Detalle de intervalos de tiempo.
- Propósito: Permite múltiples franjas de trabajo y pausas en un mismo día.
