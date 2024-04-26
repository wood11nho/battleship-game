import 'react-native-gesture-handler';
import React from 'react';
import Login from './src/components/Login';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login, register } from './src/api';
import Router from './src/router';
import { AuthContextProvider } from './src/hooks/authContext';

export default function App() {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
}