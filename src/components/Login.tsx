import React, {useState} from "react";
import styled from "styled-components/native";
import { Text } from "react-native";

const Container = styled.View`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
`

const Input = styled.TextInput`
    width: 100%;
    height: 30px;
    border: 1px solid black;
    padding: 5px;
    border-radius: 5px;
    background-color: white;
    color: black;
    font-size: 16px;
`

const Button = styled.TouchableOpacity`
`

export interface ILogin {
    onSubmit: (email: string, password: string) => void;
    goToRegister: () => void;
}

const Login: React.FC<ILogin> = ({ onSubmit, goToRegister }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onSubmit(email, password);
    }

    return (
        <Container>
            <Input keyboardType="email-address" placeholder="Email" onChangeText={setEmail} autoCapitalize="none"/>
            <Input secureTextEntry={true} placeholder="Password" onChangeText={setPassword}/>
            <Button onPress={handleSubmit}>
                <Text>Submit</Text>
            </Button>
            <Button onPress={goToRegister}>
                <Text>Register</Text>
            </Button>
        </Container>
    )
}

export default Login;