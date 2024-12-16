
"use server"


import DBConnection from "../utils/config/db"
import UserModel from "../utils/models/User"


export const registerAction = async(registerDetails) => {
    console.log("From server",registerDetails)
    await DBConnection()
    await UserModel.create(registerDetails)
    return {success:true}
}