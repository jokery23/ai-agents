---
name: angular-developer
description: A comprehensive skill for developing all Angular elements, including components and services, directives, pipes and features.
---

# Skill: Angular Developer

## Description

This document outlines the core architectural principles, guidelines, and best practices for developing Angular applications within this workspace. It is based on the global rules defined for the project.

Use this unified skill when developing or modifying any of the following:

- Components
- Services
- Directives
- Pipes
- Features(Isolated business domains with its own components, services, etc.)

## Generate Angular Elements

Always prefer using the Angular CLI (`ng generate ...`) to scaffold new Angular elements (components, services, directives, pipes, etc.) rather than manually creating files. Then update the generated files according to the rules in this document.

## Modern Angular Paradigms

- **Standalone First**: Make all components, directives, pipes, and services standalone (`standalone: true`).
- **Reactive State Management**: Utilize Angular's **Signals** system (`signal`, `computed`, `effect`), along with `rxResource`, `input()`, `output()`, and `viewChild()`. Avoid `@Input()` and `@Output()` decorators.
- **Change Detection**: Always use `ChangeDetectionStrategy.OnPush` to optimize rendering.
- **Control Flow**: Use the modern `@if`, `@for`, and `@switch` block syntax instead of legacy structural directives (`*ngIf`, `*ngFor`).
- **Dependency Injection**: Use the `inject()` function directly within component logic, directives, or services instead of constructor injection.

## APIs (HTTP Requests)

All HTTP requests must be placed in the `src/app/api/` folder.

- API services should be globally provided: `providedIn: 'root'`.

```typescript
src/app/api/
  └── orders-api/
      ├── orders-api.service.ts
      ├── orders-api.model.ts
      └── index.ts               // export all services and models
```

## Feature Architecture

Features represent isolated business domains.

- **Feature Services**: Services inside a feature must **not** make direct HTTP requests. Instead, they should inject API services (`src/app/api/`) and contain only business logic. They should be provided locally (avoid `providedIn: 'root'`)

```typescript
src/app/features/feature-name/
  ├── components/                     // (optional) Local, small UI parts of the feature
  ├── services/                       // (optional) Local auxiliary services
  ├── pipes/                          // (optional) Local pipes
  ├── directives/                     // (optional) Local directives
  ├── feature-name.component.ts       // Minimum logic (delegate to service)
  ├── feature-name.component.html     // Keep template minimal, use local components to break down complex UI
  ├── feature-name.component.scss
  ├── feature-name.component.spec.ts
  ├── feature-name.service.ts         // Local logic service, must be provided locally
  ├── feature-name.service.spec.ts
  ├── feature-name.utils.ts           // (optional) Local utils
  ├── feature-name.constants.ts       // (optional) Local constants
  └── feature-name.models.ts          // (optional) Local models
  └── index.ts                        // Export public API of the feature
```

## Shared Structure

All general, application-wide reusable elements reside in `src/app/shared/`.

```typescript
src/app/shared/
  ├── components/
  │   └── component-name/
  │       ├── component-name.component.ts
  │       ├── component-name.component.html
  │       ├── component-name.component.scss
  │       └── index.ts
  ├── services/
  │   └── service-name/
  │       ├── service-name.service.ts
  │       └── index.ts
  └── utils/
```

## Import Order

Organize imports logically to maintain clean files:

1. Angular core and common modules
2. RxJS modules
3. Angular-specific modules (e.g., `FormsModule`)
4. Core application imports
5. Shared module imports
6. Environment-specific imports
7. Relative path imports

## Performance Optimization

- **Lazy Loading**: Enable lazy loading for feature modules to optimize initial load times.
- **Efficient Rendering**: Use `trackBy` functions (or tracking in `@for`) to optimize list rendering.
- **Pure Computations**: Apply pure pipes for any computationally heavy operations.
- **Directives & DOM**: Avoid direct DOM manipulation; rely exclusively on Angular's templating engine.
- **Images**: Use `NgOptimizedImage` for better image loading performance and link resilience.
- **Deferrable Views**: Implement `@defer` blocks to delay rendering non-essential components until needed.

## UI & Accessibility

- **Accessibility (a11y)**: Use semantic HTML and appropriate ARIA attributes.

## Components

(`references/components.md`): Contains detailed information on how to implement, create, and modify Angular components.

## Services

(`references/services.md`): Contains detailed information on how to implement, create, and modify Angular services.
