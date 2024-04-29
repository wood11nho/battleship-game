import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import authRoutes from './auth.router';
import { useAuth } from '../hooks/authContext';
import gameRoutes from './game.router';

import { ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Router: React.FC = () => {
    const auth = useAuth()

    if (auth.isLoading){
        return (
            
            <SafeAreaView style={
                {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                }}>
                <Text style={{
                    marginBottom: 10,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#000',
                }}>Loading...</Text>
                <ActivityIndicator size="large" color="#0000ff" />
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            </SafeAreaView>
        )
    }

    return (
        <NavigationContainer>
            {auth.token ? gameRoutes : authRoutes}
        </NavigationContainer>
    )
}

export default Router;