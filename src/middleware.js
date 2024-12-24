import { NextResponse } from 'next/server'
import {getToken} from 'next-auth/jwt'
 
export async function middleware(request) {
    // console.log("middleware called")

    const path = request.nextUrl.pathname

    const isPublicPath = ['/login','/register'].includes(path)

    const token = await getToken({req:request, secret:process.env.SECRET_KEY})

    if(token && isPublicPath){
        return NextResponse.redirect(new URL('/', request.url))
    }
    if(!token && !isPublicPath){
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
    
}
 
export const config = {
  matcher:['/','/login', '/register'],
}