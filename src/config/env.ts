// Configurações de ambiente
export const config = {
  // URL da API - você pode alterar aqui ou criar um arquivo .env
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Outras configurações
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Chat Bolt',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Configurações de desenvolvimento
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const; 