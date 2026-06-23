---

## 🔐 Authentication Routes

### Base URL: `/api/auth`

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login user and return JWT |

---

## 🛒 Product Routes

### Base URL: `/api/products`

| Method | Endpoint | Access | Description                        |
| ------ | -------- | ------ | ---------------------------------- |
| GET    | `/`      | Public | Get all products                   |
| GET    | `/:id`   | Public | Get product by ID                  |
| POST   | `/`      | Admin  | Create product (with image upload) |
| PUT    | `/:id`   | Admin  | Update product                     |
| DELETE | `/:id`   | Admin  | Delete product                     |

### Notes:

- Image upload handled via `Multer`
- Requires `Authorization: Bearer <token>` for admin actions

---

## 📦 Order Routes

### Base URL: `/api/orders`

| Method | Endpoint      | Access | Description               |
| ------ | ------------- | ------ | ------------------------- |
| POST   | `/`           | User   | Create new order          |
| GET    | `/my-orders`  | User   | Get logged-in user orders |
| GET    | `/`           | Admin  | Get all orders            |
| PATCH  | `/:id/status` | Admin  | Update order status       |

---

## 🗂️ Category Routes

### Base URL: `/api/categories`

| Method | Endpoint | Access | Description        |
| ------ | -------- | ------ | ------------------ |
| POST   | `/`      | Admin  | Create category    |
| GET    | `/`      | Public | Get all categories |
| GET    | `/:id`   | Public | Get category by ID |
| PUT    | `/:id`   | Admin  | Update category    |
| DELETE | `/:id`   | Admin  | Delete category    |

---

## 🔐 Middleware

### `protect`

- Verifies JWT token
- Attaches user to `req.user`

### `adminOnly`

- Restricts access to admin users only

### `upload`

- Handles image uploads using Multer

---

## 🧾 Example Request (Create Product)

```http
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
