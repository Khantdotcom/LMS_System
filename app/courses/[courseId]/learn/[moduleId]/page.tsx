import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function LessonPage({
                                             params
                                         }: {
    params: Promise<{ courseId: string, moduleId: string }>
}) {
    const { courseId, moduleId } = await params
    const session = await auth()

    // 1. Security Check (Re-verify access)
    if (!session?.user?.email) redirect('/login')

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) redirect('/login')

    const purchase = await prisma.purchase.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } }
    })

    if (!purchase) {
        redirect(`/courses/${courseId}`) // Kick them back to sales page if they didn't pay
    }

    // 2. Get Video Data
    const moduleData = await prisma.module.findUnique({
        where: { id: moduleId }
    })

    if (!moduleData) return <div>Lesson not found</div>

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl">
                <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 mb-8">
                    <iframe
                        src={moduleData.videoUrl}
                        title={moduleData.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                <h1 className="text-3xl font-bold mb-4">{moduleData.title}</h1>
                <a href={`/courses/${courseId}`} className="text-slate-400 hover:text-white transition-colors">
                    ← Back to Course
                </a>
            </div>
        </main>
    )
}