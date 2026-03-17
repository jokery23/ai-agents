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
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, CreateUserRequest } from './users-api.model';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/users';

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
export * from './users-api.service';
export * from './users-api.model';
