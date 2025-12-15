import request from "supertest"
import app from "../src/app.js"

describe("[POSITIVE POST] /transaction", () => {
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