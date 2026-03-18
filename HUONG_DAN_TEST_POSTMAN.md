# HƯỚNG DẪN TEST API INVENTORY TRÊN POSTMAN

## ✅ CHUẨN BỊ

### Bước 1: Kiểm Tra Server Chạy
- Server phải chạy ở: `http://localhost:3000`
- MongoDB phải hoạt động

### Bước 2: Mở Postman
- Tải Postman tại: https://www.postman.com/downloads/
- Hoặc dùng Postman Web: https://web.postman.co/

---

## 🔧 CREAR NEW COLLECTION

1. **Bước 1**: Mở Postman → Click **New** (góc trái)
2. **Bước 2**: Chọn **Collection**
3. **Bước 3**: Đặt tên: `Inventory API`
4. **Bước 4**: Click **Create**

---

## 🧪 CÁC BƯỚC TEST CHI TIẾT

## TEST 1️⃣: TẠO SẢN PHẨM (AUTO TẠO INVENTORY)

### API Endpoint
```
POST http://localhost:3000/api/v1/products
```

### Bước Làm:

1. **Tạo Request Mới**
   - Click **+** hoặc **New** → **Request**
   - Tên: `Create Product`
   - Thêm vào Collection: `Inventory API`

2. **Chọn Method**: `POST`

3. **Nhập URL**: 
   ```
   http://localhost:3000/api/v1/products
   ```

4. **Tab Body**:
   - Chọn **raw** → **JSON**
   - Copy & paste:

```json
{
    "title": "iPhone 15 Pro",
    "price": 999,
    "description": "Flagship smartphone 2024",
    "category": "507f1f77bcf86cd799439011",
    "images": ["https://placeimg.com/640/480/tech"]
}
```

**Lưu Ý**: 
- Replace `507f1f77bcf86cd799439011` với Category ID thực tế (hoặc tạo category trước)
- Hoặc dùng Category ID có sẵn trong DB

5. **Click Send**

### Kết Quả Expected:
```json
{
    "_id": "65f123456789abcdef012345",
    "title": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "price": 999,
    "description": "Flagship smartphone 2024",
    "category": "507f1f77bcf86cd799439011",
    "images": ["https://placeimg.com/640/480/tech"],
    "isDeleted": false,
    "__v": 0
}
```

### ⭐ LƯU Ý:
- **Copy và lưu** `_id` của product (ví dụ: `65f123456789abcdef012345`)
- Bạn sẽ dùng ID này cho các API tiếp theo
- Hệ thống đã tự động tạo Inventory cho sản phẩm này

---

## TEST 2️⃣: LẤY TẤT CẢ INVENTORY

### API Endpoint
```
GET http://localhost:3000/api/v1/inventories
```

### Bước Làm:

1. **Tạo Request Mới**
   - Tên: `Get All Inventories`

2. **Chọn Method**: `GET`

3. **Nhập URL**: 
   ```
   http://localhost:3000/api/v1/inventories
   ```

4. **Không cần Body** (vì là GET)

5. **Click Send**

### Kết Quả Expected:
Bạn sẽ thấy danh sách tất cả inventory:

```json
[
    {
        "_id": "65f234567890abcdef012346",
        "product": {
            "_id": "65f123456789abcdef012345",
            "title": "iPhone 15 Pro",
            "price": 999,
            "description": "Flagship smartphone 2024",
            "images": ["https://placeimg.com/640/480/tech"]
        },
        "stock": 0,
        "reserved": 0,
        "soldCount": 0,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
]
```

### 📝 Ghi Chú:
- Inventory của iPhone bao gồm: `stock=0`, `reserved=0`, `soldCount=0`
- Vì chúng ta vừa tạo sản phẩm
- Tiếp theo sẽ thêm hàng vào stock

---

## TEST 3️⃣: THÊM KHO (ADD STOCK)

### API Endpoint
```
POST http://localhost:3000/api/v1/inventories/add-stock
```

### Bước Làm:

1. **Tạo Request Mới**
   - Tên: `Add Stock`

2. **Chọn Method**: `POST`

3. **Nhập URL**: 
   ```
   http://localhost:3000/api/v1/inventories/add-stock
   ```

4. **Tab Body**:
   - Chọn **raw** → **JSON**
   - Copy & paste (thay PRODUCT_ID):

```json
{
    "product": "65f123456789abcdef012345",
    "quantity": 100
}
```

**Thay `65f123456789abcdef012345` với Product ID từ TEST 1**

5. **Click Send**

