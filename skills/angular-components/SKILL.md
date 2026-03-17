---
name: angular-components
description: Generates or updates Angular components, including pages, features, presentational components, sub-components, and shared UI components. Use this unified skill for ANY component creation.
---

# Skill: Unified Angular Component Creator

## Description

This skill covers the creation and maintenance of **ALL types of Angular components**, ensuring a strict separation of concerns, modern use of Signals/standalone components, and architecture best practices.

> **Important Rule**: Always prefer using the Angular CLI (`ng generate ...`) to scaffold new Angular elements (components, services, etc.) rather than manually creating files.
> **Testing Requirement**: Writing unit tests is STRICTLY REQUIRED for any newly created elements. Please refer to the `angular-tests` skill for testing guidelines, best practices, and requirements.

## General Rules

- **Standalone**: `standalone: true`.
- **Change Detection**: `ChangeDetectionStrategy.OnPush`.
- **Logic**: Minimal. Only UI state and event bindings. Delegate business logic/state to a Local Service.
- **Inputs/Outputs**: Use Signal-based `input()`, `input.required()`, and `output()`.
- **Injection**: Use `inject()` instead of constructor injection.
- **Control Flow**: Use modern `@if`, `@for`, and `@switch` syntax instead of structural directives (`*ngIf`, `*ngFor`).
- **Data Fetching**: Must NOT directly access `HttpClient` or API services (delegate to dedicated services).
- **UI Libraries**: Direct usage of UI library elements (e.g., Angular Material, PrimeNG) in feature components is strictly prohibited. Use wrapper components (`src/app/shared/ui/`) instead. Notify the user when you need to use a UI library component.

## Component Types

Angular applications in this workspace consist of 5 main component types. Choose the appropriate type based on your needs:

---

### 1. Angular Page

**Location**: `src/app/pages/<page-name>/`
**Purpose**: A route-level container component. It is a thin orchestration layer that composes one or more features and handles routing and layout.

- Each page corresponds to **exactly one route** (or subtree).
- **Thin containers**: Handle routing (lazy loading in `app.routes.ts`) and feature composition.
- **Must NOT** implement business logic or directly access API services (delegate to feature logic services).
- **Must NOT** export components that other pages/features import.
- **Interaction Rules**: Pages import feature components — never the reverse. Pages do NOT import other pages. If multiple pages share layout, extract the layout into `src/app/shared/` or `src/app/layouts/`.
- **Structure**: Prefer inline template/styles in a single `.ts` file.
- **Naming**:
  - Folder: `kebab-case` matching the route path (e.g., `orders`, `dashboard`).
  - Selector prefix: `app-` (e.g., `app-orders-page`).
  - Class name: PascalCase ending with `PageComponent` (e.g., `OrdersPageComponent`).

#### Routing Example

Pages must be lazy-loaded in `app.routes.ts`:

```typescript
{
  path: '<route-path>',
  loadComponent: () =>
    import('./pages/<page-name>/<page-name>-page.component').then((m) => m.<PageName>PageComponent),
}
```

#### Composition Example

```typescript
import { OrderListComponent } from "@features/orders"; // imported via orders/index.ts barrel
import { PaymentStatusComponent } from "@features/payments";

@Component({
  selector: "app-orders-page",
  standalone: true,
  imports: [OrderListComponent, PaymentStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="orders-page">
      <app-order-list />
      <app-payment-status />
    </div>
  `,
})
export class OrdersPageComponent {}
```

---

### 2. Angular Feature

**Location**: `src/app/features/<module-name>/`
**Purpose**: A self-contained business domain module (e.g., orders, auth, cart).

- `module-name` — **plural** name of the business domain (e.g. `orders`, `products`, `auth`).
- `feature-name` — **singular** name of a specific feature within the module (e.g. `order-list`, `order-detail`, `product-list`).
- Represents a **business concept** and owns all related components, services, state, and models.
- Exposes a public API via a barrel file (`index.ts`) for pages to use.
- **May include**: Standalone UI components, component-scoped logic services (`angular-services`), Signal-based state management, API integration via global API services (`src/app/api/`), models, constants, utilities.
- **Module-level optional folders** (`components/`, `services/`, `models/`, `constants/`, `utils/`) — shared across **all features** in the module.
- **Feature-level optional folders** (same names) — scoped to that **single feature** only.
- **Interaction Rules**: Must NOT depend on Pages or other features (use `src/app/shared/` for shared elements). Must NOT be imported directly by path — all exports MUST go through `index.ts`.
- **Wire Up**: Features do NOT register routes themselves — that is the responsibility of a Page.

#### Directory Structure

```
src/app/features/<module-name>/               // e.g. 'orders'
  ├── index.ts                                // Barrel: export public API of the module
  │
  │   // --- Optional module-level folders (shared by ALL features in the module) ---
  ├── components/                             // Optional: sub-components shared across features
  │     └── <shared-component-name>/
  ├── services/                               // Optional: services shared across features
  │     └── <shared-service-name>.service.ts
  ├── models/                                 // Optional: interfaces/types/enums shared across features
  │     └── <model-name>.model.ts
  ├── constants/                              // Optional: constants shared across features
  │     └── <name>.constants.ts
  ├── utils/                                  // Optional: utils shared across features
  │     └── <name>.utils.ts
  │
  │   // --- Features (each is a self-contained unit) ---
  ├── <feature-name>/                         // e.g. 'order-list'
  │     ├── <feature-name>.component.ts       // Main component
  │     ├── <feature-name>.component.html
  │     ├── <feature-name>.component.scss
  │     ├── <feature-name>.component.spec.ts
  │     ├── <feature-name>-logic.service.ts   // Local logic service
  │     ├── <feature-name>-logic.service.spec.ts
  │     │
  │     │   // --- Optional feature-level folders (scoped to THIS feature only) ---
  │     ├── components/                       // Optional: sub-components used only here
  │     │     └── <sub-component-name>/
  │     ├── services/                         // Optional: services used only here
  │     │     └── <service-name>.service.ts
  │     ├── models/                           // Optional: interfaces/types/enums used only here
  │     │     └── <model-name>.model.ts
  │     ├── constants/                        // Optional: constants used only here
  │     │     └── <name>.constants.ts
  │     └── utils/                            // Optional: utils used only here
  │           └── <name>.utils.ts
  │
  └── <feature-name-2>/                       // e.g. 'order-detail'
        └── ...
