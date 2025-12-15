import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import request from "supertest"
import bcrypt from "bcryptjs"
import app from "../src/app.js" 


dotenv.config({ path: ".env.test" })


global.token = ""
global.token2 = ""
global.userId = ""
global.userId2 = ""
global.mockAccountsUser2 = []
global.mockAccount3 = null 
global.prisma = new PrismaClient() 

// Setup starts
beforeAll(async () => {
    
    const hashedPassword = await bcrypt.hash("woefriqwnefionweoivnwnwgeinwon", 10)
    
    // Resets entire database, all tables and identity number reset
    await global.prisma.$executeRawUnsafe(`TRUNCATE TABLE "Transaction" RESTART IDENTITY CASCADE`)
    await global.prisma.$executeRawUnsafe(`TRUNCATE TABLE "Account" RESTART IDENTITY CASCADE`)
    await global.prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`)

    // Create Users
    await global.prisma.user.create({ data: { username: "test@example.com", password: hashedPassword } })
    await global.prisma.user.create({ data: { username: "test2@example.com", password: hashedPassword } })
    
    // Login and Get Tokens
    const loginRes = await request(app)
        .post("/auth/login")
        .send({ username: "test@example.com", password: "woefriqwnefionweoivnwnwgeinwon" })

    const loginRes2 = await request(app)
        .post("/auth/login")
        .send({ username: "test2@example.com", password: "woefriqwnefionweoivnwnwgeinwon" })

    global.token = loginRes.body.token
    global.token2 = loginRes2.body.token

    if (!global.token || !global.token2) {
        throw new Error("Login Failed: No token generated! Check auth route.")
    }

    // Get User IDs
    const user = await global.prisma.user.findUnique({ where: { username: "test@example.com" } })
    global.userId = user.id

    const user2 = await global.prisma.user.findUnique({ where: { username: "test2@example.com" } })
    global.userId2 = user2.id
    
    // Create Initial Accounts & Capture Results
    // Account for User 1 (used primarily for negative tests against user 2)
    await global.prisma.account.create({
      data: {
        desc: "TESTING DATA", bank: "TEST BANK", accNo: "00000000", userId: global.userId
      }
    })

    // Accounts for User 2 (Used for Positive GET/PATCH/DELETE tests)
    const accountCreationRes1 = await global.prisma.account.create({
      data: {
        desc: "TESTING DATA1", bank: "TEST BANK1", accNo: "00000001", userId: global.userId2
      }
    })

    const accountCreationRes2 = await global.prisma.account.create({
      data: {
        desc: "TESTING DATA2", bank: "TEST BANK2", accNo: "00000002", userId: global.userId2
      }
    })

    global.mockAccountsUser2 = [accountCreationRes1, accountCreationRes2]
    global.mockAccount3 = accountCreationRes2 
})

// Teardown
afterAll(async () => {
    await global.prisma.$disconnect()
})