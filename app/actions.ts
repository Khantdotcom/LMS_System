'use server'

import {prisma} from '@/lib/db'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'

export async function createEvent(formData: FormData){
    const event_title = formData.get('title') as string
    const dateStr = formData.get('date') as string
    const event_zoomLink = formData.get('zoomLink') as string
    const passcode = formData.get('passcode') as string

    if (!event_title || !dateStr || !event_zoomLink){
        throw new Error('Missing required fields')
    }
    console.log('Creating event: ',event_title)

    await prisma.event.create({
        data:{
            title:event_title,
            date: new Date(dateStr),
            zoomLink: event_zoomLink,
            zoomPasscode: passcode || null,
            description: `g`,
            mentor: {
             create: {
            telegramId: `229222`,
            name: `Pa`,
            email: `pan@giftedinternational.com`,
            photoUrl: ``,
            xp: 0,
            currentPosition: "Khant's Wife",
            currentCompany: "GIFT-Ed",
            role: 'ADMIN',
             }}
    }})

    revalidatePath('/dashboard')

    redirect('/dashboard')
}

