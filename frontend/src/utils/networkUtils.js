import { Platform } from 'react-native';

export const discoverNetworkIP = async () => {
  try {
    const commonIPs = [
      '192.168.1.',
      '192.168.0.', 
      '10.0.0.',    
      '172.16.',    
    ];

    const ranges = [
      { prefix: '192.168.1.', start: 1, end: 254 },
      { prefix: '192.168.0.', start: 1, end: 254 },
      { prefix: '10.0.0.', start: 1, end: 254 },
    ];

    const likelyIPs = [
      '192.168.1.100', '192.168.1.101', '192.168.1.102',
      '192.168.0.100', '192.168.0.101', '192.168.0.102',
      '10.0.0.100', '10.0.0.101', '10.0.0.102',
    ];

    for (const ip of likelyIPs) {
      if (await testConnection(ip)) {
        return ip;
      }
    }

    return null;
  } catch (error) {
    console.error('Erro ao descobrir IP:', error);
    return null;
  }
};

export const testConnection = async (ip, timeout = 3000) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`http://${ip}:8080/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        senha: 'test'
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    return true;
  } catch (error) {
    return false;
  }
};

export const getIPSuggestions = () => {
  if (Platform.OS === 'android') {
    return [
      { ip: '10.0.2.2', description: 'Emulador Android (padrão)' },
      { ip: '192.168.1.100', description: 'Rede Wi-Fi local (comum)' },
      { ip: '192.168.0.100', description: 'Rede Wi-Fi local (alternativa)' },
    ];
  } else if (Platform.OS === 'ios') {
    return [
      { ip: 'localhost', description: 'Simulador iOS (padrão)' },
      { ip: '192.168.1.100', description: 'Rede Wi-Fi local (comum)' },
      { ip: '192.168.0.100', description: 'Rede Wi-Fi local (alternativa)' },
    ];
  } else {
    return [
      { ip: 'localhost', description: 'Desenvolvimento web' },
      { ip: '127.0.0.1', description: 'Localhost alternativo' },
    ];
  }
};

export const isValidIP = (ip) => {
  if (ip === 'localhost') return true;
  
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;
  
  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}; 