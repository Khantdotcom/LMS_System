'use server'

import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function submitPayment(formData: FormData) {
    // 1. Safe Extraction
    const file = formData.get('screenshot') as File
    const eventIdRaw = formData.get('eventId')
    const userIdRaw = formData.get('userId')

    // 2. Debugging Logs (So we can see what's wrong)
    console.log('--- PAYMENT DEBUG ---')
    console.log('Event ID Raw:', eventIdRaw)
    console.log('User ID Raw:', userIdRaw)
    console.log('File Size:', file?.size)

    // 3. Validation
    if (!eventIdRaw || !userIdRaw) {
        throw new Error('Missing Event ID or User ID. Please refresh the page.')
    }

    const eventId = parseInt(eventIdRaw.toString())
    const userId = parseInt(userIdRaw.toString())

    if (!file || file.size === 0) {
        throw new Error('No file uploaded')
    }

    // 4. Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'gifted-payments' },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        ).end(buffer)
    }) as any

    const imageUrl = uploadResult.secure_url

    // 5. Save to DB (Using "connect" syntax for safety)
    console.log('Saving to DB...', { userId, eventId, imageUrl })

    await prisma.enrollment.create({
        data: {
            // Instead of just passing IDs, we explicitly "connect" them.
            // This tells Prisma: "Find the User with this ID and link them."
            user: { connect: { id: userId } },
            event: { connect: { id: eventId } },

            screenshotUrl: imageUrl,
            status: 'PENDING'
        }
    })

    // 6. Finish
    redirect('/dashboard?payment=submitted')
}