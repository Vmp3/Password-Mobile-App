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
  const [toast, setToast] = useState({ visible: false, message: '' });
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn()) {
      navigation.replace('PasswordGenerator');
    }
  }, [isLoggedIn, navigation]);

  const showToast = (message) => {
    setToast({ visible: false, message: '' });
    setTimeout(() => {
      setToast({ visible: true, message });
    }, 0);
  };

  const hideToast = () => {
    setToast({ visible: false, message: '' });
  };

  const handleBack = () => {
    navigation.navigate('PasswordGenerator');
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      showToast('Por favor, informe seu email');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Por favor, informe um email válido');
      return;
    }

    if (!password.trim()) {
      showToast('Por favor, informe sua senha');
      return;
    }

    if (password.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const success = await login(email);
    
    if (success) {
      showToast('Login realizado com sucesso!');
      setTimeout(() => {
        navigation.replace('PasswordGenerator');
      }, 1000);
    } else {
      showToast('Erro ao realizar login');
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Login"
        onBack={handleBack}
        showBackButton={true}
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
        />

        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          style={styles.input}
        />

        <Button title="ENTRAR" onPress={handleLogin} />
        
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            Não possui conta? <Text style={styles.registerHighlight}>Criar agora</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Toast 
        visible={toast.visible}
        message={toast.message}
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
});

export default Login; 