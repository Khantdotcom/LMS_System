'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Don't show navbar on login or onboarding pages to keep them focused
    if (pathname === '/login' || pathname === '/onboarding') return null

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/logo full.png"
                                alt="GIFT-Ed Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary glow-text">
              GIFT-Ed
            </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink href="/" active={pathname === '/'}>Home</NavLink>
                        <NavLink href="/courses" active={pathname.startsWith('/courses')}>Programs</NavLink>
                        <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>

                        <Link
                            href="/login"
                            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-semibold text-sm glow-button"
                        >
                            Member Access
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
                    <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                    <MobileNavLink href="/courses" onClick={() => setIsOpen(false)}>Programs</MobileNavLink>
                    <MobileNavLink href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</MobileNavLink>
                    <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center bg-primary text-primary-foreground px-5 py-3 rounded-lg font-bold"
                    >
                        Member Access
                    </Link>
                </div>
            )}
        </nav>
    )
}

function NavLink({ href, active, children }: { href: string, active: boolean, children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`text-sm font-medium transition-colors hover:text-primary ${
                active ? 'text-primary' : 'text-foreground/70'
            }`}
        >
            {children}
        </Link>
    )
}

function MobileNavLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block text-base font-medium text-foreground/80 hover:text-primary py-2"
        >
            {children}
        </Link>
    )
}