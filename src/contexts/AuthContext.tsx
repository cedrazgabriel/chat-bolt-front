import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, LoginCredentials, RegisterCredentials, AuthContextType } from '@/types/auth';
import { apiService } from '@/services/api';

// Estado do contexto
interface AuthState {
  user: User | null;
  isLoading: boolean;
}

// Ações do reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_USER_TOKEN'; payload: string }
  | { type: 'LOGOUT' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false };
    case 'SET_USER_TOKEN':
      return { ...state, isLoading: false };
    case 'LOGOUT':
      return { user: null, isLoading: false };
    default:
      return state;
  }
};

// Estado inicial
const initialState: AuthState = {
  user: null,
  isLoading: true,
};

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  // Query para verificar autenticação
  const { isLoading: isCheckingAuth } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiService.checkAuth(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: false, // Desabilita a execução automática
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => apiService.login(credentials),
    onSuccess: async (data) => {
      // Após o login bem-sucedido, sempre chama checkAuth para obter o perfil completo
      try {
        const userData = await apiService.checkAuth();
        dispatch({ type: 'SET_USER', payload: userData });
        queryClient.setQueryData(['auth', 'me'], userData);
      } catch (error) {
        console.error('Failed to fetch user profile after login:', error);
        // Se falhar ao buscar o perfil, ainda assim considera o login válido se temos um token
        if (data.accessToken) {
          dispatch({ type: 'SET_USER_TOKEN', payload: data.accessToken });
        }
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
      throw error;
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => apiService.register(credentials),
    onSuccess: async (data) => {
      // Após o registro bem-sucedido, sempre chama checkAuth para obter o perfil completo
      try {
        const userData = await apiService.checkAuth();
        dispatch({ type: 'SET_USER', payload: userData });
        queryClient.setQueryData(['auth', 'me'], userData);
      } catch (error) {
        console.error('Failed to fetch user profile after register:', error);
        // Se falhar ao buscar o perfil, ainda assim considera o registro válido se temos um token
        if (data.accessToken) {
          dispatch({ type: 'SET_USER_TOKEN', payload: data.accessToken });
        }
      }
    },
    onError: (error) => {
      console.error('Register failed:', error);
      throw error;
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      dispatch({ type: 'LOGOUT' });
      queryClient.clear();
    },
  });

  // Efeito para verificar autenticação na inicialização
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await apiService.checkAuth();
        dispatch({ type: 'SET_USER', payload: userData });
      } catch {
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    initAuth();
  }, []);

  // Funções do contexto
  const login = async (credentials: LoginCredentials): Promise<void> => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    await registerMutation.mutateAsync(credentials);
  };

  const logout = (): void => {
    logoutMutation.mutate();
  };

  const checkAuth = async (): Promise<void> => {
    try {
      const userData = await apiService.checkAuth();
      dispatch({ type: 'SET_USER', payload: userData });
      queryClient.setQueryData(['auth', 'me'], userData);
    } catch (error) {
      dispatch({ type: 'SET_USER', payload: null });
      console.error('Check auth failed:', error);
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isLoading: state.isLoading || isCheckingAuth,
    isAuthenticated: !!state.user,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 