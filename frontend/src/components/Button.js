import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ onPress, title, style, disabled = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled, style]} 
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  disabledText: {
    color: '#999999',
  },
});

export default Button; 