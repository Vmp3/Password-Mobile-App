import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from './CustomInput';

const PasswordInput = ({ 
  value, 
  onChangeText, 
  placeholder = "Senha",
  style,
  ...rest 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <CustomInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={!showPassword}
        style={[styles.input, style]}
        autoCapitalize="none"
        {...rest}
      />
      <TouchableOpacity 
        onPress={togglePasswordVisibility}
        style={styles.visibilityButton}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
          size={22} 
          color="#666"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    paddingRight: 50,
    width: '100%',
    marginBottom: 0,
  },
  visibilityButton: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
});

export default PasswordInput; 