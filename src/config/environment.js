
const environments = {
  // Para desenvolvimento local no emulador
  development: {
    API_URL: 'http://localhost:8069/api',
    TIMEOUT: 10000,
  },
  
  // Para dispositivos físicos com ngrok
  device: {
    API_URL: 'https://ungranulated-bambi-mythologically.ngrok-free.dev/api',
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
  
  
  return environments.device;
};

const config = getEnvironment();

export default config;