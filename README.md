# GreatDayHR Technical Test by Muhammad Rizky Safdila
## API Book Manager

A simple **REST API** built with **Node.js, Typescript, Express, Sequelize, MySQL, and Simple JWT Authentication**.  
This API provides CRUD operations for managing books with standardized responses, request validation (Zod), and modular architecture.

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/rizkysafdila/api-book-manager.git

cd api-book-manager
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run the migration and seeder
Make sure you have MySQL running, then run:
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4. Run the project

```bash
pnpm dev
```

Open [http://localhost:4000](http://localhost:4000) with your Postman to try the endpoints.

## 📡 API Endpoints
| Method | Endpoint          | Description     | Auth Required |
| ------ | ----------------- | --------------- | ------------- |
| POST   | `/api/auth/login` | Login (get JWT) | ❌             |
| POST   | `/api/books`      | Create book     | ✅             |
| GET    | `/api/books`      | Get all books   | ✅             |
| GET    | `/api/books/:id`  | Get book by id  | ✅             |
| PUT    | `/api/books/:id`  | Update book     | ✅             |
| DELETE | `/api/books/:id`  | Delete book     | ✅             |

## 🧪 Running Tests
Run the test to check all api endpoints are works
```bash
pnpm test
```

## 🔑 Example Auth
1. Login to get a token:
```bash
POST /api/auth/login
{
  "username": "admin",
  "password": "password"
}
```

2. Use the token in request header:
```bash
Authorization: Bearer <token>
```
