import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../service/auth/authService';
import { setCustomBaseURL } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const customIP = await AsyncStorage.getItem('customAPIIP');
        if (customIP) {
          const customBaseURL = `http://${customIP}:8080/api`;
          setCustomBaseURL(customBaseURL);
        }

        const token = await AsyncStorage.getItem('authToken');
        const userData = await AsyncStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.signIn(email, password);
      
      if (response.token) {
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user || { email }));
        setUser(response.user || { email });
        return { success: true };
      } else {
        return { success: false, error: 'Token não recebido' };
      }
    } catch (error) {
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        return { 
          success: false, 
          error: 'Erro de conexão. Verifique se o backend está rodando e se o IP está correto.' 
        };
      }
      
      if (error.response?.status === 401) {
        return { 
          success: false, 
          error: 'Email ou senha incorretos' 
        };
      }
      
      if (error.response?.data?.error) {
        return { 
          success: false, 
          error: error.response.data.error 
        };
      }
      
      return { 
        success: false, 
        error: 'Erro ao fazer login' 
      };
    }
  };

  const register = async (nome, email, dataNascimento, senha, confirmPassword) => {
    try {
      const response = await authService.signUp(nome, email, dataNascimento, senha, confirmPassword);
      return { success: true, message: 'Usuário criado com sucesso' };
    } catch (error) {
        
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        return { 
          success: false, 
          error: 'Erro de conexão. Verifique se o backend está rodando e se o IP está correto.' 
        };
      }
      
      if (error.response?.data?.error) {
        return { 
          success: false, 
          error: error.response.data.error 
        };
      }
      
      return { 
        success: false, 
        error: 'Erro ao criar conta' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
    } finally {
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        setUser(null);
        return true;
      } catch (error) {
        setUser(null);
        return false;
      }
    }
  };

  const isLoggedIn = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      isLoggedIn, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 