# 🚚 Transia MVP – Sistema de Gestión de Flotas

**Transia** es una aplicación móvil diseñada para la **gestión de flotas de transporte** y el **registro de horarios del personal**. Permite a conductores y gestores administrar de forma eficiente incidentes, asignaciones de vehículos, alertas de mantenimiento, seguimiento de horarios y todas las operaciones de la flota desde una única y potente plataforma móvil.

![Banner](./assets/screenshots/banner.png)

---

## 📋 Tabla de Contenidos

-  [Resumen](#-resumen)
-  [Características Principales](#-características-principales)
-  [Tecnologías](#%EF%B8%8F-tecnologías)
-  [Primeros Pasos](#-primeros-pasos)
-  [Estructura del Proyecto](#-estructura-del-proyecto)
-  [Roles de Usuario](#-roles-de-usuario)
-  [Contribuir](#-contribuir)
-  [Licencia](#-licencia)

---

## 🎯 Resumen

Transia MVP resuelve desafíos críticos en la gestión de flotas proporcionando:

-  **Visibilidad en tiempo real de la flota**: conoce el estado de todos los vehículos y conductores de un vistazo.
-  **Registro centralizado de incidentes**: registra y gestiona problemas de mantenimiento, accidentes e inspecciones con evidencia fotográfica y ubicación GPS.
-  **Seguimiento de horarios**: registra cada entrada de tiempo del personal y controla horas trabajadas, descansos y registros históricos.
-  **Responsabilidad del conductor**: seguimiento de horas trabajadas, descansos y registros históricos.
-  **Mantenimiento preventivo**: alertas de ITV (inspección técnica) y programación de mantenimiento.
-  **Enfoque mobile-first**: los conductores pueden reportar problemas y registrar tiempo directamente desde el terreno.
-  **Control de acceso basado en roles**: diferentes permisos para administradores, gestores y conductores.

---

## ✨ Características Principales

### 🚗 Gestión de Flotas

-  **Inventario completo de vehículos** con perfiles detallados (marca, modelo, año, matrícula, tipo).
-  **Seguimiento del estado del vehículo** (Activo, Inactivo, En Mantenimiento, Averiado).
-  **Búsqueda y filtrado avanzados** por marca, modelo, matrícula, estado y tipo.
-  **Ordenación multicriterio** (fecha de registro, fecha de compra, año).
-  **Documentación fotográfica** para cada vehículo.
-  Compatibilidad con múltiples tipos de vehículos: Tráilers, Camiones Rígidos, Camiones 3500kg, Furgonetas (Pequeña/Mediana/Grande).

![Fleet Management](./assets/screenshots/fleet.png)

### 👥 Gestión de Conductores

-  **Perfiles completos de conductores** con detalles personales, información de contacto y datos del permiso de conducir.
-  **Gestión del estado del conductor** (Activo, Inactivo, Baja Médica, Vacaciones).
-  **Fotos de perfil** y almacenamiento de documentos.
-  **Búsqueda y filtrado avanzados** por nombre, ID o estado.
-  **Permisos basados en roles** (Admin, Gestor, Conductor).
-  **Controles de privacidad** para información sensible (DNI, dirección, teléfono).

![Driver Profile](./assets/screenshots/driver.png)

### 📝 Gestión de Incidencias e Informes

-  **Múltiples tipos de informes**: Accidentes, Mantenimiento, Revisiones de Seguridad, Avisos de ITV, Otros Problemas.
-  **Seguimiento de ubicación GPS** con búsqueda de dirección automática mediante geocodificación inversa.
-  **Adjuntos fotográficos** (múltiples imágenes por informe).
-  **Vinculación de informes a conductores y vehículos específicos**.
-  **Seguimiento del estado** (Abierto/Cerrado) con marcación leído/no leído.
-  **Timestamps** para creación, lectura y cierre.
-  **Búsqueda de texto completo** en descripciones y comentarios.
-  **Filtrado avanzado** por tipo, ubicación y estado.

![Report Management](./assets/screenshots/reports.png)

### ⏱️ Registro y Seguimiento de Tiempos

-  **Registro diario de tiempo** con funcionalidad de inicio/paro.
-  **Múltiples rangos horarios por día** (para descansos y pausas).
-  **Reloj en tiempo real** durante sesiones activas.
-  **Edición manual de entradas de tiempo** (añadir, editar, eliminar rangos).
-  **Cálculo de horas totales** por día con visualización circular de progreso.
-  **Historial mensual** con acordeones expandibles.
-  **Comparación entre horas esperadas vs. reales**.
-  **Notas y comentarios** por día.
-  **Navegación por calendario** para seleccionar fechas fácilmente.

![Time Tracking](./assets/screenshots/time-tracking.png)

### ⚙️ Ajustes de Usuario

-  **Selección de tema** (modos Claro/Oscuro con soporte de tema del sistema).
-  **Multilenguaje** (Español, Inglés, Francés, Portugués, Italiano, Alemán - en desarrollo).
-  **Gestión de cuenta** y cierre de sesión.
-  **Recursos de soporte**: Acerca de, Términos y Condiciones, Política de Privacidad.

---

## 🛠️ Tecnologías

Este proyecto está construido con tecnologías modernas y listas para producción:

### **Frontend**

-  **[Expo](https://expo.dev/)** (~54.0.12) – Plataforma de construcción y despliegue.
-  **[React Native](https://reactnative.dev/)** (0.81.4) – Framework móvil multiplataforma.
-  **[React 19](https://react.dev/)** (19.1.0) – Última versión con React Compiler habilitado.
-  **[TypeScript](https://www.typescriptlang.org/)** (~5.9.2) – Desarrollo tipado.
-  **[Expo Router](https://docs.expo.dev/router/introduction/)** (~6.0.10) – Routing basado en archivos con rutas tipadas.

### **Backend y Base de Datos**

-  **[Supabase](https://supabase.com/)** (^2.58.0) – Base de datos PostgreSQL con arquitectura serverless.
-  **[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)** (~16.0.8) – Almacenamiento local para capacidades offline.

### **UI y Diseño**

-  **[React Native Paper](https://callstack.github.io/react-native-paper/)** (^5.14.5) – Componentes Material Design 3.
-  **[Lucide Icons](https://lucide.dev/)** (^0.544.0) – Biblioteca de iconos consistente y atractiva.
-  **\*[React Native Calendars](https://github.com/wix/react-native-calendars)** (^1.1313.0) – Componentes de calendario con soporte para español.

### **Gestión de Estado y Validación**

-  **[Zustand](https://zustand-demo.pmnd.rs/)** (^5.0.8) – Gestión de estado ligera.
-  **[Zod](https://zod.dev/)** (^3.25.76) – Validación de esquemas orientada a TypeScript.

### **Mapas y Ubicación**

-  **[Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)** (~19.0.7) – Servicios GPS y de ubicación.
-  **[React Native Leaflet](https://github.com/react-native-leaflet-view/react-native-leaflet-view)** (^1.1.2) – Mapas interactivos.

### **Multimedia y Funciones del Dispositivo**

-  **[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** (~17.0.8) – Acceso a cámara y biblioteca de fotos.
-  **[Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)** (~3.0.8) – Componente de imagen optimizado.
-  **[Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)** (~15.0.7) – Retroalimentación háptica.

### **Desarrollo y Testing**

-  **Modos de Entorno**: Desarrollo, Test (con datos mock), Producción.
-  **Panel de Depuración**: Herramientas de depuración integradas (activables).
-  **Sistema de Datos Mock**: Datos JSON para pruebas sin backend.
-  **ESLint**: Calidad y consistencia del código.
-  **Nueva Arquitectura de Expo**: Mejoras de rendimiento.
-  **React Compiler**: Compilador experimental activado.

---

## 👥 Contribuir

¡Las contribuciones son bienvenidas! Ya sean correcciones de bugs, nuevas funcionalidades o mejoras en la documentación, tu ayuda es apreciada ❤️.

### Cómo Contribuir

Sigue estas instrucciones para contribuir, de lo contrario tu PR no será considerado:

1. **Haz un fork del repositorio**
2. **Crea una rama de funcionalidad**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Realiza el commit de tus cambios**

   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Haz push a la rama**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Abre un Pull Request**

### Directrices

-  Sigue el estilo de código y convenciones existentes.
-  Escribe mensajes de commit claros y descriptivos.
-  Añade tests para nuevas funcionalidades cuando sea aplicable.
-  Actualiza la documentación según sea necesario.
-  Asegúrate de que todos los tests pasen antes de enviar el PR.

### Reportar Problemas

Si encuentras un bug o tienes una sugerencia:

-  Abre un **Issue** con una descripción clara.
-  Incluye los pasos para reproducirlo (si es un bug).
-  Añade capturas de pantalla si corresponde.

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia **GPL v3 - Uso No Comercial**.

### Lo que PUEDES hacer:

✅ Ver, usar y modificar el código con fines personales o educativos ✅ Enviar **issues** y **pull requests** para mejorar el proyecto ✅ Hacer fork del proyecto para aprendizaje y experimentación

### Lo que NO PUEDES hacer:

❌ Usar este código con **fines comerciales** sin permiso ❌ Redistribuirlo como un producto o servicio de pago ❌ Eliminar o modificar atribuciones de licencia

### Uso Comercial

Para licencias comerciales, colaboraciones o despliegues empresariales, por favor **contáctame** para acordar opciones de licencia.

---

<div align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; line-height: 1.25;">
  <p style="margin: 6px 0 2px 0; font-size: 0.95rem; color: #4b5563">
    <strong>Transia</strong> — Aplicación de Gestión de Flotas y Personal
  </p>

  <p style="margin: 2px 0; font-size: 0.87rem; color: #4b5563;">
    Construido con <strong>Expo</strong> · <strong>React Native</strong> · <strong>Supabase</strong>
  </p>

  <p style="margin: 6px 0 0 0; font-size: 0.78rem; color: #6b7280;">
    © 2025 Transia (<a target="_blank" href="https://github.com/charlymech" style="color: #2563eb; text-decoration: none;">Carlos Sánchez Recio - CharlyMech</a>). Todos los derechos reservados. • Licenciado bajo <a href="./LICENSE.md" style="color: #2563eb; text-decoration: none;">GPL v3 - Uso No Comercial</a>
  </p>
</div>
