import React, { createContext, useContext } from "react";
import { login, register } from "../api";

interface IAuthContext {
    token: string;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>(
    {
        token: '',
        login: async () => {},
        register: async () => {}
    }
)

export const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    
    const [token, setToken] = React.useState<string>('');

    const handleLogin = async (email: string, password: string) => {
        try{
            const result = await login(email, password);
            console.log('login: ', result);
            setToken(result);
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
        }
        catch(error) {
            console.log(error);
        }
    }
    
    return (
        <AuthContext.Provider value={
            {
                token,
                login: handleLogin,
                register: handleRegister
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);