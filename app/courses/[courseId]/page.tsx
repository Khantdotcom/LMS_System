import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Lock, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export default async function CoursePage({
                                             params
                                         }: {
    params: Promise<{ courseId: string }>
}) {
    const { courseId } = await params
    const session = await auth()

    // 1. Get Course Data
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { modules: { orderBy: { order: 'asc' } } }
    })

    if (!course) return <div>Course not found</div>

    // 2. Check Access (Did they buy it?)
    let hasAccess = false
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (user) {
            const purchase = await prisma.purchase.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: course.id
                    }
                }
            })
            if (purchase) hasAccess = true
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-slate-400">{course.description}</p>
                </div>

                {/* Video Grid */}
                <div className="grid gap-6">
                    {course.modules.map((module) => (
                        <div key={module.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between group">

                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${hasAccess ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                                    {hasAccess ? <PlayCircle size={24} /> : <Lock size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{module.title}</h3>
                                    <p className="text-sm text-slate-500">Video Lesson</p>
                                </div>
                            </div>

                            {hasAccess ? (
                                // UNLOCKED: Show "Watch" button
                                <Link
                                    href={`/courses/${course.id}/learn/${module.id}`}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
                                >
                                    Watch Now
                                </Link>
                            ) : (
                                // LOCKED: Show Price tag
                                <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                    <Lock size={14} /> Locked
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA for Non-Buyers */}
                {!hasAccess && (
                    <div className="mt-12 p-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800 rounded-2xl text-center">
                        <h2 className="text-2xl font-bold mb-4">Unlock Full Access</h2>
                        <p className="text-blue-200 mb-6">Get lifetime access to {course.title} for only {course.price.toLocaleString()} MMK.</p>
                        <Link
                            href={`/courses/${course.id}/buy`} // We will build this "Buy" page later (similar to payment wizard)
                            className="inline-block px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-transform hover:scale-105"
                        >
                            Enroll Now
                        </Link>
                    </div>
                )}

            </div>
        </main>
    )
}