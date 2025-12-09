import prisma from '../utils/prismaClient.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function register(req,res) {
    const {username,password} = req.body
    try {
        // frontend assumes username and password exists else frontend will return error
        // we check if username exist in db first we dont want to register existing clients
        const exist = await prisma.user.findUnique({
            where: {
                username : username
            }
        })
        if (exist) {
            return res.status(409).json({error:'User already exists'})
        }
        const hashedPassword = await bcrypt.hash(password,9)
        const user = await prisma.user.create({
            data: {
                username: username,
                password:hashedPassword
            }
        })
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'24h'})
        res.status(201).json({message:'User created successfully',token:token})
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

export async function login(req,res) {
    const {username,password} = req.body
    try{
        const exist = await prisma.user.findUnique({
            where: {
                username:username
            }
        })
        if (!exist) { 
            return res.status(404).json({error:'User does not exist'})
        }
        // else means exist we can compare
        const isVerified = await bcrypt.compare(password,exist.password)
        if (!isVerified) {
            return res.status(401).json({error:'Invalid credentials'})
        }
        const token = jwt.sign({id:exist.id},process.env.JWT_SECRET,{expiresIn:'24h'})
        res.status(200).json({message:'User logged in successfully',token:token})
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

