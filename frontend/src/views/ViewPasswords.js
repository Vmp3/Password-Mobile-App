import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import PasswordCard from '../components/PasswordCard';

const ViewPasswords = ({ navigation }) => {
  const [passwords, setPasswords] = useState([]);

  const loadPasswords = async () => {
    try {
      const savedPasswords = await AsyncStorage.getItem('Senhas');
      if (savedPasswords) {
        setPasswords(JSON.parse(savedPasswords));
      } else {
        setPasswords([]);
      }
    } catch (error) {
      setPasswords([]);
    }
  };

  useEffect(() => {
    loadPasswords();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadPasswords();
    }, [])
  );

  const handleClearPasswords = async () => {
    try {
      await AsyncStorage.removeItem('Senhas');
      setPasswords([]);
    } catch (error) {
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
        {passwords.map((password, index) => {
          const passwordValue = typeof password === 'object' && password !== null 
            ? password.senha || password.password || JSON.stringify(password)
            : password;
          
          return (
            <PasswordCard 
              key={index}
              number={index + 1}
              password={passwordValue}
            />
          );
        })}
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