const environments = {
  development: {
    API_URL: 'http://localhost:8069/api',
    TIMEOUT: 10000,
  },
  // Precisa rodar no cmd o ngrok, pegar no site o token, botar no cmd e rodar o ngrok na porta 8069
  device: {
    API_URL: 'https://ungranulated-bambi-mythologically.ngrok-free.dev/api',
    TIMEOUT: 15000,
  },
  
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