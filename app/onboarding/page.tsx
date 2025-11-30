'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '@/app/actions/onboarding' // We will write this next

const INDUSTRIES = ["Tech", "Education", "Finance", "Marketing", "HR", "Design"]

export default function OnboardingPage() {
    const [selectedIndustry, setSelectedIndustry] = useState("")
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        // Add the selected industry to the form data manually
        formData.append('industry', selectedIndustry)
        await completeOnboarding(formData)
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                <h1 className="text-3xl font-bold mb-2">Welcome to GIFT-Ed! 👋</h1>
                <p className="text-slate-400 mb-8">Let's build your professional profile.</p>

                <form action={handleSubmit} className="space-y-6">

                    {/* Current Position */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Position</label>
                        <input name="position" type="text" required placeholder="e.g. Project Manager"
                               className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    {/* Current Company */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <input name="company" type="text" required placeholder="e.g. ABC Corp"
                               className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    {/* Industry Selector (Light up buttons) */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Industry</label>
                        <div className="grid grid-cols-3 gap-3">
                            {INDUSTRIES.map((ind) => (
                                <button
                                    key={ind}
                                    type="button"
                                    onClick={() => setSelectedIndustry(ind)}
                                    className={`p-3 rounded-lg text-sm font-medium border transition-all
                                ${selectedIndustry === ind
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}
                            `}
                                >
                                    {ind}
                                </button>
                            ))}
                        </div>
                        <input type="hidden" name="industry" value={selectedIndustry} required />
                    </div>

                    <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                        Continue →
                    </button>

                </form>
            </div>
        </main>
    )
}