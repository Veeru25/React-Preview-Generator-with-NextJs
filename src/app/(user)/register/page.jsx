// import { auth } from "@/app/auth";
import RegisterPage from "@/app/components/RegisterForm";
// import { redirect } from "next/navigation";

const Login = async () => {
    // const session = await auth()
    // if(session){
    //     redirect('/')
    // }
    return (
        <RegisterPage/>
    );
}  

export default Login;