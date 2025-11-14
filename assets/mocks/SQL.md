## 🗄️ Tablas en Supabase (PostgreSQL)

Estructura propuesta para la base de datos en Supabase de producción (sintaxis SQL orientativa pendiente de revisión):

```sql
-- drivers
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  surnames TEXT NOT NULL,
  person_id TEXT NOT NULL,
  complete_address TEXT NOT NULL,
  birth_date TIMESTAMPTZ NOT NULL,
  image_url TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  license_number TEXT NOT NULL,
  registration_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Activo',
  role TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS drivers_email_uidx ON public.drivers (email);
CREATE INDEX IF NOT EXISTS drivers_status_idx ON public.drivers (status);

-- fleet
CREATE TABLE IF NOT EXISTS public.fleet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_brand TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  year INT NOT NULL,
  vehicle_type TEXT NOT NULL, -- enum app-level
  plate_number TEXT NOT NULL,
  registration_date TIMESTAMPTZ NOT NULL,
  purchase_date TIMESTAMPTZ,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'Activo'
);

CREATE UNIQUE INDEX IF NOT EXISTS fleet_plate_uidx ON public.fleet (plate_number);
CREATE INDEX IF NOT EXISTS fleet_status_idx ON public.fleet (status);

-- reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES public.fleet(id) ON DELETE RESTRICT,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  reporter_comment TEXT,
  images TEXT[], -- array de URLs
  location JSONB, -- objeto con latitude y longitude
  read BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS reports_vehicle_idx ON public.reports (vehicle_id);
CREATE INDEX IF NOT EXISTS reports_driver_idx ON public.reports (driver_id);
CREATE INDEX IF NOT EXISTS reports_read_idx ON public.reports (read);
CREATE INDEX IF NOT EXISTS reports_active_idx ON public.reports (active);

-- time_registration
CREATE TABLE IF NOT EXISTS public.time_registration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  time_ranges JSONB NOT NULL, -- array de objetos con id, startTime, endTime, isPaused, pausedAt
  total_hours NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT false,
  notes JSONB NOT NULL DEFAULT '[]'::jsonb -- array de objetos con id, text, createdAt, updatedAt
);

CREATE INDEX IF NOT EXISTS time_registration_driver_idx ON public.time_registration (driver_id);
CREATE INDEX IF NOT EXISTS time_registration_date_idx ON public.time_registration (date);
CREATE INDEX IF NOT EXISTS time_registration_active_idx ON public.time_registration (is_active);
```

> Nota: los nombres en snake_case de la base de datos se mapean en la app a las claves camelCase del modelo (vía DTO/mapper).
