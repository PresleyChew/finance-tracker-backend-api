import request from "supertest"
import app from "../src/app.js"


describe("[POSITIVE POST] /accounts" , () => {
    it("Create a new Account", async () => {
        const res = await request(app)
            .post("/accounts")
            .set("Authorization",`Bearer ${token}`)
            .send({
                desc:"Savings Account",
                bank: "DBS",
                accNo: "123456"
            })
        expect(res.status).toBe(201)
        expect(res.body.desc).toBe("Savings Account")
        expect(res.body.bank).toBe("DBS")
        expect(res.body.accNo).toBe("123456")
        expect(res.body.userId).toBe(userId)
    })
})

describe("[POSITIVE GET] /accounts" , () => {
    it("Gets all user accounts",async () => {
        const res = await request(app)
            .get("/accounts")
            .set("Authorization" , `Bearer ${token2}`)
        
        expect(res.status).toBe(200)
        expect(res.body).toEqual(mockAccountsUser2)
    })
    
    it("Get individual user accounts (user2)", async () => {
        const res = await request(app)
            .get("/accounts/3")
            .set("Authorization", `Bearer ${token2}`)
        
            expect(res.status).toBe(200)
            expect(res.body).toEqual(mockAccount3)
    })
})

describe("[POSITIVE PATCH] /accounts", () => {
    const toBeComparedWith = {id:2,desc:"AMENDED THIS DESC",bank:"AMENDED THIS BANK",accNo:"123",userId:2}
    it("Update account2 for user2", async () => {
        const res = await request(app)
            .patch("/accounts/2")
            .set("Authorization", `Bearer ${token2}`)
            .send({
                desc:"AMENDED THIS DESC",bank:"AMENDED THIS BANK",accNo:"123"
            })
        expect(res.status).toBe(200)
        expect(res.body).toEqual(toBeComparedWith)
    })
})

describe("[POSITIVE DELETE] /accounts", () => {
    it("Delete account3 from user2", async () => {
        const res = await request(app)
            .delete("/accounts/3")
            .set("Authorization", `Bearer ${token2}`)

        expect(res.status).toBe(200)
        expect(res.body).toEqual(mockAccount3)

        const getRes = await request(app)
            .get("/accounts/3")
            .set("Authorization", `Bearer ${token2}`)
        
        expect(getRes.status).toBe(404)
    })
})

describe("[NEGATIVE POST] /accounts ", () => {
    it("Create account with missing bank", async () => {
        const res = await request(app)
            .post('/accounts')
            .set('Authorization',`Bearer ${token}`)
            .send({
                desc:"this is meant to fail",
                bank:"",
                accNo:"1234567890"
            })
        
        expect(res.status).toBe(400)
    })

    it("Create account without authorization header" , async () => {
        const res = await request(app)
            .post('/accounts')
            .send({
                desc:"Test will fail",
                bank:"FAILBANK",
                accNo:"123456789010"
            })

        expect(res.status).toBe(401)
    })
})

describe("[NEGATIVE GET] /accounts", () => {
    it("Getting all accounts with no authorization header", async () => {
        const res = await request(app)
            .get('/accounts')
        
        expect(res.status).toBe(401) // Caught by authMiddleware
    })

    it("Getting individual accounts with no authorization header", async () => {
        const res = await request(app)
            .get('/accounts/1')
        
        expect(res.status).toBe(401)
    })

    it("Getting individual account that dont belong to user", async () => {
        const res = await request(app)
            .get('/accounts/2')
            .set("Authorization",`Bearer ${token}`)
        
        expect(res.status).toBe(404)
    })

    it("Getting account that does not exist", async () => {
        const res = await request(app)
            .get('/accounts/100')
            .set("Authorization",`Bearer ${token}`)
        
        expect(res.status).toBe(404)
    })
})

describe("[NEGATIVE PATCH]", () => {
    it("Patching with no authorization header", async () => {
        const res = await request(app)
            .patch('/accounts/2')
            .send({
                desc:"Test"
            })
        expect(res.status).toBe(401)
    })

    it("Patching accounts not under user", async () => {
        const res = await request(app)
            .patch('/accounts/2')
            .set("Authorization",`Bearer ${token}`)
            .send({
                desc:"Test"
            })
        expect(res.status).toBe(404)
    })

    it("Patching non existent account", async () => {
        const res = await request(app)
            .patch('/accounts/1000')
            .set("Authorization",`Bearer ${token}`)
            .send({
                desc:"Test"
            })
        expect(res.status).toBe(404)
    })

})

describe("[NEGATIVE DELETE] /accounts", () => {
    it("Deleting with no authorization header", async () => {
        const res = await request(app)
            .delete('/accounts/1')
        
        expect(res.status).toBe(401)
    })
    it("Deleting account not belonging to user", async () => {
        const res = await request(app)
            .delete('/accounts/2')
            .set("Authorization",`Bearer ${token}`)
        
        expect(res.status).toBe(404)
    })
    it("Deleting non existing account", async () => {
        const res = await request(app)
            .delete('/accounts/1000')
            .set("Authorization",`Bearer ${token}`)
        
        expect(res.status).toBe(404)
    })
})