```

> **Scoping Rule**: If a model, service, constant, utility, or component is used by **more than one feature** within the same module, move it to the **module-level** folder. If it is used across **multiple modules**, move it to `src/app/shared/`.

_Barrel File Example (`index.ts`)_:

```typescript
// src/app/features/orders/index.ts
export { OrderListComponent } from "./order-list/order-list.component";
export { OrderDetailComponent } from "./order-detail/order-detail.component";
```

> ❌ **Restriction**: Importing **directly** into a feature's internal files from outside the module is **strictly forbidden**.
> All public symbols MUST be exported exclusively through `index.ts`.
>
> ```typescript
> // ✅ Correct
> import { OrderListComponent } from "@features/orders";
>
> // ❌ Wrong — never import directly by path
> import { OrderListComponent } from "@features/orders/order-list/order-list.component";
> ```

> 📁 **Relative Imports Inside a Module**: Files **within** the same module MUST use **relative imports** when referencing other files inside that module. Never use the `@features/<module-name>` alias internally — it points to the public `index.ts` barrel and bypasses the internal structure.
>
> ```typescript
> // ✅ Correct — relative import inside the module
> import { OrderFormComponent } from "../components/order-form/order-form.component";
> import { OrderModel } from "../models/order.model";
>
> // ❌ Wrong — do not use the public barrel alias for internal imports
> import { OrderModel } from "@features/orders";
> ```

### 3. Sub-Component

**Location**: The `components` folder inside feature, module, page, etc.
**Purpose**: Small dumb components to split large features.

- Used when a component's HTML file becomes too large.
- Structure: Try use only `component.ts` file with inline styles and template. If component is too large create separate HTML and SCSS files.
- Try to avoid using any services inside sub-components.
- Can inject a logic service from the main parent component if absolutely necessary using `inject()`.

---

### 4. Shared Component

**Location**: `src/app/shared/components/<component-name>/`
**Purpose**: Business-specific or complex components that are reused across multiple different features or pages.

- Unlike **Shared UI Components** (which are domain-agnostic generic UI elements wrapping UI library components like Angular Material or PrimeNG), **Shared Components** often contain application-specific logic, composition of multiple UI elements, or business domain concepts.
- Used when multiple independent features require the exact same complex component.
- **Structure**: Can have a structure similar to an **Angular Feature** (e.g., its own `models/`, `constants/`, `utils/`, or even a local logic service `<component-name>-logic.service.ts` if the component logic is complex enough).
- **Interaction Rules**: Can import and composed of Shared UI components (`src/app/shared/ui/`). Should *avoid* importing directly from specific feature modules (`src/app/features/`) to prevent circular dependencies.
- Examples: `UserProfileCardComponent`, `AddressSelectorComponent`, `NotificationBannerComponent`.
- **Naming**:
  - File: `src/app/shared/components/<component-name>/<component-name>.component.ts`
  - Class: PascalCase ending with `Component`.

---

### 5. Shared UI Component

**Location**: `src/app/shared/ui/<component-name>/`
**Purpose**: Reusable UI elements (field, card, dropdown, modal) independent of features.

- Wraps external UI library elements (e.g., Angular Material, PrimeNG).
- **Styling**: Use Scoped CSS/SCSS within the wrapper component to customize UI library elements if needed.
- Always check `src/app/shared/ui/` for an existing wrapper before creating a new one!
- Examples: `AppButtonComponent` wrapping `mat-button` or `p-button`.
- **Naming**:
  - File: `src/app/shared/ui/<component-name>/<component-name>.component.ts`
  - Class: PascalCase ending with `Component` (e.g., `CardComponent`).
  - Spec: `<component-name>.component.spec.ts`

## Workflow

1. Determine the component scope:
   - Is it tied to a Route? -> **Page**.
   - Is it a distinct business domain? -> **Feature**.
   - Is it a UI block for a feature? -> **Feature Component**.
   - Is feature HTML too large? -> **Sub-Component**.
   - Is it a generic, reusable UI building block (wrapper for UI library components)? -> **Shared UI Component**.
2. Run Angular CLI to generate the scaffolding in the correct directory.
3. Update specific files according to the architectural rules described above.
