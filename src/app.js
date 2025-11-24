import express from 'express'
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js'
import accountRouter from './routes/accountRouter.js'
import {authVerifier} from './middleware/authMiddleware.js'

dotenv.config();

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use('/auth',authRouter)
app.use('/accounts', authVerifier,accountRouter)

app.listen(PORT, (req,res) => {
    console.log(`Listening at: ${PORT}`)
})