const environments = {
  // Para desenvolvimento local no emulador
  development: {
    API_URL: 'http://localhost:8069/api',
    TIMEOUT: 10000,
  },
  
  // Para dispositivos físicos com ngrok - CORRIGIDO
  device: {
    API_URL: 'https://fountained-latosha-presumptive.ngrok-free.dev/api',
    TIMEOUT: 15000,
  },
  
  // Para produção (quando fizer deploy)
  production: {
    API_URL: 'https://api.seudominio.com/api',
    TIMEOUT: 15000,
  },
};

const getEnvironment = () => {
  if (!__DEV__) {
    return environments.production;
  }
  
  // Opcional: você pode adicionar lógica para detectar emulador vs dispositivo físico
  return environments.device;
};

const config = getEnvironment();

export default config;