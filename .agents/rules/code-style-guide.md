---
trigger: always_on
---

## Component Architecture
- Functional Components: Always use const Component: React.FC = () => { ... }. Avoid class components.
- Ionic Layout: Strict adherence to the standard hierarchy: IonPage > IonHeader (with IonToolbar & IonTitle) > IonContent. but can be changed based on the page type.
- Logic Separation: Keep business logic in custom hooks rather than inside the UI component.
- File Naming: Use PascalCase for components (HomeCard.tsx) and camelCase for hooks and utilities (useAuth.ts).


## TypeScript & Data
- Strict Typing: No any. Use interface for component props and data models
- Capacitor Plugins: Always type the return values of Capacitor calls. Wrap plugin calls in try/catch blocks since hardware access can fail.
- Enums for Constants: Use enums for route paths, storage keys, or fixed UI states to prevent "magic strings."


## State Management
- Local State: Use useState for simple UI toggles.
- Complex State: Use useReducer or a lightweight store (like Zustand or signals) to avoid the boilerplate of Redux, which can confuse simpler AI agents.
- Persistence: Use @capacitor/preferences for simple key-value pairs instead of localStorage to ensure compatibility across web and native.


## Styling
- CSS Modules: Prefer Component.module.css to scoped styles. This prevents global style leakage which is common in hybrid apps.
- Ionic Variables: Always use Ionic's CSS variables (e.g., var(--ion-color-primary)) instead of hardcoded hex codes to ensure Dark Mode works automatically.

## Platform specific
- Platform Checks: Use the isPlatform utility from @ionic/react to handle platform-specific logic (e.g., different UI for iOS vs Android).

## Integrated Workflow
- Format with Prettier: Use @ionic/prettier-config to define standard spacing and quotes. Prettier should handle the "look," while ESLint handles the "logic".


