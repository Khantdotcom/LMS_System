import { Telegraf, Markup } from 'telegraf'
import { NextResponse } from 'next/server'

// 1. Initialize Bot
const globalForBot = global as unknown as { bot: Telegraf }
const bot = globalForBot.bot || new Telegraf(process.env.BOT_TOKEN || '')
if (process.env.NODE_ENV !== 'production') globalForBot.bot = bot

// 2. Simple Start Command
bot.start((ctx) => {
    return ctx.reply('Hello! I am the GIFT-Ed Community Manager. 🤖')
})

// 3. New Member Handler
bot.on('new_chat_members', async (ctx) => {
    try {
        // A. Delete the system message
        await ctx.deleteMessage(ctx.message.message_id).catch((err) => {
            console.log("⚠️ Delete failed (Check Permissions):", err.message)
        })

        // B. Welcome the user
        const newMembers = ctx.message.new_chat_members
        const chatId = ctx.chat.id
        const threadId = ctx.message.is_topic_message ? ctx.message.message_thread_id : undefined

        for (const member of newMembers) {
            if (member.is_bot) continue

            const firstName = member.first_name
            // FIX: Use HTML format for the link instead of Markdown
            const mention = `<a href="tg://user?id=${member.id}">${firstName}</a>`

            await ctx.telegram.sendMessage(
                chatId,
                // FIX: Normal text works fine here now (no need to escape '!')
                `Hello ${mention}! Welcome to GIFT-Ed Circle. 👋\n\nWe recommend creating an account on our platform to track your progress and join upcoming events.`,
                {
                    parse_mode: 'HTML', // <--- CHANGED THIS to HTML
                    message_thread_id: threadId,
                    ...Markup.inlineKeyboard([
                        [
                            Markup.button.url('🌐 Visit Platform', 'https://unchiding-dorris-synovially.ngrok-free.dev/')
                        ]
                    ])
                }
            )
        }
    } catch (error) {
        console.error('Welcome Error:', error)
    }
})

// 4. Webhook Handler
export async function POST(request: Request) {
    try {
        const body = await request.json()
        await bot.handleUpdate(body)
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Bot Error:', error)
        return NextResponse.json({ error: 'Error' }, { status: 500 })
    }
}