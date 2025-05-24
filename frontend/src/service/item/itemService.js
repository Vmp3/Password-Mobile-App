import * as itemResource from './itemResource';

export const createItem = async (nome, senha) => {
  try {
    const data = {
      nome: nome.trim(),
      senha: senha.trim()
    };

    const response = await itemResource.createItem(data);
    return { success: true, data: response };
  } catch (error) {
    let message = 'Erro inesperado';
    
    if (error.response?.status === 400 && error.response?.data?.error) {
      const serverError = error.response.data.error;
      
      if (serverError.includes('já existe um item com este nome')) {
        message = 'Já existe uma senha com esse nome';
      } else if (serverError.includes('nome') && serverError.includes('obrigatório')) {
        message = 'Nome é obrigatório';
      } else if (serverError.includes('senha') && serverError.includes('obrigatório')) {
        message = 'Senha é obrigatória';
      } else {
        message = serverError;
      }
    } else if (error.response?.status === 401) {
      message = 'Sessão expirada. Faça login novamente';
    } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      message = 'Erro de conexão. Verifique sua internet';
    }
    
    return { success: false, message };
  }
};

export const getItems = async () => {
  try {
    const response = await itemResource.getItems();
    return { success: true, data: response };
  } catch (error) {
    if (error.response?.status === 204) {
      return { success: true, data: [] };
    }
    
    let message = 'Erro inesperado';
    
    if (error.response?.status === 401) {
      message = 'Sessão expirada. Faça login novamente';
    } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      message = 'Erro de conexão. Verifique sua internet';
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    }
    
    return { success: false, message };
  }
};

export const deleteItem = async (id) => {
  try {
    await itemResource.deleteItem(id);
    return { success: true };
  } catch (error) {
    let message = 'Erro inesperado';
    
    if (error.response?.status === 403) {
      message = 'Você não tem acesso a este item';
    } else if (error.response?.status === 401) {
      message = 'Sessão expirada. Faça login novamente';
    } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      message = 'Erro de conexão. Verifique sua internet';
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    }
    
    return { success: false, message };
  }
}; 