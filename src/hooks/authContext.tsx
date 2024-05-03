import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserDetails, login, register } from "../api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { decode as atob } from "base-64";

interface IAuthContext {
    token: string;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    email: string;
    id: string;
}

export const AuthContext = createContext<IAuthContext>(
    {
        token: '',
        login: async () => {},
        register: async () => {},
        logout: async () => {},
        isLoading: false,
        email: '',
        id: ''
    }
)

export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    
    const [token, setToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');

    const isTokenEpired = (token: string): boolean => {
        if(!token) return true;
        const [, payload] = token.split('.');
        const data = JSON.parse(atob(payload));
        return data.exp * 1000 < Date.now();
    }

    useEffect(() => {
        setIsLoading(true);
        AsyncStorage.getItem('token').then(value => {
            if (value){
                if (isTokenEpired(value)){
                    AsyncStorage.removeItem('token');
                    value = '';
                } else {
                    setToken(value);
                    getUserDetails(value).then((user) => {
                        console.log("user email: ", user.user.email);
                        setEmail(user.user.email);
                        setId(user.user.id);
                    });
                }
            }
        }).finally(() => setIsLoading(false));
    }, []);

    const handleLogin = async (email: string, password: string) => {
        try{
            const result = await login(email, password);
            console.log('login: ', result);
            AsyncStorage.setItem('token', result);
            setToken(result);

            getUserDetails(result).then((user) => {
                setEmail(user.user.email);
                setId(user.user.id);
            }
            );
        }
        catch(error) {
            console.log(error);
        }
    }

    const handleRegister = async (email: string, password: string) => {
        try{
            const result = await register(email, password);
            console.log(result);
            setToken(result);
            AsyncStorage.setItem('token', result);
            getUserDetails(result).then((user) => {
                setEmail(user.user.email);
                setId(user.user.id);
            });
        }
        catch(error) {
            console.log(error);
        }
    }

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setToken('');
        Alert.alert('Logout', 'You have been logged out');
    }
    
    return (
        <AuthContext.Provider value={
            {
                token,
                login: handleLogin,
                register: handleRegister,
                logout: handleLogout,
                isLoading,
                email,
                id
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);