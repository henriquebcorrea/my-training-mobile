// Configuração de ambiente para diferentes plataformas
const config = {
  development: {
    API_URL: 'http://localhost:8069/api',
    TIMEOUT: 10000,
  },
  production: {
    API_URL: 'https://your-production-domain.com/api',
    TIMEOUT: 15000,
  },
  // Para Android Emulator
  android: {
    API_URL: 'http://10.0.2.2:8069/api',
    TIMEOUT: 10000,
  },
  // Para iOS Simulator
  ios: {
    API_URL: 'http://localhost:8069/api',
    TIMEOUT: 10000,
  },
  // Para dispositivo físico (substitua pelo IP da sua máquina)
  device: {
    API_URL: 'http://10.1.141.89:8069/api', // IP da sua máquina
    TIMEOUT: 10000,
  },
};

// Detecta a plataforma automaticamente
const getConfig = () => {
  if (__DEV__) {
    // Em desenvolvimento, você pode escolher qual configuração usar
    // Para Android Emulator use: return config.android;
    // Para iOS Simulator use: return config.ios;
    // Para dispositivo físico use: return config.device;
    // Para teste local use: return config.development;
    return config.device;
  }
  return config.production;
};

export default getConfig();

