---
name: angular-architect
description: "Plan and design Angular elements from a design image, wireframe, mockup, or text description. Use when: planning new features, components, services, guards, interceptors, directives, pipes, or any Angular element; breaking down a UI design into Angular structure; scaffolding new functionality from a screenshot, spec, or text requirement. Loads angular-developer skill for conventions."
argument-hint: "Provide an image (screenshot, wireframe, mockup) or a text description of the functionality to plan"
---

# Angular Architect

## Purpose

Analyze a provided design image (screenshot, wireframe, mockup, Figma export) or a textual description of new functionality and produce a recommended Angular structure — features, components, services, guards, interceptors, directives, pipes, models, and their relationships — following the project's angular-developer conventions.

## When to Use

- Planning a new feature (set of related functionality) before writing code
- Breaking down a UI design into Angular components and services
- Designing a new standalone service, guard, interceptor, resolver, or directive
- Adding a new API integration layer
- Adding shared utilities, pipes, or reusable elements
- Reviewing whether a proposed structure follows project conventions
- Estimating the scope of new functionality from a visual or textual spec

## Prerequisites

Load the **angular-developer** skill before proceeding. It defines the conventions for components, services, pipes, features, and shared elements that this skill references.

## Procedure

### Step 1: Gather Input

Collect the context from the user:

- **Image input**: If an image is attached, analyze it visually. Identify distinct UI regions, interactive elements, data displays, forms, lists, navigation patterns, and repeated visual blocks.
- **Text input**: If a text description is provided, extract the key requirements: UI areas, user interactions, data flows, business rules, cross-cutting concerns (auth, logging, error handling), and non-UI logic.
- **Clarify scope**: Ask the user if anything is unclear:
  - Is this a standalone feature, a new element within an existing feature, or a cross-cutting concern?
  - Are there existing shared elements that should be reused?
  - Are there known API endpoints this functionality will consume?
  - Does this involve routing, guards, resolvers, or interceptors?

### Step 2: Explore Existing Codebase

Before planning anything new, search the project for existing elements that might already address or overlap with the requirement:

- **Find similar features**: Search `src/app/features/` for features with related functionality, naming, or domain.
- **Find similar components**: Look for shared or feature-local components that display similar data, forms, or interactions.
- **Find similar services**: Check `src/app/api/`, `src/app/shared/services/`, and feature `services/` folders for existing API or business logic services covering the same resource or domain.
- **Find similar guards, interceptors, resolvers, directives, pipes**: Search `src/app/core/`, `src/app/shared/`, and feature-local folders.
- **Note patterns and conventions**: Observe naming conventions, file organization, and patterns already used in similar areas of the codebase.

For each candidate found, decide:
- **Reuse as-is** — if it fully satisfies the requirement
- **Extend** — if it partially satisfies the requirement and can be safely modified
- **Create new** — if no suitable existing element exists or extending would violate single responsibility

### Step 3: Define Behavior and Clarify Requirements

Before decomposing and mapping elements, define the expected behavior of the new functionality. This ensures shared understanding and provides the foundation for test cases.

**Define behavior by specifying:**

1. **Inputs and triggers** — What initiates this feature? (user action, route event, HTTP response, timer, etc.)
2. **State transitions** — What states can this feature be in? (loading, empty, populated, error, etc.) and what causes transitions between them?
3. **Outputs and side effects** — What does this feature produce? (rendered data, emitted events, HTTP calls, route navigation, localStorage writes, etc.)
4. **Edge cases** — What happens when data is missing, empty, malformed, or requests fail?
5. **Acceptance criteria** — List the conditions that confirm the feature is working correctly. These map directly to test cases.

**Ask clarifying questions** for anything that remains ambiguous:

- What should happen when the data is empty or unavailable?
- Are there loading and error states to handle?
- Is there user-facing validation, and what are the rules?
- Are there permissions or roles that affect visibility or behavior?
- What are the expected API response shapes?
- Are there animations, transitions, or accessibility requirements?
- Should this feature be lazy-loaded?
- Are there existing patterns (error handling strategy, loading indicators, empty states) that must be followed?

Do not proceed to structural planning until behavior is clearly defined and all blocking questions are answered.

### Step 4: Identify Scope and Decompose

Determine the type of work and decompose accordingly:

**For UI-driven features (image or UI description):**

1. **What it displays** — static content, dynamic data, list of items, form, chart, etc.
2. **What interactions it supports** — clicks, inputs, navigation, drag-and-drop, filters, etc.
3. **Whether it repeats** — if a visual block appears multiple times, it is a candidate for a reusable sub-component.
4. **Data dependencies** — what data does this region need, and where does it come from (API, parent input, route params, etc.).

**For non-UI functionality (service, guard, interceptor, etc.):**

1. **What responsibility it owns** — data fetching, auth checks, request/response transformation, state management, etc.
2. **What triggers it** — route navigation, HTTP request/response cycle, user action, application lifecycle event, etc.
3. **What it depends on** — other services, configuration, external APIs, tokens, etc.
4. **Where it belongs** — feature-local, shared across features, or application-wide (core).

### Step 5: Map to Angular Elements

**For components**, use the angular-developer component decision tree:

| Question                                | YES                                             | NO         |
| --------------------------------------- | ----------------------------------------------- | ---------- |
| Is it a self-contained business domain? | Feature component (`src/app/features/<name>/`)  | Continue   |
| Used only inside one parent?            | Sub-component (`components/` inside parent)     | Continue   |
| Reused across multiple features?        | Shared component (`src/app/shared/components/`) | Keep local |

