import dotenv from "dotenv"
dotenv.config({path:".env.test"})
import { PrismaClient } from "@prisma/client"
import app from "../src/app.js"
import request from "supertest"
import bcrypt from "bcryptjs"



const hashedPassword = await bcrypt.hash("woefriqwnefionweoivnwnwgeinwon", 10)
global.prisma = new PrismaClient()
global.token = ""
global.token2 = ""
global.userId = ""
global.userId2 = ""

beforeAll(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Transaction" RESTART IDENTITY CASCADE`)
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Account" RESTART IDENTITY CASCADE`)
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`)

    // Creates a user
    await prisma.user.create({
    data: {
      username: "test@example.com",
      password: hashedPassword
    }
  })
    // Creates 2nd user
    await prisma.user.create({
    data: {
      username: "test2@example.com",
      password: hashedPassword
    }
  })
    // Attempts to login
    const loginRes = await request(app)
    .post("/auth/login")
    .send({
      username: "test@example.com",
      password: "woefriqwnefionweoivnwnwgeinwon"
    })

    const loginRes2 = await request(app)
    .post("/auth/login")
    .send({
      username: "test2@example.com",
      password: "woefriqwnefionweoivnwnwgeinwon"
    })


    global.token = loginRes.body.token
    global.token2 = loginRes2.body.token

    if (!global.token || !global.token2) {
        throw new Error("Login Failed: No token generated!")
    }

    const user = await prisma.user.findUnique({
      where: {
        username:"test@example.com"
      }
    })

    global.userId = user.id

    const user2 = await prisma.user.findUnique({
      where: {
        username:"test2@example.com"
      }
    })

    global.userId2 = user2.id

    const accountCreationRes = await prisma.account.create({
      data: {
                desc:"TESTING DATA",
                bank:"TEST BANK",
                accNo:"00000000",
                userId:userId
      }
    })
    const accountCreationRes1 = await prisma.account.create({
      data: {
                desc:"TESTING DATA1",
                bank:"TEST BANK1",
                accNo:"00000001",
                userId:userId2
      }
    })
    const accountCreationRes2 = await prisma.account.create({
      data: {
                desc:"TESTING DATA2",
                bank:"TEST BANK2",
                accNo:"00000002",
                userId:userId2
      }
    })
  // Accounts created in setup.js for User2 used to ensure GET is correct
  global.mockAccountsUser2 = [
    {id:2,desc:"TESTING DATA1",bank:"TEST BANK1",accNo:"00000001",userId:userId2},
    {id:3,desc:"TESTING DATA2",bank:"TEST BANK2",accNo:"00000002",userId:userId2}
  ]

  global.mockAccount3 = {id:3,desc:"TESTING DATA2",bank:"TEST BANK2",accNo:"00000002",userId:userId2}
    
})

afterAll(async ()=> {
    await prisma.$disconnect()
})