"use server"

import { signIn } from "../auth"


export const loginAction = async (loginDetails) => {
    // console.log("loginDetails",loginDetails)
    try {
        await signIn("credentials",{
            email:loginDetails.email,
            password:loginDetails.password,
            redirectTo:"https://react-preview-generator-with-next-js.vercel.app/"
        })
    } catch (error) {
        console.log(error)
    }
}