**For components**, also decide:

- **Smart vs Presentational**: Does it manage state or inject services? → Smart. Only displays data via inputs/outputs? → Presentational.

**For all elements**, decide placement:

| Element type             | Feature-local                                                      | Shared / Application-wide                             |
| ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------- |
| Service (business logic) | `features/<name>/services/` or `features/<name>/<name>.service.ts` | `src/app/shared/services/`                            |
| Service (API)            | —                                                                  | `src/app/api/<resource>/`                             |
| Guard                    | `features/<name>/guards/`                                          | `src/app/shared/guards/` or `src/app/core/guards/`    |
| Interceptor              | —                                                                  | `src/app/core/interceptors/`                          |
| Resolver                 | `features/<name>/resolvers/`                                       | `src/app/shared/resolvers/`                           |
| Directive                | `features/<name>/directives/`                                      | `src/app/shared/directives/`                          |
| Pipe                     | `features/<name>/pipes/`                                           | `src/app/shared/pipes/`                               |
| Models/Types             | `features/<name>/<name>.models.ts`                                 | `src/app/shared/models/` or `src/app/api/<resource>/` |

### Step 6: Produce the Structure

Output a clear folder tree using the angular-developer conventions. Include only the elements relevant to the planned functionality.

**Feature with components:**

```
src/app/features/<feature-name>/
  ├── components/                          // Sub-components
  │   ├── <sub-component-a>/
  │   │   ├── <sub-component-a>.component.ts
  │   │   ├── <sub-component-a>.component.html
  │   │   ├── <sub-component-a>.component.scss
  │   │   ├── <sub-component-a>.component.spec.ts
  │   │   └── index.ts
  │   └── <sub-component-b>/
  │       └── ...
  ├── services/                            // Local auxiliary services (if needed)
  ├── guards/                              // Local guards (if needed)
  ├── resolvers/                           // Local resolvers (if needed)
  ├── pipes/                               // Local pipes (if needed)
  ├── directives/                          // Local directives (if needed)
  ├── <feature-name>.component.ts          // Main feature component (smart)
  ├── <feature-name>.component.html
  ├── <feature-name>.component.scss
  ├── <feature-name>.component.spec.ts
  ├── <feature-name>.service.ts            // Local logic service
  ├── <feature-name>.service.spec.ts
  ├── <feature-name>.models.ts             // Local interfaces/types
  └── index.ts                             // Only export main feature component
```

**API services:**

```
src/app/api/<resource-name>/
  ├── <resource-name>-api.service.ts
  ├── <resource-name>-api.models.ts
  └── index.ts
```

**Shared elements:**

```
src/app/shared/<element-type>/<element-name>/
  ├── <element-name>.<element-type>.ts
  ├── <element-name>.<element-type>.spec.ts
  └── index.ts
```

**Core (application-wide singletons):**

```
src/app/core/<element-type>/
  ├── <element-name>.<element-type>.ts
  ├── <element-name>.<element-type>.spec.ts
  └── index.ts
```

### Step 7: Describe Each Element

For every element in the structure, provide a brief description:

| Element                       | Type                 | Responsibility                                                        |
| ----------------------------- | -------------------- | --------------------------------------------------------------------- |
| `<feature-name>.component`    | Smart (feature root) | Orchestrates the feature, injects local service, wires sub-components |
| `<sub-component-a>.component` | Presentational       | Displays X data, emits Y events                                       |
| `<feature-name>.service`      | Local service        | Manages feature state, business logic, coordinates API calls          |
| `<resource>-api.service`      | Global API service   | HTTP operations for resource                                          |
| `<name>.guard`                | Guard                | Controls route access based on condition                              |
| `<name>.interceptor`          | Interceptor          | Transforms HTTP requests/responses                                    |
| `<name>.resolver`             | Resolver             | Pre-fetches data before route activation                              |
| `<name>.directive`            | Directive            | Adds behavior to DOM elements                                         |
| `<name>.pipe`                 | Pipe                 | Stateless data transformation for templates                           |
| ...                           | ...                  | ...                                                                   |

### Step 8: Note Decisions and Trade-offs

Explicitly call out:

- Elements that could be shared later but should start local (feature-scoped)
- Any assumptions made about API shape or data flow
- Complexity areas that may need further breakdown
- Dependencies between planned elements
- Recommended order of implementation (typically: models → API services → local services → guards/interceptors → presentational components → smart/feature components)
- Existing elements identified as reusable or extendable (from Step 2)

## Output Checklist

Before presenting the result, verify:

- [ ] Existing codebase was searched and reuse/extension decisions are documented
- [ ] Behavior is defined with acceptance criteria before structural planning began
- [ ] All blocking questions were asked and answered before proceeding
- [ ] Every element has a clear type classification and placement rationale
- [ ] Components (if any) have smart/presentational classification
- [ ] No feature-to-feature dependencies exist
- [ ] API access is only through API services, never from components directly
- [ ] Shared elements are only proposed when cross-feature reuse is confirmed
- [ ] Structure follows angular-developer minimal element structure (each element has `.ts`, `.spec.ts`, `index.ts`)
- [ ] All local imports use relative paths, all external imports use absolute paths
- [ ] Guards, interceptors, and resolvers are placed in the correct scope (feature-local vs core/shared)
