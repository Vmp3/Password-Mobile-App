import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const Toast = ({ message, visible, onHide, type = 'default' }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (visible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      opacity.setValue(1);

      timeoutRef.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, message]);

  const getToastStyle = () => {
    switch (type) {
      case 'error':
        return {
          backgroundColor: '#dc3545',
          color: 'white',
        };
      case 'success':
        return {
          backgroundColor: '#28a745',
          color: 'white',
        };
      default:
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
        };
    }
  };

  if (!visible) return null;

  const toastStyle = getToastStyle();

  return (
    <Animated.View style={[styles.container, { backgroundColor: toastStyle.backgroundColor, opacity }]}>
      <Text style={[styles.text, { color: toastStyle.color }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Toast; 