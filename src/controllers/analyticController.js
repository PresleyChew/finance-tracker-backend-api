import prisma from '../utils/prismaClient.js'

async function spentPerAccount(req,res) {
    const userId = req.userId
    try {
        const results = await prisma.$queryRaw`
        SELECT
        a.bank AS bank,
        SUM(t.cost) AS "totalSpent"
        FROM "Account" a
        JOIN "Transaction" t
        ON t."accountId" = a.id
        WHERE a."userId" = ${userId}
        GROUP BY a.bank
        `
        res.status(200).json(results)
        }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function spentPerCategory(req,res) {
    const userId = req.userId
    try {
        const results = await prisma.transaction.groupBy({
            by:['category'],
            where: {userId},
            _sum: {cost:true}
        })
        const formatted = results.map(r => ({
            category: r.category,
            cost: r._sum.cost
        }));
        res.status(200).json(formatted)
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})    
    }
}

async function totalSpentBySpecificAcc(req,res) {
    const userId = req.userId
    const id = Number(req.params.id)
    try {
        const result = await prisma.$queryRaw`
        SELECT
        a.bank as BANK,
        SUM(t.cost) AS "totalSpent"
        FROM "Account" a
        JOIN "Transaction" t
        ON t."accountId" = a.id
        WHERE t."userId" = ${userId} AND t."accountId" = ${id}
        GROUP BY BANK
        `
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
export default {
    spentPerAccount,
    spentPerCategory,
    totalSpentBySpecificAcc
}