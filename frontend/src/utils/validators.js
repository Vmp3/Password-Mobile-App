
export const validateEmail = (email) => {
  email = email.trim();
  
  if (!email) return false;
  
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!regex.test(email)) return false;
  
  if (email.length > 254) return false;
  if (email.startsWith('.') || email.endsWith('.')) return false;
  if (email.startsWith('@') || email.endsWith('@')) return false;
  if (email.includes('..')) return false;
  
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  if (!parts[1].includes('.')) return false;
  
  return true;
};

export const validatePassword = (password) => {
  const trimmed = password.trim();
  
  if (!trimmed) {
    return { isValid: false, message: 'Senha é obrigatória' };
  }
  
  if (trimmed.length < 6) {
    return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
  }
  
  return { isValid: true, message: '' };
};

export const validateName = (name) => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { isValid: false, message: 'Nome é obrigatório' };
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
  }
  
  return { isValid: true, message: '' };
}; 