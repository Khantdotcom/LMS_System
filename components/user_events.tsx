import {prisma} from '@/lib/db'
import {Calendar,Video} from 'lucide-react'
import Link from "next/link";


export async function EventList(){
    const events = await prisma.event.findMany({
        orderBy:{
            date:'asc',
        }
    })

    if (events.length ===0){
        return(
            <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl text-slate-500">
                No event scheduled yet
            </div>
        )
    }

    return(
        <div className="grid grid-cols md:grid-cols-2 lg:grid-cols3 gap-">
            {events.map((event)=>(
                <div
                key={event.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors">

                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>

                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                    <Calendar size={16}/>
                    <span>{event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                </div>
                    <Link
                        href={`/events/${event.id}/register`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-lg w-full justify-center transition-colors"
                    >
                        <Video size={16} />
                        Register Now!
                    </Link>
                </div>
            ))}
        </div>
    )
}