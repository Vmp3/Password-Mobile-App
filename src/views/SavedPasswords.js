import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Toast from '../components/Toast';

const SavedPasswords = ({ navigation }) => {
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    loadSavedPasswords();
  }, []);

  const loadSavedPasswords = async () => {
    try {
      const passwords = await AsyncStorage.getItem('SavedPasswords');
      if (passwords) {
        setSavedPasswords(JSON.parse(passwords));
      }
    } catch (error) {
      console.error('Erro ao carregar senhas salvas:', error);
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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCopyPassword = async (password) => {
    try {
      await Clipboard.setString(password);
      showToast('Senha copiada!');
    } catch (error) {
      console.error('Erro ao copiar senha:', error);
      showToast('Erro ao copiar senha');
    }
  };

  const handleDeletePassword = (id) => {
    Alert.alert(
      'Excluir Senha',
      'Tem certeza que deseja excluir esta senha?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const updatedPasswords = savedPasswords.filter(item => item.id !== id);
              await AsyncStorage.setItem('SavedPasswords', JSON.stringify(updatedPasswords));
              setSavedPasswords(updatedPasswords);
              showToast('Senha excluída com sucesso');
            } catch (error) {
              console.error('Erro ao excluir senha:', error);
              showToast('Erro ao excluir senha');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderPasswordItem = ({ item }) => (
    <View style={styles.passwordItem}>
      <TouchableOpacity 
        style={styles.passwordContent}
        onPress={() => handleCopyPassword(item.value)}
        activeOpacity={0.7}
      >
        <View style={styles.passwordInfo}>
          <Text style={styles.passwordName}>{item.name}</Text>
          <Text style={styles.passwordValue}>{item.value}</Text>
          <Text style={styles.passwordDate}>
            {new Date(item.date).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeletePassword(item.id)}
      >
        <Ionicons name="trash-outline" size={22} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Senhas Salvas"
        onBack={handleBack}
        showBackButton={true}
      />
      
      {savedPasswords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={70} color="#ccc" />
          <Text style={styles.emptyText}>
            Nenhuma senha salva ainda. 
            Salve suas senhas para visualizá-las aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedPasswords}
          keyExtractor={(item) => item.id}
          renderItem={renderPasswordItem}
          contentContainerStyle={styles.listContent}
        />
      )}

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    padding: 15,
  },
  passwordItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  passwordContent: {
    flex: 1,
    padding: 15,
  },
  passwordInfo: {
    flex: 1,
  },
  passwordName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  passwordValue: {
    fontSize: 15,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  passwordDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
});

export default SavedPasswords; 