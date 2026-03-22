---
name: angular-tests
description: Instructions and best practices for writing Angular unit tests. Use this skill when you need to create or update tests. Enforces the use of @ngneat/spectator, test grouping by describe blocks, strict isolation, and robust async handling.
---

# 🧪 Skill: Angular Unit Testing

## 📝 Description

This skill defines the standard approach for writing unit tests in this Angular application. It enforces the use of `@ngneat/spectator` to reduce boilerplate, strictly organizes tests, and promotes modern testing best practices for standalone components and strict typing.

## 🛑 Core Rules & Restrictions

1. **Mandatory Spectator usage**:
   - **MUST NOT** use the native Angular `TestBed` directly unless physically impossible to test otherwise.
   - Always import from `@ngneat/spectator` or `@ngneat/spectator/vitest`.
2. **Mock all external dependencies**:
   - Always mock API calls, external libraries, and unrelated complex services (using the `mocks` array in Spectator).
3. **Ensure strong isolation**:
   - Components and services must be tested in pure isolation to rule out side effects.
   - Default to using `shallow: true` in `createComponentFactory` unless integration testing is required.
4. **Never call real HTTP**:
   - Strictly prohibit real network requests. Assert requests and mock responses locally.
5. **Never spy on private methods**:
   - Test only public APIs (inputs, outputs, public methods, and DOM state). Do not test or spy on internal private methods or properties.
6. **Use strict typing (no `any`)**:
   - Ensure all mocked objects, stubs, and spy returns use exact TypeScript interfaces/types. Never fallback to `any`.
7. **Handle async deterministically**:
   - Await promises, use `fakeAsync`/`tick`, or handle observables properly. Flaky tests are unacceptable.
8. **Support standalone components**:
   - Leverage modern Angular and Spectator standalone APIs, keeping standalone component compatibility in mind when architecting tests.
9. **Strict Grouping**:
   - Conceptually group tests using `describe` blocks.
   - Group by public methods: `describe('methodName()', ...)`
   - Group by feature states: `describe('when the user is logged in', ...)`
   - Never place a large flat list of `it()` blocks at the root level.
10. **Use `createHttpFactory`**:
    - Exclusively use this factory for testing HTTP services and interceptors.
11. **Naming Convention**:
    - Spec files MUST match the name of the file they test exactly and end with `.spec.ts`.
      - Component: `login.component.ts` -> `login.component.spec.ts`
      - Service: `auth.service.ts` -> `auth.service.spec.ts`
      - Logic Service: `news-feed-logic.service.ts` -> `news-feed-logic.service.spec.ts`
      - API Service: `news-api.service.ts` -> `news-api.service.spec.ts`

## 🧱 Component Testing

Use `createComponentFactory` to test components. It simplifies input binding, output testing, and DOM querying.

- 📖 **Example**: [`./examples/testing-components.ts`](./examples/testing-components.ts)
- 🔗 **Docs**: [Spectator Component Testing](https://ngneat.github.io/spectator/docs/testing-components)

_Pro-tip: Rely on `spectator.query('.class')` or `spectator.query(ChildComponent)` rather than native `document.querySelector` or verbose `fixture.debugElement.query()`._

## 🛠️ Service Testing

Use `createServiceFactory` for generic logical services. It streamlines dependency injection and mocking.

- 📖 **Example**: [`./examples/testing-services.ts`](./examples/testing-services.ts)
- 🔗 **Docs**: [Spectator Service Testing](https://ngneat.github.io/spectator/docs/testing-services)

## 🌐 HTTP Testing

Use `createHttpFactory` for any testing involving HTTP communication. It effortlessly asserts HTTP requests and mocks responses.

- 📖 **Example**: [`./examples/testing-http.ts`](./examples/testing-http.ts)
- 🔗 **Docs**: [Spectator HTTP Testing](https://ngneat.github.io/spectator/docs/testing-with-http)

## 🎯 The "Given-When-Then" Pattern

Always structure the logic inside your `it()` blocks cleanly:

1. **Given**: Setup the initial state, configure inputs, and prepare mocks.
2. **When**: Perform the specific action (e.g., clicking a button, triggering a method).
3. **Then**: Assert the expected result, state change, or side effect.
