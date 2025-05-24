import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Button as RNButton } from 'react-native';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import Button from '../components/Button';
import Toast from '../components/Toast';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateName } from '../utils/validators';

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'default' });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

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
    return (
      name.trim() !== '' &&
      email.trim() !== '' &&
      birthDate.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== ''
    );
  };

  const formatBirthDate = (text) => {
    const numbers = text.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleBirthDateChange = (text) => {
    const formatted = formatBirthDate(text);
    setBirthDate(formatted);
  };

  const validateBirthDate = (date) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      return false;
    }

    const [day, month, year] = date.split('/').map(part => parseInt(part, 10));
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;
    
    if (month === 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      if (day > (isLeapYear ? 29 : 28)) return false;
    }
    
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);
    if (inputDate > currentDate) return false;
    
    return true;
  };

  const handleRegister = async () => {
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      showToast(nameValidation.message, 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Por favor, informe um email válido', 'error');
      return;
    }

    if (!birthDate.trim()) {
      showToast('Por favor, informe sua data de nascimento', 'error');
      return;
    }

    if (!validateBirthDate(birthDate)) {
      showToast('Por favor, informe uma data de nascimento válida', 'error');
      return;
    }

    const [day, month, year] = birthDate.split('/');
    const birthDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (birthDateObj >= today) {
      showToast('A data de nascimento deve ser anterior ao dia de hoje', 'error');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      showToast(passwordValidation.message, 'error');
      return;
    }

    if (!confirmPassword.trim()) {
      showToast('Por favor, confirme sua senha', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(name.trim(), email.trim(), birthDate, password, confirmPassword);
      
      if (result.success) {
        showToast('Cadastro realizado com sucesso!', 'success');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        let errorMessage = result.error || 'Erro ao criar conta';
        
        if (errorMessage.includes('já cadastrado') || errorMessage.includes('já existe')) {
          errorMessage = 'Este email já está cadastrado. Use outro email ou faça login.';
        } else if (errorMessage.includes('email inválido') || errorMessage.includes('formato de email inválido')) {
          errorMessage = 'Por favor, informe um email válido.';
        } else if (errorMessage.includes('senhas não coincidem')) {
          errorMessage = 'As senhas informadas não coincidem.';
        } else if (!errorMessage.includes('conexão') && !errorMessage.includes('backend')) {
          errorMessage = 'Erro ao criar conta. Tente novamente.';
        }
        
        showToast(errorMessage, 'error');
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
        title="Cadastro"
        showBackButton={false}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Criar sua conta</Text>
        
        <CustomInput
          value={name}
          onChangeText={setName}
          placeholder="Nome"
          style={styles.input}
          editable={!isLoading}
        />

        <CustomInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <CustomInput
          value={birthDate}
          onChangeText={handleBirthDateChange}
          placeholder="Data de Nascimento (DD/MM/AAAA)"
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
          editable={!isLoading}
        />

        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          style={styles.input}
          editable={!isLoading}
        />

        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirmar senha"
          style={styles.input}
          editable={!isLoading}
        />

        <Button 
          title={isLoading ? "CADASTRANDO..." : "CADASTRAR"} 
          onPress={handleRegister}
          disabled={isLoading || !isFormValid()}
        />
        
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabled]}
          onPress={() => !isLoading && navigation.navigate('Login')}
          disabled={isLoading}
        >
          <Text style={styles.loginText}>
            Já possui conta? <Text style={styles.loginHighlight}>Entrar agora</Text>
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
  loginButton: {
    marginTop: 20,
    padding: 10,
  },
  loginText: {
    color: '#333',
    fontSize: 16,
  },
  loginHighlight: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Register; 