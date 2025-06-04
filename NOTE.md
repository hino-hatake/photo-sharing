# Notes

## I. DB

### Mongo Atlas

Thông tin đăng nhập: `quannt247` / `Dq1F88gxnyw71aYo`

Connect URL:
```
mongodb+srv://quannt247:Dq1F88gxnyw71aYo@photo-sharing.iouobsn.mongodb.net/?retryWrites=true&w=majority&appName=photo-sharing
```

Cài Mongoose:
```sh
npm install mongoose
```

### Load data

```sh
node ./db/dbLoad.js
```

Kết quả:
```
Successfully connected to MongoDB Atlas!
Cleared old data
Adding user: Ian Malcolm with ID new ObjectId('57231f1a30e4351f4e9f4bd7')
Adding user: Ellen Ripley with ID new ObjectId('57231f1a30e4351f4e9f4bd8')
Adding user: Peregrin Took with ID new ObjectId('57231f1a30e4351f4e9f4bd9')
Adding user: Rey Kenobi with ID new ObjectId('57231f1a30e4351f4e9f4bda')
Adding user: April Ludgate with ID new ObjectId('57231f1a30e4351f4e9f4bdb')
Adding user: John Ousterhout with ID new ObjectId('57231f1a30e4351f4e9f4bdc')
Adding photo: malcolm2.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bd7')
Adding photo: malcolm1.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bd7')
Adding photo: ripley1.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bd8')
Adding photo: ripley2.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bd8')
Adding photo: took1.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bd9')
Adding photo: took2.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bd9')
Adding photo: kenobi1.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bda')
Adding photo: kenobi2.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bda')
Adding photo: kenobi3.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bda')
Adding photo: kenobi4.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bda')
Adding photo: ludgate1.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bdb')
Adding photo: ouster.jpg of user ID new ObjectId('57231f1a30e4351f4e9f4bdc')
SchemaInfo object created with version 1.0
Disconnected from MongoDB
```

### Relations

```mermaid
erDiagram
    USERS {
        string _id
        string first_name
        string last_name
        string location
        string description
        string occupation
    }
    PHOTOS {
        string _id
        string file_name
        date date_time
        string user_id
        Comment[] comments
    }
    COMMENTS {
        string comment
        date date_time
        string user_id
    }
    SCHEMAINFO {
        string _id
        string version
        date load_date_time
    }

    USERS ||--o{ PHOTOS : "has"
    PHOTOS ||--|{ COMMENTS : "has"
    USERS ||--o{ COMMENTS : "writes"
```

## II. API

### Cấu trúc thư mục

```
photo-sharing/
│
├── db/
│   ├── userModel.js         # Định nghĩa schema & model User
│   ├── photoModel.js        # Định nghĩa schema & model Photo (và comment)
│   ├── schemaInfo.js        # Định nghĩa schema & model SchemaInfo
│   └── dbLoad.js            # Script nạp dữ liệu mẫu vào MongoDB
│
├── routes/
│   ├── user.js              # Định nghĩa các route liên quan đến user
│   └── photo.js             # Định nghĩa các route liên quan đến photo
│
├── controllers/
│   ├── userController.js    # Xử lý logic cho user API
│   └── photoController.js   # Xử lý logic cho photo API
│
├── app.js                   # Khởi tạo Express app, middleware, kết nối MongoDB
├── package.json
├── .env                     # Thông tin kết nối MongoDB (nếu dùng)
└── REQUIREMENT.md
```

### API cần xây dựng

GET `/user/list`
→ Trả về danh sách user: `_id`, `first_name`, `last_name`.

GET `/user/:id`
→ Trả về chi tiết user: `_id`, `first_name`, `last_name`, `location`, `description`, `occupation`.
→ Nếu id không hợp lệ: HTTP 400 + thông báo lỗi.

GET `/photosOfUser/:id`
→ Trả về tất cả ảnh của user, mỗi ảnh gồm: `_id`, `user_id`, `comments`, `file_name`, `date_time`.
→ Mỗi comment gồm: `comment`, `date_time`, `_id`, `user` (chỉ `_id`, `first_name`, `last_name`).
→ Nếu id không hợp lệ: HTTP 400 + thông báo lỗi.

### Yêu cầu kỹ thuật

- Sử dụng Mongoose để truy vấn và populate dữ liệu.
- Kiểm tra hợp lệ ObjectId.
- Không thay đổi schema hiện tại.
- Tối ưu hiệu suất với async/await hoặc Promise.all.
- Không trả về các trường không cần thiết cho frontend.

### Verify API

Lấy danh sách user (sidebar):
```sh
curl -s http://localhost:3001/user/list | jq
```

Lấy thông tin chi tiết một user (thay <user_id> bằng _id thực tế):
```sh
curl -s http://localhost:3001/user/<user_id> | jq
curl -s http://localhost:3001/user/57231f1a30e4351f4e9f4bdb | jq
```

Lấy tất cả ảnh và comment của một user (thay <user_id> bằng `_id` thực tế):
```sh
curl -s http://localhost:3001/photosOfUser/<user_id> | jq
curl -s http://localhost:3001/photosOfUser/57231f1a30e4351f4e9f4bdb | jq
```

## III. UI

Triển khai hàm `fetchModel`

Vị trí: lib/fetchModelData.js

Chức năng:
- Gửi HTTP GET đến các endpoint backend:
    - /user/list
    - /user/:id
    - /photosOfUser/:id
- Nhận và trả về dữ liệu JSON phù hợp cho frontend.

Ghi chú kỹ thuật:
- Có thể dùng `fetch` hoặc `axios`.
- Xử lý lỗi: Nếu backend trả về HTTP 400 (hoặc lỗi khác), cần trả về thông báo lỗi rõ ràng cho frontend.

Cập nhật các component frontend

Các file cần sửa:
- `/components/UserDetail/index.jsx`: Lấy chi tiết user từ /user/:id
- `/components/UserList/index.jsx`: Lấy danh sách user từ /user/list
- `/components/UserPhotos/index.jsx`: Lấy danh sách ảnh và comment từ /photosOfUser/:id

Yêu cầu:
- Thay thế toàn bộ logic lấy dữ liệu tĩnh/gỉa lập bằng lời gọi fetchModel.
- Đảm bảo dữ liệu trả về từ backend được xử lý đúng để hiển thị trên UI.

Tóm tắt:
- Viết hàm fetchModel nhận endpoint và trả về dữ liệu JSON hoặc lỗi.
- Refactor các component React để sử dụng fetchModel thay vì dữ liệu cứng.
- Đảm bảo xử lý tốt các trường hợp lỗi (ví dụ: id không hợp lệ, backend trả về lỗi).

### Cấu trúc thư mục

```
frontend/
│
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── UserDetail/
│   │   │   └── index.jsx
│   │   ├── UserList/
│   │   │   └── index.jsx
│   │   └── UserPhotos/
│   │       └── index.jsx
│   ├── lib/
│   │   └── fetchModelData.js
│   ├── App.jsx
│   ├── index.js
│   └── styles/
│       └── (các file css/scss nếu có)
│
├── package.json
└── README.md
```

### Khởi tạo

```
npx create-react-app . --template cra-template
npm install axios
npm install react-router-dom
```