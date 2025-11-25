//app/admin/events/page.tsx

import {createEvent} from '@/app/actions'

export default function CreateEventPage(){
    return (
        <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2x1">
                <h1 className="text-2x1 font-bold mb-2">Create New Event</h1>
                <p className="text-slate-400 mb-6 text-sm">Schedule a new program for GIFT-Ed</p>

                <form action={createEvent} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Event Title</label>
                        <input
                        name="title"
                        type="text"
                        required
                        placeholder="e.g. UI/UX workshop"
                        className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-white focus:border-blue-500 outline-none transition-colors"/>

                    </div>
<div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date & Time</label>
            <input 
              name="date" 
              type="datetime-local" 
              required
              placeholder="Date"
              className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-white focus:border-blue-500 outline-none [color-scheme:dark]"
            />
          </div>

          {/* Zoom Link */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Zoom Link</label>
            <input 
              name="zoomLink" 
              type="url" 
              required 
              placeholder="https://zoom.us/j/..."
              className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-white focus:border-blue-500 outline-none"
            />
          </div>

          {/* Passcode */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Passcode (Optional)</label>
            <input 
              name="passcode" 
              type="text" 
              placeholder="123456"
              className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-white focus:border-blue-500 outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-95"
          >
            🚀 Publish Event
          </button>

                </form>
            </div>
        </main>
    )
}