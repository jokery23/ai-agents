// user-list-logic.service.ts
import { inject, Injectable, signal, computed } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { UsersApiService } from "@api/users";

@Injectable() // NOT providedIn: 'root'
export class UserListLogicService {
  private readonly usersApi = inject(UsersApiService);

  readonly searchTerm = signal("");

  // Use rxResource for modern data fetching linked to parameters
  private readonly usersResource = rxResource({
    params: () => ({ search: this.searchTerm() }),
    loader: ({ params }) => this.usersApi.getUsers(), // In a real app, this would use the search param
  });

  readonly users = computed(() => this.usersResource.value() ?? []);
  readonly isLoading = this.usersResource.isLoading;
}

// user-list.component.ts
import { Component, inject } from "@angular/core";
import { UserListLogicService } from "./user-list-logic.service";

@Component({
  selector: "app-user-list",
  template: `
    <input (input)="onSearch($event)" placeholder="Search users..." />

    @if (logic.isLoading()) {
      <p>Loading...</p>
    } @else {
      <ul>
        @for (user of logic.users(); track user.id) {
          <li>{{ user.name }} ({{ user.email }})</li>
        }
      </ul>
    }
  `,
  providers: [UserListLogicService], // Local provider!
})
export class UserListComponent {
  protected readonly userListLogic = inject(UserListLogicService);

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.userListLogic.searchTerm(term);
  }
}
