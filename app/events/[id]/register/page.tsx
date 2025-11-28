import { submitPayment } from '@/app/actions/enroll'

// FIX: The type of params is now a Promise
export default async function PaymentPage({
                                              params
                                          }: {
    params: Promise<{ id: string }>
}) {
    // FIX: We must await the params to get the actual ID
    const { id } = await params

    return (
        <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl border border-slate-700">

                <h1 className="text-xl font-bold mb-4">Secure Your Spot</h1>

                <div className="bg-blue-900/30 p-4 rounded-lg mb-6 border border-blue-800">
                    <p className="font-bold text-blue-300 mb-2">Step 1: Transfer to</p>
                    <p>KBZ Pay: 0997xxxxxx (Ma Yee Mon)</p>
                </div>

                <form action={submitPayment} className="flex flex-col gap-4">
                    {/* FIX: Use the awaited ID here */}
                    <input type="hidden" name="eventId" value={id} />

                    {/* User ID (Hardcoded for MVP, later from session) */}
                    <input type="hidden" name="userId" value="1" />

                    <label className="block text-sm text-slate-400">Step 2: Upload Screenshot</label>
                    <input
                        name="screenshot"
                        type="file"
                        accept="image/*"
                        required
                        className="block w-full text-sm text-slate-400 file:bg-blue-600 file:text-white file:rounded-full file:px-4 file:py-2 file:border-0"
                    />

                    <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg mt-2">
                        Submit Payment
                    </button>
                </form>

            </div>
        </main>
    )
}