### Kết Quả Expected:
```json
{
    "success": true,
    "message": "Stock added successfully",
    "data": {
        "_id": "65f234567890abcdef012346",
        "product": "65f123456789abcdef012345",
        "stock": 100,
        "reserved": 0,
        "soldCount": 0,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
}
```

### ✅ Kiểm Chứng:
- **stock**: 0 → 100 (tăng)
- **reserved**: 0 (không đổi)
- **soldCount**: 0 (không đổi)

---

## TEST 4️⃣: GIẢM KHO (REMOVE STOCK)

### API Endpoint
```
POST http://localhost:3000/api/v1/inventories/remove-stock
```

### Bước Làm:

1. **Tạo Request Mới**
   - Tên: `Remove Stock`

2. **Chọn Method**: `POST`

3. **Nhập URL**: 
   ```
   http://localhost:3000/api/v1/inventories/remove-stock
   ```

4. **Tab Body** - Raw JSON:

```json
{
    "product": "65f123456789abcdef012345",
    "quantity": 5
}
```

5. **Click Send**

### Kết Quả Expected:
```json
{
    "success": true,
    "message": "Stock removed successfully",
    "data": {
        "_id": "65f234567890abcdef012346",
        "product": "65f123456789abcdef012345",
        "stock": 95,
        "reserved": 0,
        "soldCount": 0,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
}
```

### ✅ Kiểm Chứng:
- **stock**: 100 → 95 (giảm 5)

---

## TEST 5️⃣: ĐẶT HÀNG (RESERVATION)

### API Endpoint
```
POST http://localhost:3000/api/v1/inventories/reservation
```

### Bước Làm:

1. **Tạo Request Mới**
   - Tên: `Reservation`

2. **Chọn Method**: `POST`

3. **Nhập URL**: 
   ```
   http://localhost:3000/api/v1/inventories/reservation
   ```

4. **Tab Body** - Raw JSON:

```json
{
    "product": "65f123456789abcdef012345",
    "quantity": 10
}
```

5. **Click Send**

### Kết Quả Expected:
```json
{
    "success": true,
    "message": "Reservation created successfully",
    "data": {
        "_id": "65f234567890abcdef012346",
        "product": "65f123456789abcdef012345",
        "stock": 85,
        "reserved": 10,
        "soldCount": 0,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
}
```

### ✅ Kiểm Chứng:
- **stock**: 95 → 85 (giảm 10 vì khách đặt)
- **reserved**: 0 → 10 (khách đặt 10 cái)
- **soldCount**: 0 (chưa xác nhận bán)

**Ý Nghĩa**: Khách A đặt 10 cái iPhone, hệ thống giữ lại 10 cái khỏi bán được

---

## TEST 6️⃣: XÁC NHẬN BÁN (SOLD)

### API Endpoint
```
POST http://localhost:3000/api/v1/inventories/sold
```

### Bước Làm:

1. **Tạo Request Mới**
   - Tên: `Confirm Sale`

2. **Chọn Method**: `POST`

3. **Nhập URL**: 
   ```
   http://localhost:3000/api/v1/inventories/sold
   ```

4. **Tab Body** - Raw JSON:

```json
{
    "product": "65f123456789abcdef012345",
    "quantity": 10
}
```

5. **Click Send**

### Kết Quả Expected:
```json
{
    "success": true,
    "message": "Sale confirmed successfully",
    "data": {
        "_id": "65f234567890abcdef012346",
        "product": "65f123456789abcdef012345",
        "stock": 85,
        "reserved": 0,
        "soldCount": 10,
        "createdAt": "2024-03-19T10:00:00.000Z"
    }
}
```

### ✅ Kiểm Chứng:
- **stock**: 85 (không đổi)
- **reserved**: 10 → 0 (đã xác nhận, không còn "chờ")
- **soldCount**: 0 → 10 (bán được 10 cái)

**Ý Nghĩa**: Khách A đã xác nhận mua, 10 cái được cộng vào sold count

---

## TEST 7️⃣: LẤY INVENTORY THEO ID

### API Endpoint
```
GET http://localhost:3000/api/v1/inventories/:id
```

### Bước Làm:

1. **Tạo Request Mới**
   - Tên: `Get Inventory By ID`

2. **Chọn Method**: `GET`

3. **Nhập URL** (thay INVENTORY_ID):
   ```
   http://localhost:3000/api/v1/inventories/65f234567890abcdef012346
```

**Lưu Ý**: INVENTORY_ID lấy từ kết quả API trước (trong field `_id` của data)

4. **Click Send**

