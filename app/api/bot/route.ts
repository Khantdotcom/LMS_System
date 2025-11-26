import {Telegraf} from 'telegraf'
import {NextResponse} from 'next/server'


if (!process.env.BOT_TOKEN){
    throw new Error("BOT_TOKEN in env is missing")
}
// Update the bot initialization line
const bot = new Telegraf(process.env.BOT_TOKEN || '', {
    handlerTimeout: 90000, // Wait 90 seconds before crashing
    telegram: {
        // @ts-ignore
        timeout: 50000 // Wait 50 seconds for network requests
    }
})

bot.start((ctx) => {
    console.log("Bot Triggered: /start command")
    return ctx.reply('Welcome to GIFT-Ed Circle!')
})

bot.on('text', (ctx)=>{
    const userMessage = ctx.message.text
    console.log('Bot Received : ${userMessage}')
    return ctx.reply('Yayyy you learned to speak : ${userMessage')
})

export async function POST(request:Request){
    console.log("🔔 WEBHOOK HIT: Telegram just sent a request")
    try{
        if (!process.env.BOT_TOKEN){
            console.error("BOT_TOKEN is missing in .env!")
            return NextResponse.json({error: 'Config error'},{status:500})
        }
        const body = await request.json()
        console.log("Payload received:", JSON.stringify(body,null,2))

        await bot.handleUpdate(body)
        console.log("Telegraf finished handling")

        return NextResponse.json({ok:true})
    } catch (error){
        console.error('Bot Error',error)
        return NextResponse.json({error:'Failed to process update'},{status:500})
    }
}