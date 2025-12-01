import { prisma } from '@/lib/db'
import { Lock, Unlock, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/auth'
import Image from 'next/image'

export default async function CoursesPage() {
    const session = await auth()

    // 1. Fetch all courses
    const courses = await prisma.course.findMany({
        include: {
            _count: { select: { modules: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    // 2. Check which ones the user has bought
    // We get a list of courseIds that the user has purchased
    let purchasedCourseIds: string[] = []

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { purchases: true }
        })
        if (user) {
            purchasedCourseIds = user.purchases.map(p => p.courseId)
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Learning Programs
                    </h1>
                    <p className="text-slate-400">Master the soft skills that accelerate your career.</p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                        <p className="text-xl text-slate-500">🚀 Programs are launching soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => {
                            const isUnlocked = purchasedCourseIds.includes(course.id)

                            return (
                                <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group flex flex-col">

                                    {/* Thumbnail Area */}
                                    <div className="h-48 bg-slate-800 relative">
                                        {course.thumbnail ? (
                                            <Image
                                                src={course.thumbnail}
                                                alt={course.title}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
                                                <PlayCircle size={48} className="text-white/20" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            {isUnlocked ? (
                                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
                                            <Unlock size={12} /> OWNED
                                        </span>
                                            ) : (
                                                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md border border-white/10">
                                            <Lock size={12} /> {course.price.toLocaleString()} MMK
                                        </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 flex-grow line-clamp-3">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
                                            <span>{course._count.modules} Lessons</span>
                                            <span>Video Course</span>
                                        </div>

                                        <Link
                                            href={`/courses/${course.id}`}
                                            className={`w-full py-3 rounded-xl font-bold text-center transition-all ${
                                                isUnlocked
                                                    ? 'bg-green-600 hover:bg-green-500 text-white'
                                                    : 'bg-white text-black hover:bg-gray-200'
                                            }`}
                                        >
                                            {isUnlocked ? 'Continue Learning' : 'View Details'}
                                        </Link>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                )}

            </div>
        </main>
    )
}