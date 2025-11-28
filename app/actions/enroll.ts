'use server'

import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function submitPayment(formData: FormData) {
    const file = formData.get('screenshot') as File
    const eventId = parseInt(formData.get('eventId') as string)
    const userId = parseInt(formData.get('userId') as string) // In real app, get this from session cookie

    if (!file || file.size === 0) {
        throw new Error('No file uploaded')
    }

    // 1. Upload to Cloudinary
    // We need to convert the File to a Buffer first
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'gifted-payments' }, // Organize in a folder
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        ).end(buffer)
    }) as any

    const imageUrl = uploadResult.secure_url

    // 2. Save to DB
    await prisma.enrollment.create({
        data: {
            userId,
            eventId,
            screenshotUrl: imageUrl,
            status: 'PENDING'
        }
    })

    // 3. Redirect to "Thank You" page
    redirect('/dashboard?payment=submitted')
}