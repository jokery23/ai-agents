```typescript
import { inject, Injectable, resource, computed } from "@angular/core";
import { MyApiService } from "@api";

export interface DataItem {
  id: number;
  name: string;
}

/**
 * Example of a Local Feature Service using the Resource API.
 * Note: No 'providedIn: root'. This service is scoped to the component.
 */
@Injectable()
export class FeatureService {
  private readonly api = inject(MyApiService);

  readonly isLoading = computed(() => this.itemsResource.isLoading());
  readonly items = computed(() => this.itemsResource.value() ?? []);

  /**
   * Use resource() for automated data fetching and state management.
   * It provides value(), isLoading(), status(), and reload() out of the box.
   */
  readonly itemsResource = resource<DataItem[], unknown>({
    loader: () => (this.api as any).fetchItems(),
  });

  // Derived State using Computed
  readonly hasData = computed(
    () => (this.itemsResource.value() ?? []).length > 0,
  );

  /**
   * Explicit reload if needed.
   * resource() automatically fetches on initialization.
   */
  reload() {
    this.itemsResource.reload();
  }
}
```
