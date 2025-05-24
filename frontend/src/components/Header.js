import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ title, onBack, onRightPress, rightIcon, rightIconColor, showBackButton = false }) => {
  const handleBackPress = () => {
    if (onBack) {
      onBack();
    }
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  
  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={showBackButton ? handleBackPress : null}
            activeOpacity={showBackButton ? 0.7 : 1}
            disabled={!showBackButton}
          >
            {showBackButton ? (
              <Ionicons name="arrow-back" size={24} color="#333" />
            ) : (
              <View style={styles.placeholder} />
            )}
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={rightIcon ? onRightPress : null}
            activeOpacity={rightIcon ? 0.7 : 1}
            disabled={!rightIcon}
          >
            {rightIcon ? (
              <Ionicons name={rightIcon} size={24} color={rightIconColor || "#333"} />
            ) : (
              <View style={styles.placeholder} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),
  },
  safeArea: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
});

export default Header; 