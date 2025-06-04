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

Code và chạy ứng dụng:
```sh
npm start
```
Mở trình duyệt tại http://localhost:3000

### Verify UI

Chưa có css hay tailwind, giao diện khá thô sơ như sau:

![alt text](ui-basic.png)

## IV. Simple Login

### Mục tiêu

- Thêm chức năng đăng nhập cho ứng dụng.
- Chỉ cho phép truy cập các trang chính khi đã đăng nhập.
- Hiển thị thông tin người dùng đã đăng nhập và cho phép logout.

### Backend

Xác thực theo stateless, không lưu session trên server, dùng JWT.

```sh
npm install jsonwebtoken
```

Gen JWT_SECRET và đưa vào file `.env`.

Tạo route `/admin/login` (trả về **JWT token** nếu login thành công) và `/admin/logout`.

Tạo **middleware** xác thực JWT, bảo vệ tất cả API (trừ `/admin/login`, `/admin/logout`).

### Cách verify backend

Login:
```sh
curl -sX POST http://localhost:3001/admin/login \
  -H "Content-Type: application/json" \
  -d '{"login_name":"<login_name>"}'
curl -sX POST http://localhost:3001/admin/login \
  -H "Content-Type: application/json" \
  -d '{"login_name": "Ian Malcolm"}' | jq
```

Login xong response trả về có dạng như sau:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1NzIzMWYxYTMwZTQzNTFmNGU5ZjRiZDciLCJmaXJzdF9uYW1lIjoiSWFuIiwibGFzdF9uYW1lIjoiTWFsY29sbSIsImlhdCI6MTc0OTA1ODYxNiwiZXhwIjoxNzQ5MDY1ODE2fQ.hOz-qk3EEhreT8CpIru9ZN7lBRz93KuHPSaSE18Ef64",
  "user": {
    "_id": "57231f1a30e4351f4e9f4bd7",
    "first_name": "Ian",
    "last_name": "Malcolm"
  }
}
```

Logout thì ko có gì, vì với JWT, logout chỉ là xóa token phía client, backend chỉ trả về thông báo:
```sh
curl -sX POST http://localhost:3001/admin/logout
```

Gọi API ko có token sẽ trả về lỗi 401 Unauthorized:
```sh
curl -s http://localhost:3001/user/list | jq
```

Kết quả:
```json
{ "error": "No token, unauthorized" }
```

Hoặc với token không hợp lệ:
```json
{ "error": "Invalid or expired token" }
```

Gọi API với token hợp lệ sẽ nhận dc kết quả trả về:
```sh
curl -s http://localhost:3001/user/list \
  -H "Authorization: Bearer <token>" | jq
curl -s http://localhost:3001/user/list \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1NzIzMWYxYTMwZTQzNTFmNGU5ZjRiZDciLCJmaXJzdF9uYW1lIjoiSWFuIiwibGFzdF9uYW1lIjoiTWFsY29sbSIsImlhdCI6MTc0OTA1ODYxNiwiZXhwIjoxNzQ5MDY1ODE2fQ.hOz-qk3EEhreT8CpIru9ZN7lBRz93KuHPSaSE18Ef64" | jq
```

### Frontend

#### Thực hiện

Để tích hợp login/logout với JWT vào frontend React, ta cần:

- Tạo component `LoginRegister` để nhập `login_name` và xử lý đăng nhập.
- Lưu token vào **localStorage** (hoặc state/context).
- Khi gọi API, tự động gắn token vào header **Authorization**.
- Hiển thị giao diện phù hợp:
    - Nếu đã đăng nhập: Hiển thị "Hi {firstname}" + nút Logout + các component chính.
    - Nếu chưa đăng nhập: Hiển thị `LoginRegister`, ẩn UserList.

#### Giao diện

Màn hình login:
![alt text](ui-login.png)

Sau khi login:

![alt text](ui-logged-in.png)