'use server'
import {prisma} from '@/lib/db'
import {redirect} from 'next/navigation'
import {v2 as cloudinaryV2} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


export async function