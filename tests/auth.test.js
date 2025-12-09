import request from "supertest"
import app from "../src/app.js"

describe("[Positive] Test Auth Routes", () => {
  it ("Create a new user", async () => {
    const res = await request(app)
        .post("/auth/register")
        .send({ username: "test2@example.com", password:"testing123@@@@"})
    expect(res.status).toBe(201) // Successful creation
    expect(res.body.token).toBeDefined()
  })

  it("Login with correct credentials", async () => {
    const res = await request(app)
        .post("/auth/login")
        .send({ username: "test2@example.com", password: "testing123@@@@" })

    expect(res.status).toBe(200) // OK Authenticated
    expect(res.body.token).toBeDefined()
  })
  
})

describe("[Negative] Test Auth Routes", () => {
    it("Register with existing user", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ username: "test@example.com" , password: "testtesttesttest"})

    expect(res.status).toBe(409) // Should be code 409 for existing users
    expect(res.body.token).toBeUndefined() // Should not return a token
    })

    it("Login with non-existing user", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ username: "nonexistent@example.com", password: "nonexist"})

    expect(res.status).toBe(404) // Should be code 404 for nonexisting users
    expect(res.body.token).toBeUndefined()
    })

    it("Login with incorrect credentials", async() => {
        const res = await request(app)
            .post("/auth/login")
            .send({ username:"test@example.com", password:"InvalidPassword"})

        expect(res.status).toBe(401) // Should be code 401 for invalid credentials
        expect(res.body.token).toBeUndefined()
    })

    it("Register with empty username", async() => {
        const res = await request(app)
            .post("/auth/register")
            .send({username:"", password:"Testing1234567"})

        expect(res.status).toBe(400) // Bad request
        expect(res.body.token).toBeUndefined()
    })

    it("Register with less than 8 character password", async() => {
        const res = await request(app)
            .post("/auth/register")
            .send({username:"test3@example.com", password:""})

        expect(res.status).toBe(400)
        expect(res.body.token).toBeUndefined()
    })

    it("Register with empty username and less than 8 character password", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({username:"",password:""})
        
        expect(res.status).toBe(400)
        expect(res.body.token).toBeUndefined()
    })

    it("Login with empty username", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({username:"", password:"testing123"})
        expect(res.status).toBe(400)
        expect(res.body.token).toBeUndefined()
    })

    it("Login with empty password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({username:"test@example.com",password:""})
        expect(res.status).toBe(400)
        expect(res.body.token).toBeUndefined()
    })

    it("Login with empty username and empty password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({username:"",password:""})
        expect(res.status).toBe(400)
        expect(res.body.token).toBeUndefined()
    })
})