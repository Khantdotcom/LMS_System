import { prisma } from '@/lib/db'
import { Calendar, Video, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { cookies } from 'next/headers'

export default async function EventList() {
    // 1. Get Current User ID safely
    const cookieStore = await cookies()
    const userIdString = cookieStore.get('userId')?.value
    const userId = userIdString ? parseInt(userIdString) : null

    // 2. Fetch ALL Events (so users can see what to buy)
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' }
    })

    // 3. Fetch ONLY this user's enrollments
    // We create a list of eventIds this user has enrolled in
    let myEnrollments: any[] = []

    if (userId) {
        myEnrollments = await prisma.enrollment.findMany({
            where: { userId: userId },
            select: { eventId: true, status: true } // We only need status and ID to check match
        })
    }

    if (events.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed border-border rounded-xl text-foreground/60">
                No events scheduled yet.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => {
                // 4. FIND MATCH: Check if user has an enrollment for THIS specific event
                const enrollment = myEnrollments.find(e => e.eventId === event.id)

                const status = enrollment?.status // 'APPROVED', 'PENDING', 'REJECTED' or undefined
                const isApproved = status === 'APPROVED'
                const isPending = status === 'PENDING'

                return (
                    <div
                        key={event.id}
                        className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between group"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-foreground/60 text-sm mb-4">
                                <Calendar size={16} />
                                <span>
                                    {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>

                        {/* DYNAMIC BUTTON LOGIC */}
                        {isApproved ? (
                            <a
                                href={event.zoomLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium py-2 px-4 rounded-lg w-full justify-center transition-colors"
                            >
                                <Video size={16} />
                                Join Zoom Session
                            </a>
                        ) : isPending ? (
                            <button
                                disabled
                                className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 text-sm font-medium py-2 px-4 rounded-lg w-full justify-center cursor-not-allowed border border-amber-200"
                            >
                                ⏳ Payment Reviewing...
                            </button>
                        ) : (
                            <Link
                                href={`/events/${event.id}/register`}
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium py-2 px-4 rounded-lg w-full justify-center transition-colors glow-button"
                            >
                                <CreditCard size={16} />
                                Secure Your Spot
                            </Link>
                        )}

                    </div>
                )
            })}
        </div>
    )
}