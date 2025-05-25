import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth';
import { config } from '@/config/env';

// Configure aqui a URL da sua API
const API_BASE_URL = config.API_URL;

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Inclui cookies automaticamente
      headers: {
        'Content-Type': 'application/json',
        // Adiciona headers específicos para evitar conflitos
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        ...options.headers,
      },
    };

    try {
      // Log para debug - remover em produção
      if (import.meta.env.DEV) {
        console.log('API Request:', {
          url,
          method: config.method || 'GET',
          headers: config.headers,
        });
      }

      const response = await fetch(url, config);
      
      // Log da resposta para debug
      if (import.meta.env.DEV) {
        console.log('API Response:', {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async checkAuth(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
  }

  // Método para limpar cookies específicos (se necessário)
  clearAuthCookies(): void {
    // Remove cookies específicos do domínio atual
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      // Remove apenas cookies que não são do nosso sistema
      if (name.includes('BLP') || name.includes('accessToken')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  }
}

export const apiService = new ApiService(API_BASE_URL); 