### Kết Quả Expected:
```json
{
    "_id": "65f234567890abcdef012346",
    "product": {
        "_id": "65f123456789abcdef012345",
        "title": "iPhone 15 Pro",
        "price": 999,
        "description": "Flagship smartphone 2024",
        "images": ["https://placeimg.com/640/480/tech"],
        "category": "507f1f77bcf86cd799439011"
    },
    "stock": 85,
    "reserved": 0,
    "soldCount": 10,
    "createdAt": "2024-03-19T10:00:00.000Z"
}
```

---

## 📊 TÓMBÀI TOÀN BỘ QUY TRÌNH

| Bước | API | Method | Kết Quả |
|------|-----|--------|--------|
| 1 | `POST /products` | POST | Tạo iPhone, stock=0, reserved=0, sold=0 |
| 2 | `GET /inventories` | GET | Xem tất cả inventory (còn trống) |
| 3 | `POST /add-stock` | POST | Thêm 100 cái → stock=100 |
| 4 | `POST /remove-stock` | POST | Giảm 5 cái → stock=95 |
| 5 | `POST /reservation` | POST | Khách đặt 10 → stock=85, reserved=10 |
| 6 | `POST /sold` | POST | Xác nhận bán → reserved=0, soldCount=10 |
| 7 | `GET /inventories/:id` | GET | Xem trạng thái cuối cùng |

---

## 🔁 TEST LẠI (SANITY CHECK)

### Để Test Hoàn Chỉnh:

1. **Chạy lại TEST 7** (Get Inventory By ID)
   - Xem lại kết quả cuối cùng
   - Đảm bảo: `stock=85, reserved=0, soldCount=10`

2. **Chạy Test khác**:
   - Thêm stock 50: `quantity=50`
   - Đặt hàng 20: `quantity=20`
   - Bán 20: `quantity=20`
   - Xem lại kết quả

---

## ⚠️ LỖI THƯỜNG GẶP & GIẢI PHÁP

### Lỗi 1: "404 Not Found"
**Nguyên Nhân**: URL sai hoặc server không chạy
**Giải Pháp**: 
- Kiểm tra lại URL
- Chắc chắn `npm start` đã chạy
- MongoDB phải hoạt động

### Lỗi 2: "Stock is insufficient"
**Nguyên Nhân**: Giảm quá nhiều hàng
**Giải Pháp**: 
- Thêm hàng trước, sau đó mới giảm
- Kiểm tra số lượng hiện tại

### Lỗi 3: "Reserved quantity is insufficient"
**Nguyên Nhân**: Xác nhận bán nhiều hơn số đặt
**Giải Pháp**: 
- Phải đặt hàng trước (Reservation)
- Sau đó mới xác nhận bán
- Số lượng xác nhận ≤ số lượng đặt

### Lỗi 4: "Missing product or quantity"
**Nguyên Nhân**: Quên body request hoặc JSON sai
**Giải Pháp**: 
- Kiểm tra Body tab có dữ liệu không
- Kiểm tra JSON format (dấu ngoặc, dấu phẩy)

---

## 💾 SAVE COLLECTION

Để lưu Collection:
1. Click Collection → **...** (3 dấu chấm)
2. Chọn **Export**
3. Format: **Collection v2.1**
4. Lưu file `.json`

Để Import lại:
1. Click **Import** (góc trái)
2. Chọn file `.json` đã lưu

---

## 📸 CÁCH TẠO WORD VỚI HÌNH ẢNH

### Bước 1: Chụp Ảnh Từng API
- Mở Postman
- Chụp ảnh của từng request (Request, Body, Response)
- Lưu với tên: `test1_create_product.png`, `test2_add_stock.png` vv...

### Bước 2: Tạo Document Word
1. Mở Microsoft Word
2. Tạo Heading: "TEST 1: Create Product"
3. Paste ảnh Request
4. Thêm text: "Body"
5. Paste JSON body
6. Thêm text: "Response"
7. Paste ảnh Response
8. Lặp lại cho 6 test khác

### Bước 3: Export PDF
- File → Export as PDF

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Tạo Collection `Inventory API` trong Postman
- [ ] Tạo 7 requests
- [ ] Chạy test 1: Create Product (lưu Product ID)
- [ ] Chạy test 2: Get All Inventories
- [ ] Chạy test 3: Add Stock (quantity=100)
- [ ] Chạy test 4: Remove Stock (quantity=5)
- [ ] Chạy test 5: Reservation (quantity=10)
- [ ] Chạy test 6: Sold (quantity=10)
- [ ] Chạy test 7: Get Inventory By ID
- [ ] Chụp ảnh tất cả kết quả
- [ ] Tạo file Word với hình ảnh
- [ ] Export PDF

---

**Chúc bạn test thành công! 🎉**
