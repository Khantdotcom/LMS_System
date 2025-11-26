import {prisma} from '@/lib/db'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {NextResponse} from "next/server";

export async function GET(request:NextResponse){
    const searchParams = request.nextUrl.searchParams
    const token =searchParams.get('token')
    if(!token){
        return redirect('/')
    }
    const magicLink = await prisma.magicLink.findUnique({where: {token}, include:{user:true}})
    if(!magicLink|| magicLink.expiresAt < new Date()){
        return redirect('/?error=expired')
    }

    const cookieStore = await cookies()

    cookieStore.set('userId',magicLink.user.id.toString(),{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60*60*24*7,
        path: '/',
    })

    await prisma.magicLink.delete({
        where:{id:magicLink.id}
    })

redirect('/dashboard')
}