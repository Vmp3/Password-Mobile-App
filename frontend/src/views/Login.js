import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'default' });
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn()) {
      navigation.replace('PasswordGenerator');
    }
  }, [isLoggedIn, navigation]);

  const showToast = (message, type = 'default') => {
    setToast({ visible: false, message: '', type: 'default' });
    setTimeout(() => {
      setToast({ visible: true, message, type });
    }, 0);
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'default' });
  };

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      showToast('Por favor, informe seu email', 'error');
      return;
    }

    if (!password.trim()) {
      showToast('Por favor, informe sua senha', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        showToast('Login realizado com sucesso!', 'success');
        setTimeout(() => {
          navigation.replace('PasswordGenerator');
        }, 1000);
      } else {
        showToast('Email ou senha incorretos', 'error');
      }
    } catch (error) {
      showToast('Erro de conexão. Verifique sua internet.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Login"
        showBackButton={false}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Entrar na sua conta</Text>
        
        <CustomInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          style={styles.input}
          editable={!isLoading}
        />

        <Button 
          title={isLoading ? "ENTRANDO..." : "ENTRAR"} 
          onPress={handleLogin}
          disabled={isLoading || !isFormValid()}
        />
        
        <TouchableOpacity 
          style={[styles.registerButton, isLoading && styles.disabled]}
          onPress={() => !isLoading && navigation.navigate('Register')}
          disabled={isLoading}
        >
          <Text style={styles.registerText}>
            Não possui conta? <Text style={styles.registerHighlight}>Criar agora</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Toast 
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
  },
  registerButton: {
    marginTop: 20,
    padding: 10,
  },
  registerText: {
    color: '#333',
    fontSize: 16,
  },
  registerHighlight: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Login; 