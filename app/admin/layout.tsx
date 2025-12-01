import Link from 'next/link'

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* Admin Navigation Bar */}
            <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-primary rounded-full"></div>
                        <h1 className="font-bold text-xl tracking-tight">
                            <span className="text-primary glow-text">GIFT-Ed</span> Admin
                        </h1>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="hidden md:flex items-center gap-1 bg-secondary/30 p-1 rounded-lg border border-border">
                        <AdminTab href="/admin/enrollments" label="Payments" />
                        <AdminTab href="/admin/events" label="Events" />
                        <AdminTab href="/admin/courses/create" label="New Course" />
                    </div>

                    {/* Exit Button */}
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 rounded-md"
                    >
                        Exit to App →
                    </Link>
                </div>
            </nav>

            {/* Mobile Nav */}
            <div className="md:hidden flex overflow-x-auto gap-2 p-4 bg-card border-b border-border">
                <AdminTab href="/admin/enrollments" label="Payments" />
                <AdminTab href="/admin/events" label="Events" />
                <AdminTab href="/admin/courses/create" label="New Course" />
            </div>

            {/* Page Content */}
            <div className="max-w-7xl mx-auto p-6">
                {children}
            </div>
        </div>
    )
}

// Helper Component for Tabs
function AdminTab({ href, label }: { href: string, label: string }) {
    return (
        <Link
            href={href}
            className="px-4 py-1.5 rounded-md text-sm font-medium text-foreground/70 hover:bg-white hover:text-primary hover:shadow-sm focus:bg-white focus:text-primary transition-all"
        >
            {label}
        </Link>
    )
}