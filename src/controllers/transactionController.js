import prisma from '../utils/prismaClient.js'

async function getAll(req,res) {
    const userId = req.userId
    try {
        const transactions = await prisma.transaction.findMany({
            where: {userId}
        })
        res.status(200).json(transactions)
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function getIndiv(req,res) {
    const userId = req.userId
    const id = Number(req.params.id)
    if (!id) {
        return res.status(400).json({error:'Invalid ID Provided'})
    }
    try {
        const indivTransaction = await prisma.transaction.findFirst({
            where: {id, userId}
        })
        if (!indivTransaction) {
            return res.status(404).json({error:'Transaction not found or unauthorized'})
        }
        res.status(200).json(indivTransaction)
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function createTransaction(req,res) {
    const {desc,cost,category,accountId} = req.body
    const userId = req.userId
    try {
        const account = await prisma.account.findFirst({
            where: {id:accountId,userId}
        })
        if (!account) {
            return res.status(404).json({error:'Account provided does not exist or does not belong to requester'})
        }
        const transaction = await prisma.transaction.create({
            data: {
                desc,
                cost,
                category,
                userId,
                accountId
            }
        })
        res.status(201).json(transaction)
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function deleteTransaction(req,res) {
    const userId = req.userId
    const id = Number(req.params.id)
    if (!id) {
        return res.status(400).json({error:'Invalid ID Provided'})
    }
    try {
        const itemToBeDeleted = await prisma.transaction.findFirst({
            where: { id, userId}
        })
        if (!itemToBeDeleted) {
            return res.status(404).json({error:'Transaction not found or unauthorized'})
        }
        const deletedItem = await prisma.transaction.delete({
            where: {id}
        })
        res.status(200).json(deletedItem)
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function editTransaction(req,res) {
    const userId = req.userId
    const id = Number(req.params.id)
    const {desc,cost,category,accountId} = req.body
    if (!id) {
        return res.status(400).json({error:'Invalid ID Provided'})
    }
    try {
        const itemToBeUpdated = await prisma.transaction.findFirst({
            where:{id,userId}
        })
        if (!itemToBeUpdated) {
            return res.status(404).json({error:'Transaction not found or unauthorized'})
        }
        if (accountId) {
            const account = await prisma.account.findFirst({
                where:{id:accountId,userId}
                })
            if(!account) {
                return res.status(404).json({error:'Account provided is incorrect or does not belong to requestor'})
            }
        }
        const updatedItem = await prisma.transaction.update({
            where: {id},
            data: {
                desc: desc ?? itemToBeUpdated.desc,
                cost: cost ?? itemToBeUpdated.cost,
                category: category ?? itemToBeUpdated.category,
                accountId: accountId ?? itemToBeUpdated.accountId
            }
        })
        res.status(200).json(updatedItem)
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

export default {
    getAll,
    getIndiv,
    createTransaction,
    deleteTransaction,
    editTransaction
}