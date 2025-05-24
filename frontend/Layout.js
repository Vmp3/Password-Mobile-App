import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PasswordGenerator from './src/views/PasswordGenerator';
import ViewPasswords from './src/views/ViewPasswords';
import Login from './src/views/Login';
import Register from './src/views/Register';
import SavedPasswords from './src/views/SavedPasswords';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import './src/utils/logger';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isLoggedIn() ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : (
        <>
          <Stack.Screen name="PasswordGenerator" component={PasswordGenerator} />
          <Stack.Screen name="ViewPasswords" component={ViewPasswords} />
          <Stack.Screen name="SavedPasswords" component={SavedPasswords} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function Layout() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
