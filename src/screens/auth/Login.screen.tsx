import { useNavigation } from "@react-navigation/native"
import { login } from "../../api"
import Login from "../../components/Login"
import { AuthRouteNames } from "../../router/route-names"

const LoginScreen = () => {
    const navigation = useNavigation<any>()
    const handleGoToRegister = () => {
        navigation.navigate(AuthRouteNames.REGISTER)
    }
    return <Login onSubmit={login} goToRegister={handleGoToRegister} />
}

export default LoginScreen