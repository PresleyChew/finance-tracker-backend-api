import request from "supertest"
import app from "../src/app.js"

describe("[POSITIVE POST] /transactions", () => {
    it("Creates a transaction for account 1 by user 1", async () => {
        const res = await request(app)
            .post('/transactions')
            .set("Authorization",`Bearer ${token}`)
            .send({
                desc: "TEST",
                cost: 11.1,
                category: "TEST",
                accountId:1
            })
        expect(res.status).toBe(201)
        expect(res.body.desc).toBe("TEST")
        expect(res.body.cost).toBe(11.1)
        expect(res.body.category).toBe("TEST")
        expect(res.body.accountId).toBe(1)
        expect(res.body.userId).toBe(userId)
    })
})

describe("[POSITIVE GET] /transactions", () => {
    it("Get a single transaction from user2", async () => {
        const res = await request(app)
            .get('/transactions/3')
            .set("Authorization",`Bearer ${token2}`)
        
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
            id: 3,
            desc: 'TEST TRANSACTION2',
            cost: 123,
            userId: 2,
            accountId: 2,
            category: 'TEST CATEGORY2'
        })
    })

    it("Get all transaction from user2", async () => {
        const res = await request(app)
            .get('/transactions')
            .set("Authorization",`Bearer ${token2}`)
        
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject([{
            desc:'TEST TRANSACTION1',
            cost: 11.1,
            userId: 2,
            category: 'TEST CATEGORY1',
            accountId: 2
        },{
            id: 3,
            desc: 'TEST TRANSACTION2',
            cost: 123,
            userId: 2,
            accountId: 2,
            category: 'TEST CATEGORY2'
        }])
    })
})

describe("[POSITIVE DELETE] /transactions", () => {
    it("Delete transaction from user 2", async () => {
        const res = await request(app)
            .delete('/transactions/3')
            .set("Authorization",`Bearer ${token2}`)
        
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
            id: 3,
            desc: 'TEST TRANSACTION2',
            cost: 123,
            userId: 2,
            accountId: 2,
            category: 'TEST CATEGORY2'
        })
        const getRes = await request(app)
            .get('/transactions/3')
            .set("Authorization",`Bearer ${token}`)
        
        expect(getRes.status).toBe(404)
    })
})

describe("[POSITIVE PATCH /transactions", () => {
    const toBeComparedWith = {id:1,desc:'AMENDED TRANSACTION',cost:6769,userId:1,accountId:1,category:'AMENDED THIS CATEGORY TOO'}
    it("Update an individual transaction for user 1", async () => {
        const res = await request(app)
            .patch('/transactions/1')
            .set("Authorization", `Bearer ${token}`)
            .send({
                desc:'AMENDED TRANSACTION',
                cost:6769,
                category:'AMENDED THIS CATEGORY TOO'
            })
        
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject(toBeComparedWith)
    })
})

describe("[NEGATIVE POST] /transactions" , () => {
    it("Create transaction with missing desc", async () => {
        const res = await request(app)
            .post('/transactions')
            .set("Authorization",`Bearer ${token}`)
            .send({
                desc:"",
                cost:60,
                category:"Test",
                accountId:1
            })
        
        expect(res.status).toBe(400)
    })
    
    it("Create transaction with negative cost", async () => {
        const res = await request(app)
            .post('/transactions')
            .set("Authorization",`Bearer ${token}`)
            .send({
                desc:"test",
                cost:-60,
                category:"Test",
                accountId:1
            })
        
        expect(res.status).toBe(400)
    })
    
    it("Create transaction with accountId not belonging to user", async () => {
        const res = await request(app)
            .post('/transactions')
            .set("Authorization",`Bearer ${token}`)
            .send({
                desc:"test",
                cost:60,
                category:"Test",
                accountId:2
            })
        
        expect(res.status).toBe(404)
    })
    it("Create transaction with no authorization header", async () => {
        const res = await request(app)
            .post('/transactions')
            .send({
                desc:"test",
                cost:60,
                category:"Test",
                accountId:2
            })
        expect(res.status).toBe(401)
    })
})

describe("[NEGATIVE GET] /transactions", () => {
    it("Getting all transactions with no authorization header", async () => {
        const res = await request(app)
            .get('/transactions')
        expect(res.status).toBe(401)
    })

    it("Getting individual transaction. with no authorization header", async () => {
        const res = await request(app)
            .get('/transactions/1')
        expect(res.status).toBe(401)
    })

    it("Getting transaction not belonging to user", async () => {
        const res = await request(app)
            .get('/transactions/2')
            .set("Authorization",`Bearer ${token}`)
        
        expect(res.status).toBe(404)
    })

    it("Getting transaction that does not exist", async () => {
        const res = await request(app)
            .get('/transactions/2000')
            .set("Authorization",`Bearer ${token}`)
        
        expect(res.status).toBe(404)
    })
})

describe("[NEGATIVE DELETE] /transactions", () => {
    it("Deleting with no authorization header", async () => {
        const res = await request(app)
            .delete('/transactions/1')
        expect(res.status).toBe(401)
    })

    it("Deleting transaction not belonging to user", async () => {
        const res = await request(app)
            .delete('/transactions/2')
            .set("Authorization",`Bearer ${token}`)
        
        expect(res.status).toBe(404)
    })
    
    it("Deleting non existing transactions", async () => {
        const res = await request(app)
            .delete('/transactions/2000')
            .set("Authorization",`Bearer ${token}`)
        
        expect(res.status).toBe(404) 
    })
})

describe("[NEGATIVE PATCH] /transactions", () => {
    it("Updating transactions with no authorization header", async () => {
        const res = await request(app)
            .patch('/transactions/1')
            .send({
                desc:'this will fail'
            })
        expect(res.status).toBe(401)
    })

    it("Updating transaction belonging to other users" , async () => {
        const res = await request(app)
            .patch('/transactions/1')
            .set("Authorization",`Bearer ${token2}`)
            .send({
                desc:'this will fail'
            })
        expect(res.status).toBe(404)
    })

    it ("Updating non existing transactions", async () => {
        const res = await request(app)
            .patch('/transactions/100')
            .set("Authorization",`Bearer ${token2}`)
            .send({
                desc:'this will fail'
            })
        expect(res.status).toBe(404)
    })
})