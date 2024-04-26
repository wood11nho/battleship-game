import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import authRoutes from './auth.router';

const Router: React.FC = () => {
    return (
        <NavigationContainer>
            {authRoutes}
        </NavigationContainer>
    )
}

export default Router;