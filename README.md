# Backend API Documentation

## Table of Contents
- [Overview](#overview)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [API Routes](#api-routes)
  - [Auth](#auth-routes)
  - [Products](#product-routes)
  - [Categories](#category-routes)
  - [Orders](#order-routes)
- [Data Models](#data-models)
- [Notes & Gotchas](#notes--gotchas)

---

## Overview

**Base URL:** `http://localhost:<PORT>/api`

**Stack:** Node.js · Express · MongoDB (Mongoose) · Cloudinary (image uploads) · JWT Auth

---

## Environment Variables

Create a `.env` file in the project root with the following:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXP=1h

# Cloudinary (image uploads)
CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Important:** `dotenv.config()` must be called at the very top of `index.js` before any other imports that use `process.env`.

---

## Authentication

Protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Two middleware guards exist:

| Middleware | Description |
|---|---|
| `protect` | Verifies JWT token, attaches `req.user` |
| `adminOnly` | Checks `req.user.role === "admin"` |

Roles: `customer` (default) · `admin`

---

## API Routes

---

### Auth Routes
**Base:** `/api/auth`

---

#### `POST /api/auth/register`
Register a new user.

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "firstName": { "en": "John", "ar": "جون" },
  "lastName":  { "en": "Doe",  "ar": "دو"  },
  "email":    "john@example.com",
  "password": "minimum8chars",
  "phone":    "01012345678",
  "location": "Cairo"
}
```

**Response `201`:**
```json
{
  "data": { "_id": "...", "email": "john@example.com", "role": { "en": "customer", "ar": "عميل" } }
}
```

---

#### `POST /api/auth/login`
Login and receive a JWT token.

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "minimum8chars"
}
```

**Response `201`:**
```json
{
  "user": { "_id": "...", "email": "john@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Product Routes
**Base:** `/api/products`

---

#### `GET /api/products`
Get all products. Public.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": { "en": "Burger", "ar": "برجر" },
      "description": { "en": "Tasty", "ar": "لذيذ" },
      "price": 49.99,
      "image": "https://res.cloudinary.com/...",
      "available": true,
      "rating": 8.5,
      "category": { "_id": "...", "name": { "en": "Fast Food" } }
    }
  ]
}
```

---

#### `GET /api/products/:id`
Get a single product by ID. Public.

**Response `200`:** Same as above for a single product.

---

#### `POST /api/products`
Create a new product. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | JSON string | ✅ | `'{"en":"Burger","ar":"برجر"}'` |
| `description` | JSON string | ✅ | `'{"en":"Tasty","ar":"لذيذ"}'` |
| `price` | Number | ✅ | e.g. `49.99` |
| `category` | ObjectId string | ✅ | ID of an existing category |
| `image` | File | ✅ | JPEG, JPG, PNG, or WEBP · max 5MB |
| `available` | Boolean | ❌ | Defaults to `true` |
| `rating` | Number | ❌ | 0–10, defaults to `0` |

> `name` and `description` must be sent as **JSON strings** because the request is `multipart/form-data`.

**Response `201`:**
```json
{
  "success": true,
  "data": { "_id": "...", "name": { "en": "Burger", "ar": "برجر" }, "image": "https://res.cloudinary.com/..." }
}
```

---

#### `PUT /api/products/:id`
Update a product. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Fields:** Same as POST. All fields are optional — only send what you want to update.

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | JSON string | ❌ | `'{"en":"New Name","ar":"اسم جديد"}'` |
| `description` | JSON string | ❌ | `'{"en":"New desc","ar":"وصف جديد"}'` |
| `price` | Number | ❌ | |
| `category` | ObjectId string | ❌ | |
| `image` | File | ❌ | Replaces old image on Cloudinary |
| `available` | Boolean | ❌ | |
| `rating` | Number | ❌ | |

**Response `200`:**
```json
{
  "success": true,
  "data": { "_id": "...", "name": { "en": "New Name" } }
}
```

---

#### `DELETE /api/products/:id`
Delete a product. **Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{ "success": true, "message": "Product deleted successfully" }
```

---

### Category Routes
**Base:** `/api/categories`

---

#### `GET /api/categories`
Get all categories. Public.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": { "en": "Fast Food", "ar": "وجبات سريعة" }, "icon": "🍔" }
  ]
}
```

---

#### `GET /api/categories/:id`
Get a single category by ID. Public.

---

#### `POST /api/categories`
Create a category. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": { "en": "Fast Food", "ar": "وجبات سريعة" },
  "icon": "🍔"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { "_id": "...", "name": { "en": "Fast Food", "ar": "وجبات سريعة" }, "icon": "🍔" }
}
```

---

#### `PUT /api/categories/:id`
Update a category. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": { "en": "Updated Name", "ar": "اسم محدث" },
  "icon": "🍕"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": { "_id": "...", "name": { "en": "Updated Name" } }
}
```

---

#### `DELETE /api/categories/:id`
Delete a category. **Admin only.**

**Response `200`:**
```json
{ "success": true, "message": "Category deleted successfully" }
```

---

### Order Routes
**Base:** `/api/orders`

All order routes require authentication (`protect`).

---

#### `POST /api/orders`
Place a new order. **Authenticated users.**

Prices are fetched from the database automatically — the client only sends product IDs and quantities. A fixed delivery fee of **25** is added automatically.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name":    "John Doe",
  "phone":   "01012345678",
  "address": "123 Main St, Cairo",
  "notes":   "No onions please",
  "payment": "cod",
  "items": [
    { "id": "<product_id>", "quantity": 2 },
    { "id": "<product_id>", "quantity": 1 }
  ]
}
```

**Body Fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | ✅ | Recipient name |
| `phone` | String | ✅ | Contact number |
| `address` | String | ✅ | Delivery address |
| `items` | Array | ✅ | Array of `{ id, quantity }` |
| `payment` | String | ❌ | `"cod"` or `"online"` · defaults to `"cod"` |
| `notes` | String | ❌ | Special instructions |

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "pending",
    "subtotal": 99.98,
    "deliveryFee": 25,
    "total": 124.98,
    "items": [{ "product": "...", "quantity": 2, "price": 49.99 }]
  }
}
```

---

#### `GET /api/orders/my-orders`
Get orders for the logged-in user. **Authenticated users.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "success": true,
  "data": [ /* array of user's orders with populated product details */ ]
}
```

---

#### `GET /api/orders`
Get all orders. **Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "success": true,
  "data": [ /* all orders with populated user and product details */ ]
}
```

---

#### `PATCH /api/orders/:id/status`
Update order status. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{ "status": "confirmed" }
```

**Valid status values:**

| Status | Meaning |
|---|---|
| `pending` | Order placed, awaiting confirmation |
| `confirmed` | Order confirmed by admin |
| `preparing` | Order being prepared |
| `out_for_delivery` | Order on the way |
| `delivered` | Order delivered |
| `cancelled` | Order cancelled |

**Response `200`:**
```json
{
  "success": true,
  "data": { "_id": "...", "status": "confirmed" }
}
```

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `firstName` | `{ en, ar }` | Required |
| `lastName` | `{ en, ar }` | Required |
| `email` | String | Unique, lowercase |
| `password` | String | Min 8 chars, auto-hashed |
| `phone` | String | Optional |
| `role` | `{ en, ar }` | `customer`/`admin` · `عميل`/`ادمن` |
| `location` | String | Optional |

### Product
| Field | Type | Notes |
|---|---|---|
| `name` | `{ en, ar }` | Required |
| `description` | `{ en, ar }` | Required |
| `price` | Number | Required |
| `category` | ObjectId → Category | Required |
| `image` | String | Cloudinary URL |
| `available` | Boolean | Default `true` |
| `rating` | Number | 0–10, default `0` |

### Category
| Field | Type | Notes |
|---|---|---|
| `name` | `{ en, ar }` | Required, unique per language |
| `icon` | String | Required (emoji or icon name) |

### Order
| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId → User | Auto-set from JWT |
| `items` | Array of `{ product, quantity, price }` | Prices locked at order time |
| `name` | String | Recipient name |
| `phone` | String | |
| `address` | String | |
| `notes` | String | Optional |
| `payment` | `cod` \| `online` | Default `cod` |
| `subtotal` | Number | Auto-calculated |
| `deliveryFee` | Number | Fixed at 25 |
| `total` | Number | subtotal + deliveryFee |
| `status` | String | See status values above |

---

## Notes

### Bilingual Fields
`name`, `description` (products/categories) and `firstName`, `lastName` (users) are bilingual objects. Always provide both `en` and `ar` when creating records.

### Product Create/Update — multipart/form-data
Because product routes accept a file upload, the request must be `multipart/form-data`. This means JSON objects like `name` and `description` must be sent as **stringified JSON**:
```
name = '{"en":"Burger","ar":"برجر"}'
```
Not as a nested object.

### Image Uploads
- Handled by **Cloudinary** via `multer-storage-cloudinary`
- Allowed formats: `jpeg`, `jpg`, `png`, `webp`, `avif`
- `req.file.path` returns the full Cloudinary CDN URL, which is stored in the database

### Token Payload
The JWT contains `{ id, role }` where `role` is the English role value (`"customer"` or `"admin"`).