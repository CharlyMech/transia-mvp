# Arquitectura del Proyecto

Referencia técnica de la estructura y patrones de Transia MVP.

## Estructura de Directorios

*   `app/`: **Expo Router**. Contiene las pantallas y navegación.
*   `components/`: Componentes UI reutilizables (Botones, Input, Cards).
*   `stores/`: **Zustand**. Gestión de estado global. La "fuente de la verdad" para la UI.
*   `services/`: Lógica de negocio y llamadas externas.
    *   `data/`: Adaptadores de datos (Supabase, Mocks).
*   `constants/`: Configuraciones estáticas (Colores, Enums, Constantes).

## Patrón de Datos
`UI` -> `Store` -> `Service` -> `Supabase`

La UI se suscribe a los cambios del Store. El Store ejecuta la lógica y llama al Service. El Service devuelve datos crudos que el Store procesa y almacena.
