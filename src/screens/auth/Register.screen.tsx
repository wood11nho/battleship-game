import { register } from "../../api"
import Register from "../../components/Register"
import { useAuth } from "../../hooks/authContext"
import { useNavigation } from "@react-navigation/native"
import { AuthRouteNames } from "../../router/route-names"

const RegisterScreen = () => {
    const auth = useAuth()
    const navigation = useNavigation<any>()

    const handleRegister = async (email: string, password: string) => {
        try {
            const result = await auth.register(email, password);
            if (result.email && result.id) { // Check for properties that indicate success
                navigation.navigate(AuthRouteNames.LOGIN);
            } else {
                console.error(result.message); // Log the error message from the server
            }
        } catch (error) {
            console.error(error);
        }
    }

    return <Register onSubmit={handleRegister} />
}

export default RegisterScreen