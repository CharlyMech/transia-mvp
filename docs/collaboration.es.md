# Guía de Colaboración y Gitflow

Para mantener la calidad y el orden en el desarrollo de Transia MVP, seguimos un flujo de trabajo personalizado.

## Ramas Principales

*   `main`: Producción. Código estable y desplegable.
*   `develop`: Desarrollo. Integración de nuevas características.

## Custom Gitflow

1.  **Issues**: Cada tarea debe tener un Issue asociado.
2.  **Ramas de Feature**:
    *   Nombre: `feat/ID-descripcion-breve` (ej: `feat/12-login-screen`).
    *   Origen: `develop`.
3.  **Ramas de Bugfix**:
    *   Nombre: `fix/ID-descripcion` (ej: `fix/15-calendar-error`).
    *   Origen: `develop` (o `main` para hotfixes críticos).
4.  **Commits**: Usamos *Conventional Commits*:
    *   `feat: ...` para nuevas características.
    *   `fix: ...` para correcciones.
    *   `docs: ...` para documentación.
    *   `refactor: ...` para cambios de código sin afectar funcionalidad.

## Pasos para Colaborar

1.  Actualiza tu rama local: `git pull origin develop`.
2.  Crea tu rama: `git checkout -b feat/nueva-feature`.
3.  Desarrolla y prueba localmente.
4.  Sube cambios: `git push origin feat/nueva-feature`.
5.  Abre un **Pull Request (PR)** hacia `develop`.
6.  Solicita revisión de código.

> [!IMPORTANT]
> No hagas merge directo a `develop` o `main`. Siempre usa PRs.
