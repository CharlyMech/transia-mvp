## 🚀 Getting Started

### Prerequisites

-  **Node.js** (v18 or higher)
-  **npm** or **yarn**
-  **Expo CLI** (installed automatically with dependencies)
-  **iOS Simulator** (macOS only) or **Android Emulator** or **Physical device with Expo Go**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/transia-mvp.git
   cd transia-mvp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   -  Set up your Supabase credentials if using production mode
   -  Configure environment variables for different modes

### Running the Application

#### Development Mode (Local)

```bash
npm start
```

This opens the Expo developer tools. You can then:

-  Press `i` for iOS simulator
-  Press `a` for Android emulator
-  Scan QR code with Expo Go app on your physical device

#### Test Mode (with Mock Data)

```bash
npm run start:test
```

Uses local JSON mock data instead of Supabase backend - perfect for development without database access.

**Platform-specific test mode:**

```bash
npm run android:test   # Android with test mode
npm run ios:test       # iOS with test mode
npm run web:test       # Web with test mode
```

#### Production Mode

```bash
npm run start:prod
```

Connects to Supabase production database.

#### Debug Mode

```bash
npm run start:debug
```

Enables the debug panel for development troubleshooting.

#### Other Commands

```bash
npm run android        # Run on Android (default mode)
npm run ios            # Run on iOS (default mode)
npm run web            # Run on Web (default mode)
npm run reset-project  # Reset the project (clears cache)
npm run lint           # Run ESLint
```

---

## 📁 Project Structure

```
transia-mvp/
├── app/                        # Expo Router file-based routing
│   ├── (tabs)/                 # Main tab navigation
│   │   ├── index.tsx           # Dashboard/Home
│   │   ├── ...
│   ├── drivers/                # Driver-related screens
│   │   ├── [id]/               # Dynamic driver detail routes
│   │   │   ├── index.tsx       # Driver profile
│   │   │   ├── ...
│   │   │   └── edit/
│   │   └── new-driver.tsx
│   ├── fleet/                  # Fleet-related screens
│   │   ├── [id].tsx            # Vehicle detail
│   │   ├── ...
│   │   └── edit/
│   ├── reports/                # Report-related screens
│   │   ├── [id].tsx            # Report detail
│   │   ├── ...
│   │   └── edit/
│   ├── settings/               # Settings screens
│   ├── login.tsx               # Login screen
│   ├── +not-found.tsx          # Not found screen
│   ├── error.tsx               # Error screen
│   └── _layout.tsx             # Root layout
├── assets/
│   ├── images/                 # App images
│   ├── mocks/                  # JSON mock data
│   ├── screenshots/            # App screenshots
├── components/                 # Custom components
│   ├── forms/                  # Form components
│   ├── modals/                 # Modal components
│   ├── Card.tsx
│   ├── ...
├── constants/                  # App constants
│   ├── enums/                  # Enumerations
│   ├── theme.ts                # Theme configuration
├── docs/                       # Documentation
├── hooks/                      # Custom hooks
├── models/                     # Data models
├── services/                   # API and data services
│   ├── data/                   # Data fetching and processing
│   │   ├── index.ts            # Report detail
│   │   ├── supabase/           # Supabase client and services
│   │   ├── mock/               # Mock services
│   ├── env.ts                  # Environment configuration -> sets right service (mock or supabase)
├── stores/                     # Zustand state management
├── utils/                      # Utility functions
├── app.json                    # App configuration
├── babel.config.js             # Babel configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies

```
