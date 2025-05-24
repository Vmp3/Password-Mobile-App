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
    console.error('Erro ao criar item:', error);
    
    let message = 'Erro ao salvar senha';
    
    if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    
    return { success: false, message };
  }
};

export const getItems = async () => {
  try {
    const response = await itemResource.getItems();
    return { success: true, data: response };
  } catch (error) {
    console.error('Erro ao buscar items:', error);
    
    if (error.response?.status === 204) {
      return { success: true, data: [] };
    }
    
    let message = 'Erro ao carregar senhas';
    
    if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    
    return { success: false, message };
  }
};

export const deleteItem = async (id) => {
  try {
    await itemResource.deleteItem(id);
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    
    let message = 'Erro ao excluir senha';
    
    if (error.response?.status === 403) {
      message = 'Você não tem acesso a este item';
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    
    return { success: false, message };
  }
}; 