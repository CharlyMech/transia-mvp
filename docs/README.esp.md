## 🚀 Primeros Pasos

### Requisitos Previos

-  **Node.js** (v18 o superior)
-  **npm** o **yarn**
-  **Expo CLI** (se instala automáticamente con las dependencias)
-  **Simulador de iOS** (solo macOS) o **Emulador de Android** o **Dispositivo físico con Expo Go**

### Instalación

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/yourusername/transia-mvp.git
   cd transia-mvp
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Configura el entorno** (opcional)

   -  Configura tus credenciales de Supabase si usas el modo producción
   -  Configura variables de entorno para distintos modos

### Ejecutar la Aplicación

#### Modo Desarrollo (Local)

```bash
npm start
```

Esto abrirá las herramientas de desarrollo de Expo. Luego puedes:

-  Presionar `i` para el simulador de iOS
-  Presionar `a` para el emulador de Android
-  Escanear el código QR con la app Expo Go en tu dispositivo físico

#### Modo Test (con Datos Mock)

```bash
npm run start:test
```

Usa datos locales JSON en lugar del backend de Supabase: perfecto para desarrollar sin acceso a la base de datos.

**Modo test por plataforma:**

```bash
npm run android:test   # Android con modo test
npm run ios:test       # iOS con modo test
npm run web:test       # Web con modo test
```

#### Modo Producción

```bash
npm run start:prod
```

Conecta con la base de datos de producción de Supabase.

#### Modo Debug

```bash
npm run start:debug
```

Activa el panel de depuración para resolución de problemas durante el desarrollo.

#### Otros Comandos

```bash
npm run android        # Ejecutar en Android (modo por defecto)
npm run ios            # Ejecutar en iOS (modo por defecto)
npm run web            # Ejecutar en Web (modo por defecto)
npm run reset-project  # Restablecer el proyecto (limpia la caché)
npm run lint           # Ejecutar ESLint
```

---

## 📁 Estructura del Proyecto

```
transia-mvp/
├── app/                        # Routing basado en archivos con Expo Router
│   ├── (tabs)/                 # Navegación principal por tabs
│   │   ├── index.tsx           # Dashboard/Home
│   │   ├── ...
│   ├── drivers/                # Pantallas relacionadas con conductores
│   │   ├── [id]/               # Rutas dinámicas de detalle de conductor
│   │   │   ├── index.tsx       # Perfil del conductor
│   │   │   ├── ...
│   │   │   └── edit/
│   │   └── new-driver.tsx
│   ├── fleet/                  # Pantallas relacionadas con la flota
│   │   ├── [id].tsx            # Detalle del vehículo
│   │   ├── ...
│   │   └── edit/
│   ├── reports/                # Pantallas relacionadas con informes
│   │   ├── [id].tsx            # Detalle del informe
│   │   ├── ...
│   │   └── edit/
│   ├── settings/               # Pantallas de ajustes
│   ├── login.tsx               # Pantalla de inicio de sesión
│   ├── +not-found.tsx          # Pantalla de error 404
│   ├── error.tsx               # Pantalla de error general
│   └── _layout.tsx             # Layout raíz
├── assets/
│   ├── images/                 # Imágenes de la app
│   ├── mocks/                  # Datos mock en JSON
│   ├── screenshots/            # Capturas de pantalla de la app
├── components/                 # Componentes personalizados
│   ├── forms/                  # Componentes de formularios
│   ├── modals/                 # Componentes modales
│   ├── Card.tsx
│   ├── ...
├── constants/                  # Constantes de la app
│   ├── enums/                  # Enumeraciones
│   ├── theme.ts                # Configuración del tema
├── docs/                       # Documentación
├── hooks/                      # Hooks personalizados
├── models/                     # Modelos de datos
├── services/                   # APIs y servicios de datos
│   ├── data/                   # Obtención y procesamiento de datos
│   │   ├── index.ts            # Detalle de informes
│   │   ├── supabase/           # Cliente y servicios de Supabase
│   │   ├── mock/               # Servicios mock
│   ├── env.ts                  # Configuración del entorno → selecciona servicio (mock o supabase)
├── stores/                     # Gestión de estado con Zustand
├── utils/                      # Funciones utilitarias
├── app.json                    # Configuración de la app
├── babel.config.js             # Configuración de Babel
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias del proyecto
```
