import { signIn } from '@/auth'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import TelegramLoginButton from '@/components/TelegramLoginButton'
import Image from 'next/image'
import Link from 'next/link'

export default async function LoginPage() {
    const session = await auth()
    if (session?.user) {
        redirect('/dashboard')
    }

    return (
        <main className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4">

            <div className="mb-8">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo full.png" alt="Logo" width={40} height={40} />
                    <span className="text-2xl font-bold text-primary">GIFT-Ed</span>
                </Link>
            </div>

            <div className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2 text-foreground">Welcome Back</h1>
                    <p className="text-foreground/60 text-sm">Sign in to access your dashboard & events</p>
                </div>

                <div className="space-y-4">

                    {/* GOOGLE LOGIN */}
                    <form
                        action={async () => {
                            "use server"
                            await signIn("google", { redirectTo: "/onboarding" })
                        }}
                    >
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 bg-white border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <Image src="https://authjs.dev/img/providers/google.svg" alt="Google" width={20} height={20} />
                            Continue with Google
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-foreground/40 font-medium">Or continue with</span>
                        </div>
                    </div>

                    {/* TELEGRAM LOGIN */}
                    <div className="flex justify-center">
                        <TelegramLoginButton botName={'giftedcirclebot'} />
                    </div>

                </div>
            </div>

            <p className="mt-8 text-center text-xs text-foreground/40">
                By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </main>
    )
}