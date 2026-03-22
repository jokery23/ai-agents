---
name: angular-developer
description: Use this skill when the user asks to create, generate, modify, or scaffold Angular components, services, directives, pipes, guards, or features. Also applies when user asks about Angular best practices, Angular architecture, Angular project structure, or how to do something "the Angular way".
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

- **Standalone First**: Make all components, directives, pipes standalone (`standalone: true`).
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

## Shared Structure

All general, application-wide reusable elements reside in `src/app/shared/`.

**General Rule**: Any Angular element — component, service, pipe, directive, utility, or model — should be placed in `src/app/shared/` when it is needed by **more than one independent feature**.
art local (inside a feature) and promote to `shared/` only once the need for sharing is confirmed.

```typescript
src/app/shared/
  ├── components/    // Business-specific components reused across features
  ├── services/      // Application-wide services (not API, not feature-scoped)
  ├── pipes/         // Reusable pipes used in multiple features
  ├── directives/    // Reusable directives used in multiple features
  └── utils/         // Shared utility functions, helpers, constants, models
```

## Performance Optimization

- **Lazy Loading**: Enable lazy loading for feature modules to optimize initial load times.
- **Efficient Rendering**: Use `trackBy` functions (or tracking in `@for`) to optimize list rendering.
- **Pure Computations**: Apply pure pipes for any computationally heavy operations.
- **Directives & DOM**: Avoid direct DOM manipulation; rely exclusively on Angular's templating engine.
- **Images**: Use `NgOptimizedImage` for better image loading performance and link resilience.
- **Deferrable Views**: Implement `@defer` blocks to delay rendering non-essential components until needed.

## UI & Accessibility

- **Accessibility (a11y)**: Use semantic HTML and appropriate ARIA attributes.

## Components and Features(Feature Components)

(`references/components.md`): Contains detailed information on how to implement, create, and modify Angular components and features(feature components).

## Services

(`references/services.md`): Contains detailed information on how to implement, create, and modify Angular services.
