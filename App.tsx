import 'react-native-gesture-handler';
import React from 'react';
import Login from './src/components/Login';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login, register } from './src/api';
import Router from './src/router';

export default function App() {
  return (
    <Router />
  );
}