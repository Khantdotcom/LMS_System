'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. Create the Course Shell
export async function createCourse(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseInt(formData.get('price') as string) || 0
    const thumbnail = formData.get('thumbnail') as string // URL from Cloudinary

    const course = await prisma.course.create({
        data: {
            title,
            description,
            price,
            thumbnail
        }
    })

    // Redirect to the Module Manager for this course
    redirect(`/admin/courses/${course.id}`)
}

// 2. Add a Module to a Course
export async function addModule(formData: FormData) {
    const courseId = formData.get('courseId') as string
    const title = formData.get('title') as string
    const videoUrl = formData.get('videoUrl') as string

    // Calculate the next "Order" number
    const existingModules = await prisma.module.count({
        where: { courseId }
    })

    await prisma.module.create({
        data: {
            title,
            videoUrl,
            courseId,
            order: existingModules + 1
        }
    })

    // Refresh the manager page to show the new module
    revalidatePath(`/admin/courses/${courseId}`)
}