import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

async function main(){
    const user = await prisma.user.create({
        data: {
            email : 'ggg@gmail.com',
            name : 'Alice Function',
            telegramId:'29282384',
            xp : 100,
            role: 'USER',
        },
    })

    console.log('Yayyy, my first user:',user)

    const allUser = await prisma.user.findMany()
    console.log("Total Users",allUser.length)


}

main()
    .catch((e)=>{
        console.error(e)
        process.exit(1)
    })
    .finally(async ()=>{
        await prisma.$disconnect()
    })