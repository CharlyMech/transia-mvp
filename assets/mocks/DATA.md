# 📚 Guía de Modelado de Datos (Transia MVP)

Fuentes de datos:

-  **Producción**: **Supabase (PostgreSQL)** a través de `@supabase/supabase-js`.
-  **Test**: ficheros **JSON** locales en `assets/mocks/*.json`.

Esquema de validación mediante **Zod (TypeScript)**.

---

## 🧱 Entidades y relaciones

-  **drivers** (conductores)
-  **fleet** (vehículos)
-  **reports** (incidencias / eventos)

Relaciones:

-  `reports.vehicleId` → **FK** a `fleet.id`
-  `reports.driverId` → **FK** a `drivers.id`

---

## 📄 Esquemas (campos, tipos y validaciones)

> Los campos listados a continuación reflejan lo que existe en los datos de ejemplo y deben mantenerse **idénticos** tanto en Supabase como en los JSON de test para asegurar validación y tipado homogéneos.

### 1) `drivers`

> [Esquema de Zod](/models/driver.ts)

| Campo | Tipo | Reglas / Comentarios |
| --- | --- | --- |
| `id` | UUID | Identificador único (UUID v4). |
| `name` | string | Nombre del conductor. |
| `surnames` | string | Apellidos. |
| `personId` | string | DNI/NIE u otro ID legal. |
| `completeAddress` | string | Dirección completa (texto libre). |
| `phone` | string | Teléfono (ideal: formato E.164, p.ej. `+34123456789`). |
| `email` | string | Email válido. |
| `active` | boolean | Estado activo/inactivo. |

### 2) `fleet`

> [Esquema de Zod](/models/fleet.ts)

| Campo | Tipo | Reglas / Comentarios |
| --- | --- | --- |
| `id` | UUID | Identificador único. |
| `vehicleBrand` | string | Marca (p.ej. Mercedes, Scania, Ford). |
| `vehicleModel` | string | Modelo (p.ej. Actros, R450, Transit). |
| `year` | number | Año (entero). |
| `vehicleType` | string | Tipo (p.ej. `Truck`, `Van`). Puede tratarse como **enum**. |
| `plateNumber` | string | Matrícula (texto). |
| `active` | boolean | Estado activo/inactivo. |

### 3) `reports`

> [Esquema de Zod](/models/report.ts)

| Campo | Tipo | Reglas / Comentarios |
| --- | --- | --- |
| `id` | UUID | Identificador único. |
| `title` | string | Título del reporte. |
| `description` | string | Descripción. |
| `vehicleId` | UUID (FK) | Debe existir en `fleet.id`. |
| `driverId` | UUID (FK) | Debe existir en `drivers.id`. |
| `createdAt` | ISO 8601 | Fecha/hora de creación (`string` en ISO). |
| `checkedAt` | ISO 8601? | Fecha/hora de revisión (**opcional**; puede no existir). |
| `read` | boolean | Marcado como leído/no leído. |
| `active` | boolean | Estado activo/inactivo. |

---

## 🧪 Ficheros JSON (modo test)

Ubicación sugerida: `assets/mocks/`

-  `drivers.json` → lista de `Driver`
-  `fleet.json` → lista de `Fleet`
-  `reports.json` → lista de `Report`

> **Requisito:** las claves y tipos deben respetar exactamente los esquemas Zod anteriores.

---

## 🗄️ Tablas en Supabase (PostgreSQL)

> Estructuras recomendadas (sintaxis SQL orientativa):

```sql
-- drivers
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  surnames TEXT NOT NULL,
  person_id TEXT NOT NULL,
  complete_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX IF NOT EXISTS drivers_email_uidx ON public.drivers (email);
CREATE INDEX IF NOT EXISTS drivers_active_idx ON public.drivers (active);

-- fleet
CREATE TABLE IF NOT EXISTS public.fleet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_brand TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  year INT NOT NULL,
  vehicle_type TEXT NOT NULL, -- enum app-level
  plate_number TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX IF NOT EXISTS fleet_plate_uidx ON public.fleet (plate_number);
CREATE INDEX IF NOT EXISTS fleet_active_idx ON public.fleet (active);

-- reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES public.fleet(id) ON DELETE RESTRICT,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  checked_at TIMESTAMPTZ,
  read BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS reports_vehicle_idx ON public.reports (vehicle_id);
CREATE INDEX IF NOT EXISTS reports_driver_idx ON public.reports (driver_id);
CREATE INDEX IF NOT EXISTS reports_read_idx ON public.reports (read);
CREATE INDEX IF NOT EXISTS reports_active_idx ON public.reports (active);
```

> Nota: los nombres en snake_case de la base de datos se mapean en la app a las claves camelCase del modelo (vía DTO/mapper).

## 🧭 Reglas de coherencia

-  **IDs**: siempre UUID (v4 preferible).
-  **Fechas** (`createdAt`, `checkedAt`): ISO 8601 con zona (`timestamptz` en DB).
-  **FKs** (`vehicleId`, `driverId`): deben existir en sus tablas de referencia antes de insertar un `report`.
-  **Enum app-level**: `vehicleType` mantener catálogo consistente (sinónimos controlados).
-  **`checkedAt`** en `reports` es **opcional** (puede faltar en JSON y en DB).
