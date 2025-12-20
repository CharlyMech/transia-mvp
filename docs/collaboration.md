# Collaboration & Gitflow Guide

To maintain quality and order in Transia MVP development, we follow a custom workflow.

## Main Branches

*   `main`: Production. Stable and deployable code.
*   `develop`: Development. Integration of new features.

## Custom Gitflow

1.  **Issues**: Every task must have an associated Issue.
2.  **Feature Branches**:
    *   Name: `feat/ID-short-description` (e.g., `feat/12-login-screen`).
    *   Source: `develop`.
3.  **Bugfix Branches**:
    *   Name: `fix/ID-description` (e.g., `fix/15-calendar-error`).
    *   Source: `develop` (or `main` for critical hotfixes).
4.  **Commits**: We use *Conventional Commits*:
    *   `feat: ...` for new features.
    *   `fix: ...` for corrections.
    *   `docs: ...` for documentation.
    *   `refactor: ...` for code changes without affecting functionality.

## Steps to Collaborate

1.  Update your local branch: `git pull origin develop`.
2.  Create your branch: `git checkout -b feat/new-feature`.
3.  Develop and test locally.
4.  Push changes: `git push origin feat/new-feature`.
5.  Open a **Pull Request (PR)** towards `develop`.
6.  Request code review.

> [!IMPORTANT]
> Do not merge directly to `develop` or `main`. Always use PRs.
