import NextAuth from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import DBConnection from './utils/config/db'
import UserModel from './utils/models/User'

export const {auth, signIn, signOut, handlers:{GET, POST}} = NextAuth({
    providers:[
        CredentialProvider({
            name:'credentials',

            async authorize(credentials){
                await DBConnection()
                const user = await UserModel.findOne({email:credentials?.email,password:credentials?.password})
                if(!user){
                    return null
                }else{
                    return {name: user.username, email: user.email , password:user.password}
                }


           

            }
        })
    ],
    secret: process.env.SECRET_KEY,
    pages:{
        signIn:"/login"
    }
})