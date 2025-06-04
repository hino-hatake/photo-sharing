# Notes

## DB

### Mongo Atlas

quannt247 / Dq1F88gxnyw71aYo

```
mongodb+srv://quannt247:Dq1F88gxnyw71aYo@photo-sharing.iouobsn.mongodb.net/?retryWrites=true&w=majority&appName=photo-sharing
```

Mongoose 7:
```sh
npm install mongoose
```

### Load data

```
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

## API

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
