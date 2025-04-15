import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard,
  Dimensions
} from 'react-native';
import CustomInput from './CustomInput';
import Button from './Button';

const screenWidth = Dimensions.get('window').width;

const SavePasswordModal = ({ visible, password, onSave, onCancel }) => {
  const [passwordName, setPasswordName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    if (visible) {
      setCurrentPassword(password);
      setPasswordName('');
    }
  }, [visible, password]);

  const handleSave = () => {
    if (!passwordName.trim()) {
      return;
    }
    
    onSave({
      name: passwordName,
      value: currentPassword,
      date: new Date().toISOString()
    });
    
    setPasswordName('');
  };

  const handleCancel = () => {
    setPasswordName('');
    onCancel();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Salvar Senha</Text>
            
            <CustomInput
              value={passwordName}
              onChangeText={setPasswordName}
              placeholder="Nome para a senha"
              style={styles.input}
            />
            
            <CustomInput
              value={currentPassword}
              editable={false}
              placeholder="Senha"
              style={styles.passwordInput}
              selectTextOnFocus={true}
              multiline={false}
            />
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <Button 
                title="Salvar" 
                onPress={handleSave}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: screenWidth - 32,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    width: '100%',
  },
  passwordInput: {
    marginBottom: 15,
    width: '100%',
    fontFamily: 'monospace',
    fontSize: 14,
    paddingHorizontal: 10,
    minHeight: 55,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SavePasswordModal; 