# Project Architecture

Technical reference for Transia MVP structure and patterns.

## Directory Structure

*   `app/`: **Expo Router**. Screens and navigation.
*   `components/`: Reusable UI components (Buttons, Inputs, Cards).
*   `stores/`: **Zustand**. Global state management. The "source of truth" for the UI.
*   `services/`: Business logic and external calls.
    *   `data/`: Data adapters (Supabase, Mocks).
*   `constants/`: Static configuration (Colors, Enums, Constants).

## Data Pattern
`UI` -> `Store` -> `Service` -> `Supabase`

The UI subscribes to Store changes. The Store executes logic and calls the Service. The Service returns raw data which the Store processes and stores.
