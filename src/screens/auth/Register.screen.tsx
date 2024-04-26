import { register } from "../../api"
import Register from "../../components/Register"

const RegisterScreen = () => {
    return <Register onSubmit={register} />
}

export default RegisterScreen