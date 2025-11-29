import TelegramLoginButton from '@/components/TelegramLoginButton'
import { Calendar, Users, TrendingUp } from 'lucide-react'

export default function Home() {
    const BOT_USERNAME = 'giftedcirclebot' // Replace with real bot username

    return (
        <main className="min-h-screen bg-slate-900 text-white">

            {/* Hero Section */}
            <section className="relative py-20 px-6 flex flex-col items-center text-center border-b border-slate-800">
                <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full pointer-events-none"></div>

                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    GIFT-Ed Circle
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mb-10">
                    The premier network for professionals in Myanmar. Connect, learn, and accelerate your career growth.
                </p>

                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">
                    <h2 className="text-lg font-semibold mb-4 text-white">Member Access</h2>
                    <TelegramLoginButton botName={BOT_USERNAME} />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<Calendar className="w-8 h-8 text-blue-400" />}
                    title="Exclusive Events"
                    desc="Join weekly workshops and coaching sessions with industry leaders."
                />
                <FeatureCard
                    icon={<TrendingUp className="w-8 h-8 text-green-400" />}
                    title="Track Progress"
                    desc="Earn XP for every session you attend. Build your professional profile."
                />
                <FeatureCard
                    icon={<Users className="w-8 h-8 text-purple-400" />}
                    title="Elite Network"
                    desc="Connect with diverse professionals from entry-level to C-suite."
                />
            </section>

        </main>
    )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-slate-400">{desc}</p>
        </div>
    )
}