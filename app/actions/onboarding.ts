'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function completeOnboarding(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) return

    const position = formData.get('position') as string
    const company = formData.get('company') as string
    const industry = formData.get('industry') as string

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            currentPosition: position,
            currentCompany: company,
            industry: industry,
            onboardingCompleted: true
        }
    })

    // Redirect to Step 2: Connect Telegram
    redirect('/onboarding/connect-telegram')
}