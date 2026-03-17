```typescript
import {
  createServiceFactory,
  SpectatorService,
} from "@ngneat/spectator/vitest";
import { AuthService } from "./auth.service";
import { TokenStorageService } from "./token-storage.service";

describe("AuthService", () => {
  let spectator: SpectatorService<AuthService>;
  const createService = createServiceFactory({
    service: AuthService,
    mocks: [TokenStorageService], // Automatically creates spies for all methods
  });

  beforeEach(() => (spectator = createService()));

  describe("login()", () => {
    it("should save token on successful login", () => {
      const storageMock = spectator.inject(TokenStorageService);

      spectator.service.login("token123");

      expect(storageMock.saveToken).toHaveBeenCalledWith("token123");
    });
  });
});
```
