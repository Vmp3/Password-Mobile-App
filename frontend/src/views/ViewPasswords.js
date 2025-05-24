import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import PasswordCard from '../components/PasswordCard';

const ViewPasswords = ({ navigation }) => {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      const savedPasswords = await AsyncStorage.getItem('Senhas');
      if (savedPasswords) {
        setPasswords(JSON.parse(savedPasswords));
      }
    } catch (error) {
      console.error('Erro ao carregar senhas:', error);
    }
  };

  const handleClearPasswords = async () => {
    try {
      await AsyncStorage.removeItem('Senhas');
      setPasswords([]);
    } catch (error) {
      console.error('Erro ao limpar senhas:', error);
    }
  };

  const handleBack = () => {
    navigation.replace('PasswordGenerator');
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Senhas Geradas"
        onBack={handleBack}
        onRightPress={handleClearPasswords}
        rightIcon="trash-outline"
        rightIconColor="#FF3B30"
        showBackButton={true}
      />

      <ScrollView style={styles.scrollView}>
        {passwords.map((password, index) => (
          <PasswordCard 
            key={index}
            number={index + 1}
            password={password}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
});

export default ViewPasswords; 