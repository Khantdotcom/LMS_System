import { prisma } from '@/lib/db'
import { addModule } from '@/app/actions/course'
import { PlayCircle, Plus, Video } from 'lucide-react'
import Link from 'next/link'

export default async function CourseManagerPage({
                                                    params
                                                }: {
    params: Promise<{ courseId: string }>
}) {
    const { courseId } = await params

    // Fetch Course + Modules
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: { orderBy: { order: 'asc' } }
        }
    })

    if (!course) return <div>Course not found</div>

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p className="text-slate-400">Course Manager • {course.modules.length} Modules</p>
                    </div>
                    <Link href="/courses" className="text-blue-400 hover:underline">
                        View Public Page
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* LEFT: Module List */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="font-bold text-xl mb-4">Curriculum</h2>
                        {course.modules.length === 0 ? (
                            <div className="text-slate-500 italic">No modules yet. Add one on the right. 👉</div>
                        ) : (
                            course.modules.map((mod) => (
                                <div key={mod.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center gap-4">
                                    <div className="bg-slate-800 p-2 rounded-full text-slate-400">
                                        <PlayCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{mod.title}</h3>
                                        <a href={mod.videoUrl} target="_blank" className="text-xs text-blue-500 hover:underline truncate block max-w-[200px]">
                                            {mod.videoUrl}
                                        </a>
                                    </div>
                                    <div className="ml-auto text-xs text-slate-600 font-mono">
                                        #{mod.order}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* RIGHT: Add Module Form */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-fit">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-green-400"/> Add Module
                        </h2>

                        <form action={addModule} className="flex flex-col gap-4">
                            <input type="hidden" name="courseId" value={course.id} />

                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold">Module Title</label>
                                <input name="title" required placeholder="e.g. Intro to Sales"
                                       className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm" />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold">Video URL</label>
                                <input name="videoUrl" required placeholder="Youtube Embed URL"
                                       className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm" />
                            </div>

                            <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-sm mt-2">
                                Add Module
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    )
}