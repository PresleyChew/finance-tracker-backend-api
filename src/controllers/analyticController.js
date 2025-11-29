import prisma from '../utils/prismaClient.js'

async function spentPerAccount(req,res) {
    const userId = req.userId
    const months = Number(req.query.months) || 12
    try {
        const results = await prisma.$queryRaw`
        SELECT
        a.bank AS bank,
        SUM(t.cost) AS "totalSpent"
        FROM "Account" a
        JOIN "Transaction" t
        ON t."accountId" = a.id
        WHERE a."userId" = ${userId}
        AND "createdAt" >= NOW() - (${months} || ' months')::interval
        GROUP BY a.bank
        `
        res.status(200).json(results)
        }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function spentPerCategory(req, res) {
    const userId = req.userId;
    const months = Number(req.query.months) || 1

    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)
    try {
        const results = await prisma.transaction.groupBy({
        by: ['category'],
        where: {
            userId,
            createdAt: {
            gte: startDate,
            lt: endDate
            }
        },
        _sum: { cost: true }
        })

        const formatted = results.map(r => ({
        category: r.category,
        totalSpent: r._sum.cost
        }))

        res.status(200).json(formatted)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


async function totalSpentBySpecificAcc(req,res) {
    const userId = req.userId
    const months = Number(req.query.months) || 12
    const id = Number(req.params.id)
    try {
        const result = await prisma.$queryRaw`
        SELECT
        a.bank as BANK,
        SUM(t.cost) AS "totalSpent"
        FROM "Account" a
        JOIN "Transaction" t
        ON t."accountId" = a.id
        WHERE t."userId" = ${userId} AND t."accountId" = ${id} AND "createdAt" >= NOW() - (${months} || ' months')::interval
        GROUP BY BANK
        `
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function totalSpent(req,res) {
    try {
        const userId = req.userId
        const months = Number(req.query.months) || 12
        const startDate = new Date()
        const endDate = new Date()
        startDate.setMonth(startDate.getMonth()-months)
        const result = await prisma.transaction.aggregate({
            where:{
                userId:userId,
                createdAt:{
                    gte:startDate,
                    lt:endDate
                }
            },
            _sum:{cost:true}
        })
        res.status(200).json({totalSpent:result._sum.cost || 0})
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function topCategories(req,res) {
    try {
        const userId = req.userId
        const months = Number(req.query.months) || 12
        const endDate = new Date()
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth()-months)
        const result = await prisma.transaction.groupBy({
            by:['category'],
            where:{
                userId:userId,
                createdAt:{
                    gte:startDate,
                    lt:endDate
                }
            },
            _sum:{cost:true},
            orderBy: {
                _sum:{cost:'desc'}
            }
        })
        const finalResult = result.map(item => ({
            category:item.category,
            totalSpent:item._sum.cost
        }))
        res.status(200).json(finalResult)
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}

async function accountRankings(req,res) {
    try {
        const userId = req.userId
        const months = Number(req.query.months) || 12
        const result = await prisma.$queryRaw`
        SELECT
        a.bank AS bank,
        SUM(t.cost) AS "totalSpent"
        FROM "Account" a
        JOIN "Transaction" t
        ON t."accountId" = a.id
        WHERE a."userId" = ${userId} AND t."createdAt" >= NOW() - (${months} || ' months')::interval
        GROUP BY a.bank
        ORDER BY "totalSpent" DESC
        `
        res.status(200).json(result)
    }catch(err) {
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
export default {
    spentPerAccount,
    spentPerCategory,
    totalSpentBySpecificAcc,
    totalSpent,
    topCategories,
    accountRankings
}