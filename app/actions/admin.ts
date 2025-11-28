'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function approveEnrollment(formData: FormData) {
    const enrollmentId = parseInt(formData.get('enrollmentId') as string)

    // 1. Update DB
    await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
            status: 'APPROVED',
            // Optional: Add "approvedAt" date if you modified schema
        }
    })

    // 2. Refresh the UI
    revalidatePath('/admin/enrollments')
}

export async function rejectEnrollment(formData: FormData) {
    const enrollmentId = parseInt(formData.get('enrollmentId') as string)

    await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: { status: 'REJECTED' }
    })

    revalidatePath('/admin/enrollments')
}