import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PasswordGenerator from './src/views/PasswordGenerator';
import ViewPasswords from './src/views/ViewPasswords';
import Login from './src/views/Login';
import Register from './src/views/Register';
import SavedPasswords from './src/views/SavedPasswords';
import { AuthProvider } from './src/context/AuthContext';
import TestApi from './src/views/testapi/TestApi';

const Stack = createNativeStackNavigator();

export default function Layout() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="PasswordGenerator"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="PasswordGenerator" component={PasswordGenerator} />
          <Stack.Screen name="ViewPasswords" component={ViewPasswords} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="SavedPasswords" component={SavedPasswords} />
          <Stack.Screen name="TestApi" component={TestApi}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
