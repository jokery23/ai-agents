```typescript
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator/vitest";
import { DataService } from "./data.service";

describe("DataService API", () => {
  let spectator: SpectatorHttp<DataService>;
  const createHttp = createHttpFactory(DataService);

  beforeEach(() => (spectator = createHttp()));

  describe("fetchData()", () => {
    it("should map the response correctly", () => {
      spectator.service.fetchData().subscribe((data) => {
        expect(data).toEqual({ id: 1, name: "Test" });
      });

      const req = spectator.expectOne("/api/data", HttpMethod.GET);
      req.flush({ id: 1, name: "Test" }); // Mock the server response
    });
  });
});
```
