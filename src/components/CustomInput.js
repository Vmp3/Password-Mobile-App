import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ value, onChangeText, placeholder, editable = true, style, secureTextEntry, ...rest }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#666"
      editable={editable}
      secureTextEntry={secureTextEntry}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '90%',
    height: 55,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default CustomInput; 