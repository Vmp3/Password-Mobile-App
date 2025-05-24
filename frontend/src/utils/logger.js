const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const SILENT_PATTERNS = [
  'Request failed with status code 401',
  'Erro ao fazer login:',
  'AxiosError',
  'Network Error'
];

const shouldSilence = (message) => {
  const messageStr = String(message);
  return SILENT_PATTERNS.some(pattern => messageStr.includes(pattern));
};

console.error = (...args) => {
  if (args.length > 0 && shouldSilence(args[0])) {
    return;
  }
  
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  if (args.length > 0 && shouldSilence(args[0])) {
    return;
  }
  
  originalConsoleWarn.apply(console, args);
};

export const restoreConsole = () => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
};

export const addSilentPattern = (pattern) => {
  SILENT_PATTERNS.push(pattern);
};

export default {
  restoreConsole,
  addSilentPattern
}; 