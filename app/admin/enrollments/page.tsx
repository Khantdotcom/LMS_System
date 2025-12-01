import { prisma } from '@/lib/db'
import { approveEnrollment, rejectEnrollment } from '@/app/actions/admin'
import { Check, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function AdminEnrollmentsPage() {
    // 1. Fetch only PENDING requests
    const pendingEnrollments = await prisma.enrollment.findMany({
        where: { status: 'PENDING' },
        include: {
            user: true,
            event: true
        },
        orderBy: { createdAt: 'asc' } // Oldest first
    })

    return (
        <main className="min-h-screen bg-background text-foreground p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 border-b border-border pb-4 text-foreground">
                    Payment Review Queue ({pendingEnrollments.length})
                </h1>

                {pendingEnrollments.length === 0 ? (
                    <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
                        <p className="text-foreground/60 text-lg">No pending payments. Good job! 🎉</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {pendingEnrollments.map((item) => (
                            <div key={item.id} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all">

                                {/* Screenshot Thumbnail */}
                                <div className="relative w-32 h-48 flex-shrink-0">
                                    <Link href={item.screenshotUrl} target="_blank">
                                        <Image
                                            src={item.screenshotUrl}
                                            alt="Proof"
                                            fill
                                            className="object-cover rounded-lg border border-border hover:opacity-80 transition-opacity"
                                        />
                                    </Link>
                                </div>

                                {/* Details */}
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-foreground">{item.user.name}</h3>
                                    <p className="text-foreground/60 text-sm mb-2">User ID: {item.userId}</p>

                                    <div className="bg-secondary/50 p-3 rounded-lg mb-2 w-fit">
                                        <p className="text-xs text-foreground/50 uppercase font-bold">Event</p>
                                        <p className="text-primary font-semibold">{item.event.title}</p>
                                    </div>

                                    <p className="text-xs text-foreground/40">
                                        Uploaded: {item.createdAt.toLocaleString()}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    <form action={approveEnrollment}>
                                        <input type="hidden" name="enrollmentId" value={item.id} />
                                        <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm">
                                            <Check size={20} />
                                            Approve
                                        </button>
                                    </form>

                                    <form action={rejectEnrollment}>
                                        <input type="hidden" name="enrollmentId" value={item.id} />
                                        <button className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 py-2 px-6 rounded-lg transition-colors text-sm font-medium">
                                            <X size={16} />
                                            Reject
                                        </button>
                                    </form>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}