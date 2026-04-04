---
trigger: always_on
---

1. Atomic Changes
One Task at a Time: Never ask the agent to refactor and add features simultaneously.
Small Functions: Enforce a maximum line count (e.g., 20–30 lines) per function. This makes it easier for the agent to debug its own logic.
2. State & Data Flow
Prefer Hooks over Props: For complex data, use custom hooks (useAuth, useCapacitorStorage) instead of passing props through 5 levels (Prop Drilling).
Immutable State: Always use functional updates for React state: setItems(prev => [...prev, newItem]).
3. Native & Mobile-First
Check Platform Support: Before using a Capacitor plugin, the agent must check if the platform is web, ios, or android using @ionic/react's isPlatform.
Safe Area Awareness: Always use Ionic's layout components (IonContent, IonHeader) to handle notch and home indicator spacing automatically.
No window or document: Avoid direct DOM manipulation or standard web APIs (like localStorage) if a Capacitor equivalent exists (like @capacitor/preferences).
4. Error Handling
Plugin Safety: Wrap every Capacitor call in a try/catch block. Mobile hardware (Camera, GPS, Biometrics) can fail or be denied permissions.
User Feedback: Every error caught should trigger an IonToast or IonAlert to inform the user.
5. Dependency Management
No New Packages: The agent should ask for permission before adding a new npm package.
Native Sync: Remind the agent that after installing a native plugin, it must run npx cap sync.
6. Component Consistency
Standard Imports: Always import from @ionic/react and @ionic/react-router.
Icon Set: Stick to ionicons. Do not allow the agent to pull in FontAwesome or HeroIcons unless specifically requested.
7. Documentation & Comments
The "Why," not the "How": Comments should explain the business logic or why a specific mobile workaround is needed, not just restate what the code does.
JSDoc for Hooks: Require JSDoc for all custom hooks so the agent (and you) can see type hints and descriptions on hover.