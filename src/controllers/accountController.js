import prisma from '../utils/prismaClient.js'

async function getAll(req,res) {
    const userId = req.userId
    try {
        const allAccounts = await prisma.account.findMany({
            where: {
                userId:userId
            }
        })
        res.status(200).json(allAccounts)
    }catch (err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function getIndiv(req,res) {
    const id = Number(req.params.id)
    const userId = req.userId
    if (!id) {
        return res.status(400).json({error:'Invalid ID provided'})
    }
    try {
        const IndivAcc = await prisma.account.findUnique({
            where: {
                id:id,
            }
        })
        if (!IndivAcc || IndivAcc.userId !== userId) {
            return res.status(404).json({error:'Account not found or unauthorized'})
        }
        res.status(200).json(IndivAcc)
    } catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function createAccount(req,res) {
    const userId = req.userId
    const {desc,bank,accNo} = req.body
    try {
        const account = await prisma.account.create({
            data: {
                desc:desc,
                bank:bank,
                accNo:accNo,
                userId:userId
            }
        })
        res.status(201).json(account)
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function updateIndivAccount(req,res) {
    const id = Number(req.params.id)
    const userId = req.userId
    const { desc, bank, accNo } = req.body
    if (!id) {
        return res.status(400).json({error:'Invalid ID provided'})
    }
    try {
        const accountToBePatched = await prisma.account.findUnique({
            where: {
                id
            }
        })
        if (!accountToBePatched || accountToBePatched.userId !== userId) {
            return res.status(404).json({error:'Account not found or unauthorized'})
        }
        const updatedAccount = await prisma.account.update({
            where: {id},
            data: {
                desc: desc ?? accountToBePatched.desc,
                bank: bank ?? accountToBePatched.bank,
                accNo: accNo ?? accountToBePatched.accNo
            }
        })
        res.status(200).json(updatedAccount)
    } catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function deleteIndivAccount(req,res) {
    const id = Number(req.params.id)
    const userId = req.userId
    if (!id) {
        return res.status(400).json({error:'Invalid ID provided'})
    }
    try {
        const accToBeDeleted = await prisma.account.findUnique({
            where: {
                id:id
            }
        })
        if (!accToBeDeleted || accToBeDeleted.userId !== userId) {
            return res.status(404).json({error:'Account not found or unauthorized'})
        }
        const accDeleted = await prisma.account.delete({
            where: {
                id:id
            }
        })
        res.status(200).json(accDeleted)
    } catch (err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

export default {
    getAll,
    getIndiv,
    createAccount,
    updateIndivAccount,
    deleteIndivAccount
}