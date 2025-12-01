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
    try {
        console.log("🚀 Starting Submit Payment...")

        const file = formData.get('screenshot') as File
        const eventIdRaw = formData.get('eventId')
        const userIdRaw = formData.get('userId')

        console.log("📥 Received Data:", { eventIdRaw, userIdRaw, fileSize: file?.size })

        if (!eventIdRaw || !userIdRaw) throw new Error('Missing IDs')

        const eventId = parseInt(eventIdRaw.toString())
        const userId = parseInt(userIdRaw.toString())

        // --- 1. Check for Existing Enrollment ---
        const existing = await prisma.enrollment.findFirst({
            where: {
                userId: userId,
                eventId: eventId
            }
        })

        if (existing) {
            console.log("⚠️ Enrollment already exists:", existing.status)
            if (existing.status === 'PENDING' || existing.status === 'APPROVED') {
                return redirect('/dashboard?error=already_enrolled')
            }
            // If REJECTED, delete to retry
            await prisma.enrollment.delete({ where: { id: existing.id } })
        }

        // --- 2. Verify User & Event Exist (Prevents "Record not found" crash) ---
        const userExists = await prisma.user.findUnique({ where: { id: userId } })
        const eventExists = await prisma.event.findUnique({ where: { id: eventId } })

        if (!userExists) throw new Error(`❌ User ID ${userId} does not exist in DB!`)
        if (!eventExists) throw new Error(`❌ Event ID ${eventId} does not exist in DB!`)

        // --- 3. Upload to Cloudinary ---
        if (!file || file.size === 0) throw new Error('No file uploaded')

        console.log("☁️ Uploading to Cloudinary...")
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
        console.log("✅ Upload Success:", imageUrl)

        // --- 4. Save to DB ---
        console.log("💾 Saving to Database...")
        await prisma.enrollment.create({
            data: {
                user: { connect: { id: userId } },
                event: { connect: { id: eventId } },
                screenshotUrl: imageUrl,
                status: 'PENDING'
            }
        })
        console.log("🎉 Database Save Complete!")

    } catch (error: any) {
        // NEXT_REDIRECT is a special error Next.js uses to handle redirects.
        // We must let it pass through, or redirects won't work.
        if (error.message === 'NEXT_REDIRECT' || error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }

        // Log actual crashes
        console.error("🔥 SERVER ACTION CRASH:", error.message)
        throw new Error(error.message) // Send error to client
    }

    // 5. Success Redirect
    redirect('/dashboard?payment=submitted')
}