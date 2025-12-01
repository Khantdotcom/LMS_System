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
        <main className="bg-background text-foreground p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
                        <p className="text-foreground/60">Course Manager • {course.modules.length} Modules</p>
                    </div>
                    <Link href="/courses" className="text-primary hover:underline font-medium">
                        View Public Page
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Module List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="font-bold text-xl mb-4 text-foreground">Curriculum</h2>
                        {course.modules.length === 0 ? (
                            <div className="text-foreground/40 italic p-8 border border-dashed border-border rounded-xl text-center">
                                No modules yet. Add one on the right. 👉
                            </div>
                        ) : (
                            course.modules.map((mod) => (
                                <div key={mod.id} className="bg-card border border-border p-4 rounded-lg flex items-center gap-4 shadow-sm">
                                    <div className="bg-secondary/30 p-2 rounded-full text-primary">
                                        <PlayCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{mod.title}</h3>
                                        <a href={mod.videoUrl} target="_blank" className="text-xs text-primary hover:underline truncate block max-w-[300px]">
                                            {mod.videoUrl}
                                        </a>
                                    </div>
                                    <div className="ml-auto text-xs text-foreground/40 font-mono">
                                        #{mod.order}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* RIGHT: Add Module Form */}
                    <div className="bg-card border border-border p-6 rounded-xl h-fit shadow-md sticky top-24">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                            <Plus size={20} className="text-primary"/> Add Module
                        </h2>

                        <form action={addModule} className="flex flex-col gap-4">
                            <input type="hidden" name="courseId" value={course.id} />

                            <div>
                                <label className="text-xs text-foreground/60 uppercase font-bold mb-1 block">Module Title</label>
                                <input name="title" required placeholder="e.g. Intro to Sales"
                                       className="w-full p-2 rounded bg-background border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>

                            <div>
                                <label className="text-xs text-foreground/60 uppercase font-bold mb-1 block">Video URL</label>
                                <input name="videoUrl" required placeholder="Youtube Embed URL"
                                       className="w-full p-2 rounded bg-background border border-border text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>

                            <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-sm mt-2 shadow-sm transition-all">
                                Add Module
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    )
}