import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import EventList from '@/components/user_events' // Correct import

export default async function Dashboard() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
            attendedEvents: true
        }
    })

    if (!user) redirect('/login')

    return (
        <main className="min-h-[calc(100vh-64px)] bg-background p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>

                    <div className="relative">
                        {user.image || user.photoUrl ? (
                            <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                                <Image
                                    src={user.image || user.photoUrl || ''}
                                    alt={user.name || "User"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-lg">
                                {user.name?.[0]?.toUpperCase() || '?'}
                            </div>
                        )}
                    </div>

                    <div className="text-center md:text-left flex-grow">
                        <h1 className="text-3xl font-bold text-foreground mb-1">{user.name}</h1>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-foreground/60 items-center md:items-start">
                            <span>{user.currentPosition || 'Position not set'}</span>
                            <span className="hidden md:inline">•</span>
                            <span>{user.currentCompany || 'Company not set'}</span>
                        </div>
                    </div>

                    <div className="bg-secondary/50 px-6 py-4 rounded-xl text-center min-w-[140px]">
                        <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Total XP</p>
                        <p className="text-4xl font-mono font-bold text-primary">{user.xp}</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Events */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-foreground">Upcoming Sessions</h2>
                            <span className="text-sm text-primary font-medium cursor-pointer hover:underline">View All</span>
                        </div>
                        <EventList />
                    </div>

                    {/* Right Column: Stats & Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-foreground">Your Journey</h3>
                            <div className="space-y-4">
                                <StatRow label="Events Attended" value={user.attendedEvents.length} />
                                <StatRow label="Member Status" value={user.role} />
                                <StatRow label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-2xl text-white shadow-lg glow-button cursor-pointer">
                            <h3 className="font-bold text-lg mb-2">Career Game 2026</h3>
                            <p className="text-white/90 text-sm mb-4">Discover your professional archetype for the new year.</p>
                            <span className="inline-block bg-white/20 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">Play Now →</span>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    )
}

function StatRow({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
            <span className="text-sm text-foreground/60">{label}</span>
            <span className="font-semibold text-foreground">{value}</span>
        </div>
    )
}