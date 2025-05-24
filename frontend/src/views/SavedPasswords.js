import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Clipboard, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Toast from '../components/Toast';
import * as itemService from '../service/item/itemService';
import { useFocusEffect } from '@react-navigation/native';

const SavedPasswords = ({ navigation }) => {
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSavedPasswords();
    }, [])
  );

  const loadSavedPasswords = async () => {
    setIsLoading(true);
    try {
      const result = await itemService.getItems();
      
      if (result.success) {
        setSavedPasswords(result.data);
      } else {
        showToast(result.message || 'Erro ao carregar senhas');
      }
    } catch (error) {
      console.error('Erro ao carregar senhas salvas:', error);
      showToast('Erro de conexão. Verifique sua internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedPasswords();
    setRefreshing(false);
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

  const handleDeletePassword = (item) => {
    Alert.alert(
      'Excluir Senha',
      `Tem certeza que deseja excluir a senha "${item.nome}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const result = await itemService.deleteItem(item.id);
              
              if (result.success) {
                setSavedPasswords(prev => prev.filter(savedItem => savedItem.id !== item.id));
                showToast('Senha excluída com sucesso');
              } else {
                showToast(result.message || 'Erro ao excluir senha');
              }
            } catch (error) {
              console.error('Erro ao excluir senha:', error);
              showToast('Erro de conexão. Verifique sua internet.');
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
        onPress={() => handleCopyPassword(item.senha)}
        activeOpacity={0.7}
      >
        <View style={styles.passwordInfo}>
          <Text style={styles.passwordName}>{item.nome}</Text>
          <Text style={styles.passwordValue}>{item.senha}</Text>
          <Text style={styles.passwordDate}>
            {new Date(item.CreatedAt || item.createdAt || Date.now()).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeletePassword(item)}
      >
        <Ionicons name="trash-outline" size={22} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="lock-closed-outline" size={70} color="#ccc" />
      <Text style={styles.emptyText}>
        {isLoading 
          ? 'Carregando suas senhas...'
          : 'Nenhuma senha salva ainda.\nSalve suas senhas para visualizá-las aqui.'
        }
      </Text>
      {!isLoading && (
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Text style={styles.refreshButtonText}>Atualizar</Text>
        </TouchableOpacity>
      )}
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
        renderEmptyState()
      ) : (
        <FlatList
          data={savedPasswords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPasswordItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
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
    lineHeight: 22,
  },
  refreshButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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