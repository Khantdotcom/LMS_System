import {prisma} from '@/lib/db'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import Image from 'next/image'
import {EventList} from './user_events'

export default async function Dashboard(){
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId){
        redirect('/')
    }

    const user = await prisma.user.findUnique({
        where: {id: parseInt(userId)},
        include: {
            attendedEvents: true
        }
    })

    if (!user) redirect('/')

    return (
        <main className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-12 border-b border-slate-700 pb-8">
            {user.photoUrl? (
            <Image 
                src={user.photoUrl}
                alt={user.name || "User"}
                width={80} 
                height={80} 
                className="rounded-full object-cover w-20 h-20 border-2 border-blue-500"/>
            ):(
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-3xl font-bold uppercase">
                {user.name?.[0] || '?'}
            </div>
                        )}
            <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-slate-400">GIFT-Ed Member • ID: {user.telegramId}</p>
            </div>
            <div className="ml-auto text-right">
                <p className="text-sm text-slate-400">Total XP</p>
                <p className="text-4xl font-mono text-green-400">{user.xp}</p>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-slate-400 mb-2">Events Attended</h3>
                <p className="text-3xl font-bold">{user.attendedEvents.length}</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-slate-400 mb-2">Current Position</h3>
                <p className="text-xl text-blue-300">{user.currentPosition}</p>
                <h3 className="text-slate-400 mb-2">Current Company</h3>
                <p className="text-xl text-blue-300">{user.currentCompany}</p>
            </div>
        </div>
                <div>
                    <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-500 pl-4">Upcoming Sessions</h2>
                    {/* The Server Component loads here */}
                    <EventList />
                </div>
    </div>
    </main>
    )
}