import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import Button from '../components/Button';
import Toast from '../components/Toast';
import PasswordInput from '../components/PasswordInput';

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });

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
    navigation.navigate('Login');
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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

  const handleRegister = () => {
    if (!name.trim()) {
      showToast('Por favor, informe seu nome');
      return;
    }

    if (!email.trim()) {
      showToast('Por favor, informe seu email');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Por favor, informe um email válido');
      return;
    }

    if (!birthDate.trim()) {
      showToast('Por favor, informe sua data de nascimento');
      return;
    }

    if (!validateBirthDate(birthDate)) {
      showToast('Por favor, informe uma data de nascimento válida');
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

    if (password !== confirmPassword) {
      showToast('As senhas não coincidem');
      return;
    }

    showToast('Cadastro realizado com sucesso!');
    setTimeout(() => {
      navigation.navigate('Login');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Cadastro"
        onBack={handleBack}
        showBackButton={true}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Criar sua conta</Text>
        
        <CustomInput
          value={name}
          onChangeText={setName}
          placeholder="Nome"
          style={styles.input}
        />

        <CustomInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomInput
          value={birthDate}
          onChangeText={handleBirthDateChange}
          placeholder="Data de Nascimento (DD/MM/AAAA)"
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
        />

        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          style={styles.input}
        />

        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirmar senha"
          style={styles.input}
        />

        <Button title="CADASTRAR" onPress={handleRegister} />
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Já possui conta? <Text style={styles.loginHighlight}>Entrar agora</Text>
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
});

export default Register; 