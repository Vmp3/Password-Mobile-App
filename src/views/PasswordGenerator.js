import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Clipboard, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import Toast from '../components/Toast';
import SavePasswordModal from '../components/SavePasswordModal';
import { generatePassword } from '../service/passwordService';
import keyImage from '../assets/images.png';
import { useAuth } from '../context/AuthContext';

const PasswordGenerator = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();

  useEffect(() => {
    loadSavedPasswords();
  }, []);

  const loadSavedPasswords = async () => {
    try {
      const passwords = await AsyncStorage.getItem('Senhas');
      if (passwords) {
        setSavedPasswords(JSON.parse(passwords));
      }
    } catch (error) {
      console.error('Erro ao carregar senhas:', error);
      showToast('Erro ao carregar senhas');
    }
  };

  const showToast = (message) => {
    setToast({ visible: false, message: '' });
    setTimeout(() => {
      setToast({ visible: true, message });
    }, 0);
  };

  const hideToast = () => {
    setToast({ visible: false, message: '' });
  };

  const handleGenerate = async () => {
    try {
      const newPassword = generatePassword();
      setPassword(newPassword);
      
      const updatedPasswords = [...savedPasswords, newPassword];
      await AsyncStorage.setItem('Senhas', JSON.stringify(updatedPasswords));
      setSavedPasswords(updatedPasswords);
      showToast('Senha gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar/salvar senha:', error);
      showToast('Erro ao gerar senha');
    }
  };

  const handleCopy = async () => {
    if (password) {
      try {
        await Clipboard.setString(password);
        showToast('Senha copiada!');
      } catch (error) {
        console.error('Erro ao copiar senha:', error);
        showToast('Erro ao copiar senha');
      }
    }
  };

  const handleOpenSaveModal = () => {
    if (!password) {
      showToast('Gere uma senha primeiro!');
      return;
    }
    setSaveModalVisible(true);
  };

  const handleSavePassword = async (passwordData) => {
    try {
      const savedPasswordsData = await AsyncStorage.getItem('SavedPasswords');
      let savedPasswords = [];
      
      if (savedPasswordsData) {
        savedPasswords = JSON.parse(savedPasswordsData);
      }
      
      const newPasswordEntry = {
        ...passwordData,
        id: Date.now().toString(),
      };
      
      const updatedSavedPasswords = [...savedPasswords, newPasswordEntry];
      await AsyncStorage.setItem('SavedPasswords', JSON.stringify(updatedSavedPasswords));
      
      setSaveModalVisible(false);
      showToast('Senha salva com sucesso!');
      
      setPassword('');
    } catch (error) {
      console.error('Erro ao salvar senha:', error);
      showToast('Erro ao salvar senha');
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToSavedPasswords = () => {
    navigation.navigate('SavedPasswords');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            const success = await logout();
            if (success) {
              showToast('Você saiu da sua conta');
            } else {
              showToast('Erro ao sair da conta');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const getHeaderRightIcon = () => {
    if (isLoggedIn()) {
      return 'log-out-outline';
    } else {
      return 'person-circle-outline';
    }
  };

  const getHeaderRightIconColor = () => {
    if (isLoggedIn()) {
      return '#FF3B30';
    } else {
      return '#007AFF';
    }
  };

  const handleHeaderRightPress = () => {
    if (isLoggedIn()) {
      handleLogout();
    } else {
      navigateToLogin();
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title={isLoggedIn() ? `Olá, ${user?.email?.split('@')[0]}` : 'Home'}
        showBackButton={false}
        rightIcon={getHeaderRightIcon()}
        rightIconColor={getHeaderRightIconColor()}
        onRightPress={handleHeaderRightPress}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Gerador de Senhas</Text>
        
        <Image 
          source={keyImage}
          style={styles.keyImage}
          resizeMode="contain"
        />
        
        <CustomInput
          value={password}
          editable={false}
          placeholder="Sua senha aparecerá aqui"
          style={styles.passwordInput}
        />

        <Button title="Gerar Senha" onPress={handleGenerate} />
        
        <Button 
          title="Minhas Senhas" 
          onPress={navigateToSavedPasswords}
          style={styles.actionButton}
        />
        
        <Button 
          title="Salvar Senha" 
          onPress={handleOpenSaveModal}
          style={password ? styles.actionButton : [styles.actionButton, styles.disabledButton]}
          disabled={!password}
        />

        <Button 
          title="Copiar Senha" 
          onPress={handleCopy}
          style={password ? styles.actionButton : [styles.actionButton, styles.disabledButton]}
          disabled={!password}
        />

        <TouchableOpacity 
          style={styles.savedPasswordsButton}
          onPress={() => navigation.navigate('ViewPasswords')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.savedPasswordsText}>Ver histórico de geração</Text>
        </TouchableOpacity>
      </View>

      <SavePasswordModal 
        visible={saveModalVisible}
        password={password}
        onSave={handleSavePassword}
        onCancel={() => setSaveModalVisible(false)}
      />

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
    ...Platform.select({
      android: {
        paddingTop: 0,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  keyImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  passwordInput: {
    fontSize: 14,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    width: '90%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  savedPasswordsButton: {
    marginTop: 20,
    padding: 10,
  },
  savedPasswordsText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default PasswordGenerator; 