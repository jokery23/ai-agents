---
name: angular-services
description: Generates or updates Angular services, including global API services and local component logic services. Use this unified skill for ANY service creation.
---

# Skill: Unified Angular Service Creator

## Description

This skill covers the creation and maintenance of **ALL types of Angular services**, ensuring a strict separation of concerns between global data-access (API) and component-scoped state/logic (Feature Services).

## Decision Tree

```
What kind of service do you need?

1. Direct data fetching or mutation from an external backend API
   └── Global API Service — `providedIn: 'root'`, uses `HttpClient`

2. Does the service manage state, data transformation, or complex logic for a specific component or feature?
   └── Yes → Component Logic Service — provided in component's `providers`, no HTTP calls
       Examples: mapping API data to UI state, complex form handling for a specific view

3. Does the service provide cross-cutting utilities, generic state, or wrappers used by multiple unrelated features?
   └── Yes → Shared Utility/State Service — `providedIn: 'root'`, placed in a `shared/services` folder
       Examples: Theme management, Notifications/Toasts, Local Storage wrapper, Logging
```

> **Important Rule**: Always prefer using the Angular CLI (`ng generate service ...`) to scaffold new Angular services rather than manually creating files.
> **Testing Requirement**: Writing unit tests is STRICTLY REQUIRED for any newly created services. Please refer to the `angular-tests` skill for testing guidelines, best practices, and requirements.

## General Rules

- **Folder Structure**: For EACH service—**EXCEPT component logic services** (which are local to a component, lack `providedIn: 'root'`, and share the component's lifecycle)—you MUST create a dedicated folder containing the following specific structure:
  ```typescript
  <service-name>.service.ts
  <service-name>.spec.ts
  <service-name>.model.ts
  index.ts                // Required: Exports to the outside MUST ONLY be via this index file
  ```

## Service Types

Angular applications in this workspace utilize categories of services:

---

### 1. Global API Service

**Location**: `src/app/api/<resource-name>/<resource-name>-api.service.ts`
**Purpose**: A global data-access service that serves as the bridge between the Angular application and external backend APIs.

- **Singleton Scope**: All API services must use `providedIn: 'root'` to ensure a single instance is shared across the entire application.
- **Protocol**: Utilize `HttpClient` or the modern `httpResource` API for RESTful operations (`GET`, `POST`, `PUT`, `DELETE`).
- **Encapsulation**: Each service should be responsible for a specific domain or resource (e.g., `users-api.service.ts`, `products-api.service.ts`).
- **Type Safety**: Strictly define interfaces(dto) or types for every request body and response payload to ensure end-to-end type safety.

**Structure**:

```
src/app/api/<resource-name>/
  ├── <resource-name>-api.service.ts
  ├── <resource-name>-api.service.spec.ts
  ├── <resource-name>-api.model.ts
  ├── <resource-name>-api.constants.ts  // Optional: if specific API constants are needed
  └── index.ts                          // Required: Exports to the outside MUST ONLY be via this index file
```

**Example**:
Reference the following file for a complete API service implementation:
`./examples/api-resource.service.ts`

---

### 2. Component Logic Service (Local Component Service)

**Location**: closest component

```
  <component-name>.component.ts
  <component-name>-logic.service.ts
  <component-name>-logic.service.spec.ts
```

**Purpose**: Manages component-specific state and logic. Acts as a bridge between the Component UI and global API services.

- **Scoped Lifecycle**: The service MUST be provided at the component level using the `providers: []` array in the `@Component` decorator.
- **No Global Scope**: Strictly forbidden to use `providedIn: 'root'`. This ensures the service's lifecycle matches the component's and prevents unintended state sharing.
- **Separation of Concerns**: Strictly forbidden to import `HttpClient` or perform direct HTTP calls.
- **Logic Only**: Focus on data transformation, state transitions, and high-level orchestration. UI-specific logic (like focus management) should remain in the component.

**Examples**:
- [Logic Service Implementation](./examples/feature-logic.service.ts)
- [Component + Logic Integration](./examples/component-logic-integration.ts)

---

### 3. Shared Utility / State Service

**Location**: `src/app/shared/services/<service-name>/<service-name>.service.ts`

**Purpose**: Provides cross-cutting concerns, global non-API state, or reusable utility functions for multiple unrelated features.

- **Singleton Scope**: Must use `providedIn: 'root'` to ensure a single instance across the application.
- **Domain Agnostic**: Should NOT contain feature-specific business logic or direct API calls. Focus on generic operations.
- **Highly Reusable**: Designed to be injected and used anywhere in the application.

**Examples**: `ThemeService`, `NotificationService`, `LocalStorageService`, `LoggerService`.

**Example**:
Reference the following file for a theme management service using Signals:
`./examples/theme.service.ts`

**Structure**:

```
src/app/shared/services/<service-name>/
  ├── <service-name>.service.ts
  ├── <service-name>.service.spec.ts
  ├── <service-name>.model.ts      // Optional: if specific models are needed
  └── index.ts                     // Required: Exports to the outside MUST ONLY be via this index file
```

## Workflow

1. Determine the service scope using the decision tree above.
2. Run Angular CLI to generate the scaffolding in the correct directory.
3. Update specific files according to the architectural rules described above.
