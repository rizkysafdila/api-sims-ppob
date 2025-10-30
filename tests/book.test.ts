import supertest from "supertest"
import app from "../src/main"
import { IBook } from "../src/types/book.type"
import { UUID } from "crypto"

let bookId: UUID
let token: string

beforeAll(async () => {
  const res = await supertest(app).post("/api/auth/login").send({
    username: "admin",
    password: "password",
  })

  expect(res.status).toBe(200)
  token = res.body.data.token
})

describe("POST /api/books", () => {
  it("should create a new book", async () => {
    const res = await supertest(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Book Title",
        author: "Test Author",
        year: 2017,
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty("id")
    bookId = res.body.data.id
  })

  it("should fail when required fields are missing", async () => {
    const res = await supertest(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "Unknown Author",
      })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBeDefined()
  })
})

describe("GET /api/books", () => {
  it("should fetch all books", async () => {
    const res = await supertest(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it("should filter books by title", async () => {
    const res = await supertest(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .query({ title: "Test Book Title" })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
    res.body.data.forEach((book: IBook) => {
      expect(book.title).toBe("Test Book Title")
    })
  })

  it("should filter books by author", async () => {
    const res = await supertest(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .query({ author: "Test Author" })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
    res.body.data.forEach((book: IBook) => {
      expect(book.author).toBe("Test Author")
    })
  })

  it("should filter books by year", async () => {
    const res = await supertest(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .query({ year: 2017 })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
    res.body.data.forEach((book: IBook) => {
      expect(book.year).toBe(2017)
    })
  })

  it("should filter books by multiple fields", async () => {
    const res = await supertest(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .query({ author: "Test Author", year: 2017 })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
    res.body.data.forEach((book: IBook) => {
      expect(book.author).toBe("Test Author")
      expect(book.year).toBe(2017)
    })
  })

  it("should return empty array when no books match filters", async () => {
    const res = await supertest(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .query({ author: "Non Existent", year: 1800 })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBe(0)
  })
})

describe("GET /api/books/:id", () => {
  it("should fetch book by id", async () => {
    const res = await supertest(app)
      .get(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty("id", bookId)
  })

  it("should return 404 if book not found", async () => {
    const res = await supertest(app)
      .get("/api/books/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe("Book not found")
  })
})

describe("PUT /api/books/:id", () => {
  it("should update a book", async () => {
    const res = await supertest(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Clean Code Revised",
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.title).toBe("Clean Code Revised")
  })

  it("should return 404 if updating non-existent book", async () => {
    const res = await supertest(app)
      .put("/api/books/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Does Not Exist",
      })

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe("Book not found")
  })
})

describe("DELETE /api/books/:id", () => {
  it("should delete a book", async () => {
    const res = await supertest(app)
      .delete(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe("Book deleted successfully")
  })

  it("should return 404 if deleting non-existent book", async () => {
    const res = await supertest(app)
      .delete("/api/books/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe("Book not found")
  })
})
