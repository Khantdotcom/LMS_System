import { Calendar, Users, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
    return (
        <main className="bg-background">
            {/* Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-4xl mx-auto text-center z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary text-secondary-foreground text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        Join the Circle
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-foreground">
                        Grow Your Career with <span className="text-primary glow-text">GIFT-Ed</span>
                    </h1>

                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The premier network for professionals in Myanmar. Connect with mentors, join exclusive workshops, and accelerate your journey from entry-level to C-suite.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/login"
                            className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg glow-button flex items-center gap-2"
                        >
                            Join Now <ArrowRight size={20} />
                        </Link>
                        <Link
                            href="/courses"
                            className="px-8 py-4 bg-white border border-border text-foreground rounded-xl font-bold text-lg hover:bg-secondary/30 transition-colors"
                        >
                            Explore Programs
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-secondary/20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Professionals Choose Us</h2>
                        <p className="text-foreground/60">Everything you need to level up your professional life.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Calendar className="w-8 h-8 text-primary" />}
                            title="Exclusive Events"
                            desc="Weekly workshops and coaching sessions with industry leaders. Book your spot instantly."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="w-8 h-8 text-accent" />}
                            title="Track Progress"
                            desc="Earn XP for every session. Build a verified professional profile that stands out."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-sky-500" />}
                            title="Elite Network"
                            desc="Connect with diverse professionals. Find mentors and collaborators in our circle."
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
            <div className="mb-6 p-3 bg-secondary/30 w-fit rounded-xl">{icon}</div>
            <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
            <p className="text-foreground/60 leading-relaxed">{desc}</p>
        </div>
    )
}