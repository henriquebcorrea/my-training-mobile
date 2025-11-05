const config = {
  development: {
    API_URL: 'http://localhost:8069/api',
    TIMEOUT: 10000,
  },
  device: {
    API_URL: 'http://10.1.140.41:8069/api', 
    TIMEOUT: 15000,
  },
};

const getConfig = () => {
  if (__DEV__) {
    return config.device;
  }
  return config.production;
};

export default getConfig();

