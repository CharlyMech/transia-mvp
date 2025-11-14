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
-  **timeRegistration** (registro de tiempo de trabajo)

Relaciones:

-  `reports.vehicleId` → **FK** a `fleet.id`
-  `reports.driverId` → **FK** a `drivers.id`
-  `timeRegistration.driverId` → **FK** a `drivers.id`
-  `timeRegistration.notes.id` → **FK** a `notes.id` (futura implementación completa de notas en toda la app)

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
| `birthDate` | ISO 8601 | Fecha de nacimiento. |
| `imageUrl` | string? | URL de la imagen del conductor (**opcional**; puede ser `null`). |
| `phone` | string | Teléfono (formato para números de España, p.ej. `123456789`). |
| `email` | string | Email válido. |
| `licenseNumber` | string | Número de licencia de conducir o de camión (CAP). |
| `registrationDate` | ISO 8601 | Fecha de registro/alta del conductor en la plataforma. |
| `status` | string | Estado del conductor (p.ej. `Activo`, `Inactivo`, etc). |
| `role` | string? | Rol del conductor (**por defecto `driver`**). |

### 2) `fleet`

> [Esquema de Zod](/models/fleet.ts)

| Campo | Tipo | Reglas / Comentarios |
| --- | --- | --- |
| `id` | UUID | Identificador único. |
| `vehicleBrand` | string | Marca (p.ej. Mercedes, Scania, Ford). |
| `vehicleModel` | string | Modelo (p.ej. Actros, R450, Transit). |
| `year` | number | Año (entero). |
| `vehicleType` | string | Tipo (p.ej. `Camión tráiler`, `Camión rígido`, `Furgoneta pequeña`). Puede tratarse como **enum**. |
| `plateNumber` | string | Matrícula (texto). |
| `registrationDate` | ISO 8601 | Fecha de matriculación del vehículo. |
| `purchaseDate` | ISO 8601? | Fecha de compra del vehículo (**opcional**). |
| `imageUrl` | string? | URL de la imagen del vehículo (**opcional**). |
| `status` | string | Estado del vehículo (p.ej. `Activo`, `Inactivo`, etc). |

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
| `readAt` | ISO 8601? | Fecha/hora de lectura (**opcional**; puede ser `null`). |
| `closedAt` | ISO 8601? | Fecha/hora de cierre del reporte (**opcional**; puede ser `null`). |
| `reporterComment` | string? | Comentario del administrador o manager (**opcional**). |
| `images` | string[]? | URLs de imágenes adjuntas (**opcional**; array de strings). |
| `location` | object? | Ubicación geográfica (**opcional**; objeto con `latitude` y `longitude`). |
| `read` | boolean | Marcado como leído/no leído. |
| `active` | boolean | Estado activo/inactivo. |

### 4) `timeRegistration`

> [Esquema de Zod](/models/timeRegistration.ts)

| Campo | Tipo | Reglas / Comentarios |
| --- | --- | --- |
| `id` | UUID | Identificador único. |
| `driverId` | UUID (FK) | Debe existir en `drivers.id`. |
| `date` | string | Fecha del registro (formato `YYYY-MM-DD`). |
| `timeRanges` | array | Array de rangos de tiempo (ver estructura abajo). |
| `totalHours` | number | Total de horas trabajadas en el día. |
| `isActive` | boolean | Indica si el registro está activo (en curso). |
| `notes` | array | Array de notas asociadas al registro (ver estructura abajo). |

**Estructura de `timeRanges`:**

| Campo | Tipo | Reglas / Comentarios |
| --- | --- | --- |
| `id` | UUID | Identificador único del rango. |
| `startTime` | ISO 8601 | Hora de inicio del periodo de trabajo. |
| `endTime` | ISO 8601? | Hora de fin del periodo de trabajo (**puede ser `null`** si está en curso). |
| `isPaused` | boolean | Indica si el rango está pausado. |
| `pausedAt` | ISO 8601? | Hora de pausa (**opcional**; puede ser `null`). |

**Estructura de `notes`:**

| Campo | Tipo | Reglas / Comentarios |
| --- | --- | --- |
| `id` | UUID | Identificador único de la nota. |
| `text` | string | Texto de la nota. |
| `createdAt` | ISO 8601 | Fecha/hora de creación de la nota. |
| `updatedAt` | ISO 8601? | Fecha/hora de actualización de la nota (**opcional**). |

---

## 🧪 Ficheros JSON (modo test)

Ubicación: `assets/mocks/`

-  `drivers.json` → lista de `Driver`
-  `fleet.json` → lista de `Fleet`
-  `reports.json` → lista de `Report`
-  `timeRegistration.json` → lista de `TimeRegistration`
