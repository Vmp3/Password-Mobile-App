import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PasswordCard = ({ number, password }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.number}>Senha {number}</Text>
      <Text style={styles.password}>{password}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  password: {
    fontSize: 14,
    color: '#666',
  },
});

export default PasswordCard; 