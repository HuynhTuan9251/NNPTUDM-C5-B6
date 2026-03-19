# Hướng Dẫn Sử Dụng API Inventory Trên Postman

## 📋 Nội Dung
1. [Giới Thiệu](#giới-thiệu)
2. [Các Function API](#các-function-api)
3. [Hướng Dẫn Chi Tiết Từng API](#hướng-dẫn-chi-tiết-từng-api)
4. [Luồng Hoạt Động](#luồng-hoạt-động)

---

## Giới Thiệu

Hệ thống Inventory được thiết kế để quản lý kho hàng sau:
- **Stock (Kho)**: Số lượng sản phẩm có sẵn
- **Reserved (Đã Đặt)**: Số lượng sản phẩm được đặt hàng nhưng chưa xác nhận
- **Sold Count (Đã Bán)**: Số lượng sản phẩm đã bán

### Công Nghệ Sử Dụng
- Node.js + Express
- MongoDB
- Postman (để test API)

---

## Các Function API

| STT | Function | Method | Endpoint | Mô Tả |
|-----|----------|--------|----------|-------|
| 1 | Get All Inventories | GET | `/api/v1/inventories` | Lấy tất cả inventory |
| 2 | Get Inventory By ID | GET | `/api/v1/inventories/:id` | Lấy inventory theo ID (kèm thông tin sản phẩm) |
| 3 | Add Stock | POST | `/api/v1/inventories/add-stock` | Thêm số lượng kho |
| 4 | Remove Stock | POST | `/api/v1/inventories/remove-stock` | Giảm số lượng kho |
| 5 | Reservation | POST | `/api/v1/inventories/reservation` | Đặt hàng (giảm stock, tăng reserved) |
| 6 | Sold | POST | `/api/v1/inventories/sold` | Xác nhận đơn hàng (giảm reserved, tăng soldCount) |

---

## Hướng Dẫn Chi Tiết Từng API

### Bước 1: Tạo Một Sản Phẩm (Prerequisite)

Trước tiên, bạn cần tạo một sản phẩm để có được `product._id`. Khi tạo sản phẩm, hệ thống sẽ tự động tạo một inventory tương ứng.

**Request:**
```
POST /api/v1/products
Content-Type: application/json

{
    "title": "iPhone 15 Pro",
    "price": 999,
    "description": "Điện thoại thông minh cao cấp",
    "category": "CATEGORY_ID",
    "images": ["https://placeimg.com/640/480/any"]
}
```

**Response Example:**
```json
{
    "_id": "65f123456789abcdef012345",
    "title": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "price": 999,
    "description": "Điện thoại thông minh cao cấp",
    "category": "CATEGORY_ID",
    "images": ["https://placeimg.com/640/480/any"],
    "isDeleted": false,
    "__v": 0
}
```

**Lưu ý:** Lưu lại `_id` của sản phẩm, bạn sẽ dùng nó cho các API inventory.

---

### API 1️⃣: Get All Inventories (Lấy Tất Cả Inventory)

Lấy danh sách tất cả inventory cùng với thông tin sản phẩm liên quan.

**Method:** `GET`  
**Endpoint:** `http://localhost:3000/api/v1/inventories`

**Headers:**
```
Content-Type: application/json
```

**Request:** Không cần body

**Response Example:**
```json
[
    {
        "_id": "65f234567890abcdef012346",
        "product": {
            "_id": "65f123456789abcdef012345",
            "title": "iPhone 15 Pro",
            "price": 999,
            "description": "Điện thoại thông minh cao cấp",
            "images": ["https://placeimg.com/640/480/any"]
        },
        "stock": 50,
        "reserved": 0,
        "soldCount": 0,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
]
```

---

### API 2️⃣: Get Inventory By ID (Lấy Inventory Theo ID)

Lấy thông tin chi tiết inventory của một sản phẩm, kèm theo thông tin sản phẩm.

**Method:** `GET`  
**Endpoint:** `http://localhost:3000/api/v1/inventories/65f234567890abcdef012346`

**Replace `65f234567890abcdef012346` với inventory ID thực tế**

**Headers:**
```
Content-Type: application/json
```

**Request:** Không cần body

**Response Example:**
```json
{
    "_id": "65f234567890abcdef012346",
    "product": {
        "_id": "65f123456789abcdef012345",
        "title": "iPhone 15 Pro",
        "price": 999,
        "description": "Điện thoại thông minh cao cấp",
        "images": ["https://placeimg.com/640/480/any"],
        "category": "65f111111111111111111111"
    },
    "stock": 50,
    "reserved": 0,
    "soldCount": 0,
    "createdAt": "2024-03-19T10:00:00.000Z"
}
```

---

### API 3️⃣: Add Stock (Thêm Kho)

Tăng số lượng hàng trong kho.

**Method:** `POST`  
**Endpoint:** `http://localhost:3000/api/v1/inventories/add-stock`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "product": "65f123456789abcdef012345",
    "quantity": 50
}
```

**Parameters:**
- `product` (string): ID của sản phẩm
- `quantity` (number): Số lượng cần thêm (phải > 0)

**Response Example (Success):**
```json
{
    "success": true,
    "message": "Stock added successfully",
    "data": {
        "_id": "65f234567890abcdef012346",
        "product": "65f123456789abcdef012345",
        "stock": 50,
        "reserved": 0,
        "soldCount": 0,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
}
```

**Response Example (Error):**
```json
{
    "message": "Quantity must be greater than 0"
}
```

---

### API 4️⃣: Remove Stock (Giảm Kho)

Giảm số lượng hàng trong kho (khi hàng bị hỏng hoặc mất).

**Method:** `POST`  
**Endpoint:** `http://localhost:3000/api/v1/inventories/remove-stock`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "product": "65f123456789abcdef012345",
    "quantity": 5
}
```

**Parameters:**
- `product` (string): ID của sản phẩm
- `quantity` (number): Số lượng cần giảm (phải > 0)

**Response Example (Success):**
```json
{
    "success": true,
    "message": "Stock removed successfully",
    "data": {
        "_id": "65f234567890abcdef012346",
        "product": "65f123456789abcdef012345",
        "stock": 45,
        "reserved": 0,
        "soldCount": 0,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
}
```

**Response Example (Error):**
```json
{
    "message": "Stock is insufficient"
}
```

---

### API 5️⃣: Reservation (Đặt Hàng)

Khi khách hàng đặt hàng, stock sẽ giảm và reserved sẽ tăng.

**Method:** `POST`  
**Endpoint:** `http://localhost:3000/api/v1/inventories/reservation`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "product": "65f123456789abcdef012345",
    "quantity": 10
}
```

**Parameters:**
- `product` (string): ID của sản phẩm
- `quantity` (number): Số lượng đặt hàng (phải > 0)

**Response Example (Success):**
```json
{
    "success": true,
    "message": "Reservation created successfully",
    "data": {
        "_id": "65f234567890abcdef012346",
        "product": "65f123456789abcdef012345",
        "stock": 35,
        "reserved": 10,
        "soldCount": 0,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
}
```

**Giải Thích:**
- Stock giảm từ 45 → 35 (đặt 10 sản phẩm)
- Reserved tăng từ 0 → 10 (10 sản phẩm đang chờ xác nhận)

**Response Example (Error):**
```json
{
    "message": "Stock is insufficient for reservation"
}
```

---

### API 6️⃣: Sold (Xác Nhận Bán)

Khi đơn hàng được xác nhận, reserved sẽ giảm và soldCount sẽ tăng.

**Method:** `POST`  
**Endpoint:** `http://localhost:3000/api/v1/inventories/sold`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "product": "65f123456789abcdef012345",
    "quantity": 10
}
```

**Parameters:**
- `product` (string): ID của sản phẩm
- `quantity` (number): Số lượng xác nhận bán (phải > 0)

**Response Example (Success):**
```json
{
    "success": true,
    "message": "Sale confirmed successfully",
    "data": {
        "_id": "65f234567890abcdef012346",
        "product": "65f123456789abcdef012345",
        "stock": 35,
        "reserved": 0,
        "soldCount": 10,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
}
```

**Giải Thích:**
- Reserved giảm từ 10 → 0 (đã xác nhận 10 sản phẩm)
- Sold Count tăng từ 0 → 10 (bán được 10 sản phẩm)

**Response Example (Error):**
```json
{
    "message": "Reserved quantity is insufficient"
}
```

---

## Luồng Hoạt Động

### 📊 Sơ Đồ Luồng

```
┌─────────────────────────────────────────────────────┐
│          TẠPROD PHẨM (Auto tạo Inventory)           │
│  POST /api/v1/products                              │
│  → Tự động tạo Inventory với:                       │
│     stock=0, reserved=0, soldCount=0                │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  INVENTORY CÓ SẴN│
        │  stock: 0       │
        │  reserved: 0    │
        │  soldCount: 0   │
        └────────┬────────┘
                 │
    ┌────────────────────────────┐
    │   QUẢN LÝ KHO GỬI HÀNG     │
    └────────────────────────────┘
                 │
    ┌────────────▼────────────────┐
    │  Add Stock                  │
    │  POST /add-stock            │
    │  {product, quantity: 50}    │
    └────────────┬────────────────┘
                 │
       ┌─────────▼──────────┐
       │ stock: 50          │
       │ reserved: 0        │
       │ soldCount: 0       │
       └─────────┬──────────┘
                 │
    ╔════════════════════════════╗
    ║ SỞ ĐỀ ĐẶT HÀNG            ║
    ║ (Customer đặt hàng)         ║
    ║ POST /reservation           ║
    ║ {product, quantity: 10}     ║
    ╚═════┬══════════════════════╝
          │
    ┌─────▼──────────────────┐
    │ stock: 40 (giảm)       │
    │ reserved: 10 (tăng)    │
    │ soldCount: 0           │
    └─────┬──────────────────┘
          │
    ╔═════▼══════════════════════╗
    ║ ĐÓN HÀNG ĐÃ XÁC NHẬN       ║
    ║ POST /sold                  ║
    ║ {product, quantity: 10}     ║
    ╚═════┬══════════════════════╝
          │
    ┌─────▼──────────────────┐
    │ stock: 40 (không đổi)  │
    │ reserved: 0 (giảm)     │
    │ soldCount: 10 (tăng)   │
    └────────────────────────┘
```

### 🔄 Quy Trình Chi Tiết

#### Bước 1: Tạo Sản Phẩm
```
1. POST /api/v1/products
   Kết quả: Tạo product (lấy ID)
   → Hệ thống tự động tạo Inventory với stock=0
```

#### Bước 2: Nhập Hàng (Thêm Kho)
```
2. POST /api/v1/inventories/add-stock
   {
       "product": "PRODUCT_ID",
       "quantity": 50
   }
   Kết quả:
   - stock: 0 → 50
   - reserved: 0
   - soldCount: 0
```

#### Bước 3: Khách Đặt Hàng
```
3. POST /api/v1/inventories/reservation
   {
       "product": "PRODUCT_ID",
       "quantity": 10
   }
   Kết quả:
   - stock: 50 → 40 (giảm vì chứa hàng được đặt)
   - reserved: 0 → 10 (khách đã đặt 10 cái)
   - soldCount: 0 (chưa xác nhận bán)
```

#### Bước 4: Xác Nhận Bán
```
4. POST /api/v1/inventories/sold
   {
       "product": "PRODUCT_ID",
       "quantity": 10
   }
   Kết quả:
   - stock: 40 (không thay đổi)
   - reserved: 10 → 0 (hàng đã xác nhận, không còn "chờ xác nhận")
   - soldCount: 0 → 10 (bán được 10 cái)
```

#### Bước 5: Xem Trạng Thái Kho
```
5. GET /api/v1/inventories/INVENTORY_ID
   Kết quả: Xem tất cả thông tin kho hiện tại
```

---

## 📝 Ví Dụ Thực Tế

### Tình Huống: Bán iPhone 15 Pro

**1. Tạo Sản Phẩm**
```bash
POST http://localhost:3000/api/v1/products
{
    "title": "iPhone 15 Pro",
    "price": 999,
    "description": "Flagship điện thoại",
    "category": "507f1f77bcf86cd799439011",
    "images": ["https://example.com/iphone15pro.jpg"]
}

Response: _id = "65f123456789abcdef012345"
→ Tự động tạo Inventory với ID: "65f234567890abcdef012346"
  stock: 0, reserved: 0, soldCount: 0
```

**2. Nhập 100 cái iPhone vào kho**
```bash
POST http://localhost:3000/api/v1/inventories/add-stock
{
    "product": "65f123456789abcdef012345",
    "quantity": 100
}

Result:
stock: 100, reserved: 0, soldCount: 0
```

**3. Khách A đặt 5 cái iPhone (ngày 19/03)**
```bash
POST http://localhost:3000/api/v1/inventories/reservation
{
    "product": "65f123456789abcdef012345",
    "quantity": 5
}

Result:
stock: 95, reserved: 5, soldCount: 0
(Kho còn 95, chỉnh dành 5 cho khách A)
```

**4. Khách B đặt 3 cái iPhone**
```bash
POST http://localhost:3000/api/v1/inventories/reservation
{
    "product": "65f123456789abcdef012345",
    "quantity": 3
}

Result:
stock: 92, reserved: 8, soldCount: 0
(Kho còn 92, chỉnh dành 8 cho cả A và B)
```

**5. Xác nhận bán cho Khách A (5 cái)**
```bash
POST http://localhost:3000/api/v1/inventories/sold
{
    "product": "65f123456789abcdef012345",
    "quantity": 5
}

Result:
stock: 92, reserved: 3, soldCount: 5
(Bán được 5, còn dành cho B là 3)
```

**6. Xác nhận bán cho Khách B (3 cái)**
```bash
POST http://localhost:3000/api/v1/inventories/sold
{
    "product": "65f123456789abcdef012345",
    "quantity": 3
}

Result:
stock: 92, reserved: 0, soldCount: 8
(Bán được tổng 8 cái, không có đơn chờ xác nhận)
```

---

## ⚙️ Cài Đặt Postman

### 1. Tạo Request Collection

1. Mở Postman
2. Click **New** → **Collection**
3. Đặt tên: "Inventory API"
4. Click **Create**

### 2. Tạo Requests

Tạo 6 request cho 6 API theo hướng dẫn chi tiết ở trên.

### 3. Lưu Biến Môi Trường

Để tiện lợi, bạn có thể lưu biến:

1. Click **Environments** → **Create**
2. Thêm các biến:
   - `base_url`: `http://localhost:3000`
   - `product_id`: `65f123456789abcdef012345`
   - `inventory_id`: `65f234567890abcdef012346`

3. Sử dụng trong requests: `{{base_url}}/api/v1/inventories/{{product_id}}`

---

## 🔍 Kiểm Tra Lỗi

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-----------|----------|
| 404 Not Found | API endpoint sai | Kiểm tra lại URL |
| 400 Bad Request | Thiếu `product` hoặc `quantity` | Kiểm tra request body |
| "Stock is insufficient" | Không đủ hàng để giảm | Thêm được trước |
| "Quantity must be greater than 0" | Quantity ≤ 0 | Nhập quantity > 0 |
| "Reserved quantity is insufficient" | Không đủ hàng đặt để xác nhận | Kiểm tra số lượng reserved |

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra lại console của Node.js xem có lỗi gì
2. Đảm bảo MongoDB đang chạy
3. Kiểm tra lại request body format

---

**Chúc bạn thử nghiệm vui vẻ! 🚀**
