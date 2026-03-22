# Angular Services Guidelines

## Description

This document covers the creation and maintenance of **ALL types of Angular services**, ensuring a strict separation of concerns between global data-access (API), component-scoped logic, and shared utility services.

## Service Conventions

- Always use Angular CLI (`ng generate service ...`) to scaffold new services — then update generated files according to the rules below
- Use `inject()` function over constructor injection for cleaner code
- For every service type **except** Component Logic Services, create a dedicated folder with an `index.ts` that is the **only** export point to the outside

## Service Types

Angular applications in this workspace use three categories of services:

---

## 1. Global API Service

**Location**: `src/app/api/<resource-name>/`

**Purpose**: The sole bridge between the Angular application and external backend APIs. Handles all HTTP operations for a specific domain resource.

- **Singleton Scope**: Must use `providedIn: 'root'` — single shared instance across the entire app
- **Protocol**: Use `HttpClient` or the modern `httpResource` API for RESTful operations (`GET`, `POST`, `PUT`, `DELETE`)
- **Encapsulation**: Each service covers one domain/resource (e.g., `users-api.service.ts`, `products-api.service.ts`)
- **Type Safety**: Define interfaces (DTOs) for every request body and response payload
- Must NOT contain business logic or UI state — data access only

**Structure**:

```typescript
src/app/api/<resource-name>/
  ├── <resource-name>-api.service.ts
  ├── <resource-name>-api.service.spec.ts
  ├── <resource-name>-api.model.ts
  ├── <resource-name>-api.constants.ts  // (optional) API-specific constants
  └── index.ts                          // Required: only export point to the outside
```

**Example**:

```typescript
// src/app/api/users/users-api.model.ts
export interface UserDto {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

// src/app/api/users/users-api.service.ts
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserDto, CreateUserRequest } from "./users-api.model";

@Injectable({
  providedIn: "root",
})
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "/api/users";

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  createUser(user: CreateUserRequest): Observable<UserDto> {
    return this.http.post<UserDto>(this.apiUrl, user);
  }
}

// src/app/api/users/index.ts
export * from "./users-api.service";
export * from "./users-api.model";
```

---

## 2. Component Logic Service (Local Service)

**Location**: Alongside the component it serves (no dedicated folder)

```typescript
<component-name>/
  ├── <component-name>.component.ts
  ├── <component-name>.service.ts       // Logic service — no providedIn: 'root'
  └── <component-name>.service.spec.ts
```

**Purpose**: Manages component-specific state, data transformation, and complex logic. Acts as the bridge between the Component UI and Global API Services.

- **Scoped Lifecycle**: Must be provided in the component's `providers: []` array — lifecycle matches the component
- **No Global Scope**: Strictly forbidden to use `providedIn: 'root'`
- **No HTTP**: Strictly forbidden to import `HttpClient` or make direct HTTP calls
- **Logic Only**: Data transformation, state transitions, high-level orchestration. UI-specific logic (e.g., focus management) stays in the component

---

## 3. Shared Utility / State Service

**Location**: `src/app/shared/services/<service-name>/`

**Purpose**: Provides cross-cutting concerns, global non-API state, or reusable utilities needed by multiple unrelated features.

- **Singleton Scope**: Must use `providedIn: 'root'`
- **Domain Agnostic**: Must NOT contain feature-specific business logic or direct API calls
- **Highly Reusable**: Designed to be injected anywhere in the application

**Examples**: `ThemeService`, `NotificationService`, `LocalStorageService`, `LoggerService`

**Structure**:

```typescript
src/app/shared/services/<service-name>/
  ├── <service-name>.service.ts
  ├── <service-name>.service.spec.ts
  ├── <service-name>.model.ts    // (optional) if specific models are needed
  └── index.ts                   // Required: only export point to the outside
```

**Example**:

```typescript
// src/app/shared/services/theme/theme.service.ts
import { Injectable, signal, effect } from "@angular/core";

export type Theme = "light" | "dark";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly STORAGE_KEY = "app-theme";

  readonly currentTheme = signal<Theme>(
    (localStorage.getItem(this.STORAGE_KEY) as Theme) || "light",
  );

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, this.currentTheme());
      document.body.classList.toggle(
        "dark-mode",
        this.currentTheme() === "dark",
      );
    });
  }

  toggleTheme() {
    this.currentTheme.update((theme) => (theme === "light" ? "dark" : "light"));
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
  }
}

// src/app/shared/services/theme/index.ts
export * from "./theme.service";
```

---

## Tree Decision — Which Service Type to Create?

Use this decision tree to determine which service type to use when creating a new service:

```
Does the service make direct HTTP calls to a backend API?
│
├── YES → Global API Service
│         Location: src/app/api/<resource-name>/
│         Must use providedIn: 'root'. Uses HttpClient.
│         One service per domain/resource.
│
└── NO  → Is the service logic tied to a single component or feature?
          │
          ├── YES → Component Logic Service
          │         Location: alongside the component (no dedicated folder)
          │         Must NOT use providedIn: 'root'.
          │         Provided in the component's providers: [] array.
          │         No HTTP calls. Logic and state only.
          │
          └── NO  → Is it cross-cutting utility or state used by multiple
                    independent features?
                    │
                    ├── YES → Shared Utility / State Service
                    │         Location: src/app/shared/services/<service-name>/
                    │         No feature-specific logic. No direct HTTP calls.
                    │
                    └── NO  → Reconsider scope — likely a Component Logic
                              Service kept local until sharing is confirmed.
```
