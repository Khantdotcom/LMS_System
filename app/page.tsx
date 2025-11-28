import Image from "next/image";
import TelegramLoginButton from '@/components/TelegramLoginButton'

export default function Home() {
  const BOT_USERNAME = 'giftedcirclebot'
  return (
    <main className = "flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className = "z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className = "text-4xl font-bod text-blue-600">GIFT-Ed Circle</h1>
        <div className = "bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full max-w-md text-center">
          <h2 className="text-xl text-black font-semibold mb-6">Member Login</h2>
          <TelegramLoginButton botName={BOT_USERNAME} />
        </div>
      </div>
    </main>
  );
}
