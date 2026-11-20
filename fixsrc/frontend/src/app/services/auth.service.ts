import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  token: string;
}

export interface AdminSession {
  ok: boolean;
  id: number;
  nombre: string;
  rol: string;
}

const API_URL = 'http://localhost:8080/api/auth';
const STORAGE_KEY = 'figureverse_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);

  readonly user = signal<AuthUser | null>(this.load());

  isLoggedIn(): boolean {
    return this.user() !== null && !!this.token();
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && this.user()?.rol === 'ADMIN';
  }

  token(): string | null {
    return this.user()?.token || null;
  }

  async verifySession(): Promise<boolean> {
    if (!this.isAdmin()) {
    return false;
    }

    try {
      const session = await firstValueFrom(
        this.http.get<AdminSession>(
          'http://localhost:8080/api/admin/session'
        )
      );

      const currentUser = this.user();

    return (
      session.ok === true &&
      session.rol === 'ADMIN' &&
      session.id === currentUser?.id
    );
    } catch {
    return false;
    }
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const user = await this.post<AuthUser>('/login', { email, password });
    this.save(user);
    return user;
  }

  async register(
    nombre: string,
    email: string,
    password: string
  ): Promise<AuthUser> {
    const user = await this.post<AuthUser>('/register', {
      nombre,
      email,
      password
    });

    this.save(user);
    return user;
  }

  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Si localStorage no está disponible, se limpia la memoria.
    }

    this.user.set(null);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    let res: Response;

    try {
      res = await fetch(API_URL + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    } catch {
      throw new Error('No se pudo conectar con el servidor.');
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.mensaje ?? 'Ocurrió un error. Intenta de nuevo.'
      );
    }

    return data as T;
  }

  private load(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const user = JSON.parse(raw) as AuthUser;

      // Evita reutilizar sesiones antiguas que no tienen token.
      return user && typeof user.token === 'string' && user.token
        ? user
        : null;
    } catch {
      return null;
    }
  }

  private save(user: AuthUser): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // La sesión permanece en memoria.
    }

    this.user.set(user);
  }
}
