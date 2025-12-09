import dotenv from "dotenv"
dotenv.config({path:".env.test"})
import { PrismaClient } from "@prisma/client"
import app from "../src/app.js"
import request from "supertest"
import bcrypt from "bcryptjs"



const hashedPassword = await bcrypt.hash("woefriqwnefionweoivnwnwgeinwon", 10)
global.prisma = new PrismaClient()
global.token = ""

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
    // Attempts to login
    const loginRes = await request(app)
    .post("/auth/login")
    .send({
      username: "test@example.com",
      password: "woefriqwnefionweoivnwnwgeinwon"
    })

    global.token = loginRes.body.token

    if (!global.token) {
        throw new Error("Login Failed: No token generated!")
    }
    
})

afterAll(async ()=> {
    await prisma.$disconnect()
})