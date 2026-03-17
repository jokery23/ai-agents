// feature-logic.service.ts

import { inject, Injectable, computed } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";

import { MyResourceApiService } from "@api/my-resource";

export interface DataItem {
  id: number;
  name: string;
}

@Injectable()
export class FeatureLogicService {
  private readonly apiService = inject(MyResourceApiService);

  readonly filter = signal<string>("");
  readonly isLoading = computed(() => this.itemsResource.isLoading());
  readonly items = computed(() => this.itemsResource.value() ?? []);

  protected readonly itemsResource = rxResource<DataItem[], unknown>({
    params: () => ({ filter: this.filter() }),
    stream: ({ params }) => this.apiService.fetchItems(params.filter),
  });

  readonly hasData = computed(
    () => (this.itemsResource.value() ?? []).length > 0,
  );

  reload() {
    this.itemsResource.reload();
  }
}
