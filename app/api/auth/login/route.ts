import {prisma} from '@/lib/db'
import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'

export async function POST(request: Request){
    try{
        const userData = await request.json()

        console.log("Server receive user:", userData)

        const user = await prisma.user.upsert({
            where:{telegramId: userData.id.toString(),
            },
            update: {
                name: `${userData.first_name} ${userData.last_name || ''}`.trim(),
                currentPosition : "Developer",
                currentCompany : "GIFT-Ed",
            },
            create:{
                telegramId : userData.id.toString(),
                name: `${userData.first_name} ${userData.last_name || ''}`.trim(),
                email: `temp_${userData.id}@telegram.user`,
                xp: 0,
                currentPosition : "Developer",
                currentCompany : "GIFT-Ed",
                role: 'USER',
                photoUrl : `${userData.photo_url}`,
            },
        })
        const cookieStore = await cookies()

        cookieStore.set('userId',user.id.toString(),{
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60*60*24*7,
            path: '/',
        })
        return NextResponse.json({success: true,user})
} catch(error){
    console.error('Login Error:',error)
    return NextResponse.json({success:false, error: 'Database error'},{status : 500})
}
}