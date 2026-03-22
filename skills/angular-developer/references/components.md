# Angular Components Guidelines

## Description

This document covers the creation and maintenance of **ALL types of Angular components**, ensuring a strict separation of concerns, modern use of Signals/standalone components, and architecture best practices.

## Component Conventions

- Use **standalone components** (Angular 14+) — avoid `NgModule` declarations unless integrating with legacy code
- Use `OnPush` change detection by default for better performance
- Logic should be minimal. Only UI state and event bindings. Delegate business logic/state to a Local Service.
- Keep templates simple — move logic to the component class or services
- Use `input()` / `output()` signals (Angular 17+) instead of `@Input()` / `@Output()` decorators when possible
- Use modern control flow syntax (`@if`, `@for`, `@switch`) instead of structural directives (`*ngIf`, `*ngFor`)
- Must NOT directly access `HttpClient` or API services (delegate to dedicated services).
- Prefer `inject()` function over constructor injection for cleaner code

## Smart vs Presentational(Dumb) Components

- **Smart (container)** components: inject services with business logic
- **Presentational** components: receive data via inputs, emit events via outputs — no direct service injection, used to display data and handle user interactions, useful for breaking down complex UI templates into smaller, reusable components

## Component Structure

```typescript
component-name/
  ├── components/                       // (optional) Local, small UI parts of the component
  ├── services/                         // (optional) Local auxiliary services
  ├── pipes/                            // (optional) Local pipes
  ├── directives/                       // (optional) Local directives
  ├── component-name.component.ts       // Minimum logic (delegate to service)
  ├── component-name.component.html     // Keep template minimal, use local dumb sub-components to break down complex UI
  ├── component-name.component.scss
  ├── component-name.component.spec.ts
  ├── component-name.service.ts         // Local logic service, must be provided locally
  ├── component-name.service.spec.ts
  ├── component-name.utils.ts           // (optional) Local utils
  ├── component-name.constants.ts       // (optional) Local constants
  └── component-name.models.ts          // (optional) Local models
  └── index.ts                          // Export public API of the component
```

## Feature Components(or simply features)

Features are business domains with structure similar to component structure, but on higher level with complex logic.
Example: orders feature can have order list, order detail, order creation, etc. components.

- Features are located in the `src/app/features/<feature-name>/` folder
- Features MUST NOT depend on other features
- All local(inside feature folder) imports MUST use relative paths
- All external imports MUST use absolute paths (e.g. `@shared/components/button`, `@api/orders-api`)
- Files within a feature MUST remain internal to that feature. Only main feature component should be exported via `index.ts`

## Sub-Components

Sub-components are blocks used only inside one feature or component to avoid large templates and/or logic duplication and keep components focused on single responsibility.

- Can be smart(with its own logic and state) or dumb(UI only, inputs/outputs only)
- Sub-components are located in the `components/` folder inside the parent

## Shared Components

All general, application-wide reusable components reside in `src/app/shared/`.

---

## Tree Decision — Which Component Type to Create?

Use this decision tree to determine which component type to use when creating a new component:

```
Is it a self-contained, independent business domain (e.g., orders, auth)?
│
├── YES → Feature Component
│         Location: src/app/features/<feature-name>/
│         Must NOT depend on other features.
│         Only the main feature component is exported via index.ts.
│
└── NO  → Is it used only inside one feature or parent component?
          │
          ├── YES → Sub-Component
          │         Location: components/ folder inside the parent
          │         │
          │         ├── Has its own logic/state? → Smart Sub-Component
          │         │   (may inject local services, manage own state)
          │         │
          │         └── UI only, no direct service injection? → Dumb Sub-Component
          │             (inputs/outputs only, purely presentational)
          │
          └── NO  → Is it already used (or will be used) by more than one
                    independent feature?
                    │
                    ├── YES → Shared Component
                    │         Location: src/app/shared/components/
                    │         Rule: Start local inside a feature first.
                    │         Promote to shared/ only once the need is confirmed.
                    │
                    └── NO  → Keep it local for now.
                              Reconsider scope when a second feature needs it.
```
