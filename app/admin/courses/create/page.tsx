import { createCourse } from '@/app/actions/course'

export default function CreateCoursePage() {
    return (
        <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-slate-800 p-8 rounded-xl border border-slate-700">
                <h1 className="text-2xl font-bold mb-6">Create New Program</h1>

                <form action={createCourse} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Course Title</label>
                        <input name="title" type="text" required placeholder="e.g. Communication Mastery"
                               className="w-full p-3 rounded bg-slate-900 border border-slate-600" />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Description</label>
                        <textarea name="description" required rows={3}
                                  className="w-full p-3 rounded bg-slate-900 border border-slate-600" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Price (MMK)</label>
                            <input name="price" type="number" required placeholder="100000"
                                   className="w-full p-3 rounded bg-slate-900 border border-slate-600" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Thumbnail URL</label>
                            <input name="thumbnail" type="url" required placeholder="https://..."
                                   className="w-full p-3 rounded bg-slate-900 border border-slate-600" />
                        </div>
                    </div>

                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4">
                        Create & Add Modules →
                    </button>
                </form>
            </div>
        </main>
    )
}