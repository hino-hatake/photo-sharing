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
  -d '{"login_name": "ian"}' | jq
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

## V. New Comments

### Mục tiêu

- Cho phép người dùng đã đăng nhập thêm bình luận vào ảnh.
- Giao diện cập nhật ngay lập tức khi bình luận mới được thêm.

### Thực hiện

#### Backend

- Thêm route POST `/commentsOfPhoto/:photo_id`
- Nhận body JSON: `{ "comment": "nội dung bình luận" }`
- Middleware xác thực JWT để lấy `user_id` từ token (người đang đăng nhập).
- Kiểm tra nội dung bình luận không được rỗng (nếu rỗng trả về HTTP 400).
- Tạo đối tượng bình luận mới: gồm `user_id`, `date_time` (thời gian hiện tại), `comment`.
- Lưu bình luận vào mảng `comments` của photo có `_id` = `photo_id`.
- Trả về thông tin bình luận vừa thêm (hoặc toàn bộ photo đã cập nhật).

#### Frontend

- Trong giao diện chi tiết ảnh (photo detail view), mỗi ảnh cần có ô nhập bình luận và nút gửi (`UserPhotos`).
- Khi người dùng nhập bình luận và gửi:
  - Gửi request POST lên backend với nội dung bình luận.
  - Nếu thành công, cập nhật lại danh sách bình luận của ảnh đó trên UI (không cần reload toàn trang).

### Verify API

Login để lấy token:
```sh
curl -sX POST http://localhost:3001/admin/login \
  -H "Content-Type: application/json" \
  -d '{"login_name":"<login_name>"}'

curl -sX POST http://localhost:3001/admin/login \
  -H "Content-Type: application/json" \
  -d '{"login_name": "ian"}' | jq
```

Lấy tất cả ảnh và comment của một user:
```sh
curl -s http://localhost:3001/photosOfUser/<user_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" | jq

curl -s http://localhost:3001/photosOfUser/57231f1a30e4351f4e9f4bdb \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1NzIzMWYxYTMwZTQzNTFmNGU5ZjRiZDciLCJmaXJzdF9uYW1lIjoiSWFuIiwibGFzdF9uYW1lIjoiTWFsY29sbSIsImlhdCI6MTc0OTEwNzcxMywiZXhwIjoxNzQ5MTE0OTEzfQ.QbuzlQt0L_C1V8Cd60KLjqy_TD3zUGls4YmaQN9W5K4" | jq
```

Thêm bình luận mới vào một photo:
```sh
curl -sX POST http://localhost:3001/commentsOfPhoto/<photo_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"comment":"Bình luận mới"}' | jq

curl -sX POST http://localhost:3001/commentsOfPhoto/6840840904d87e5d09eb85b4 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1NzIzMWYxYTMwZTQzNTFmNGU5ZjRiZDciLCJmaXJzdF9uYW1lIjoiSWFuIiwibGFzdF9uYW1lIjoiTWFsY29sbSIsImlhdCI6MTc0OTEwNzcxMywiZXhwIjoxNzQ5MTE0OTEzfQ.QbuzlQt0L_C1V8Cd60KLjqy_TD3zUGls4YmaQN9W5K4" \
  -d '{"comment":"Bình luận mới"}' | jq
```

Kết quả, ta nhận dc comment mới trong response về ảnh đc comment (_lưu ý là đối tượng comment trả về đã đc update để trả về thêm `user.first_name` và `user.last_name` để FE hiển thị_):
```json
{
  "_id": "6840840904d87e5d09eb85b4",
  "user_id": "57231f1a30e4351f4e9f4bdb",
  "file_name": "ludgate1.jpg",
  "date_time": "2013-09-04T02:16:32.000Z",
  "comments": [
    {
      "_id": "6840840904d87e5d09eb85b5",
      "comment": "Beautiful yet cold and aloof. Loner. Does not obey, occasionally chooses to cooperate. ",
      "date_time": "2013-09-04T03:14:32.000Z",
      "user": {
        "_id": "57231f1a30e4351f4e9f4bdb",
        "first_name": "April",
        "last_name": "Ludgate"
      }
    },
    {
      "_id": "6841445d3571c95c538e03e1",
      "comment": "Bình luận mới",
      "date_time": "2025-06-05T07:16:45.561Z",
      "user": {
        "_id": "57231f1a30e4351f4e9f4bd7",
        "first_name": "Ian",
        "last_name": "Malcolm"
      }
    },
    {
      "_id": "68414ddb19975b43a4a4aa5c",
      "comment": "Bình luận mới",
      "date_time": "2025-06-05T07:57:15.484Z",
      "user": {
        "_id": "57231f1a30e4351f4e9f4bd7",
        "first_name": "Ian",
        "last_name": "Malcolm"
      }
    }
  ]
}
```

Thử bình luận rỗng sẽ nhận lỗi 400:
```sh
{
  "error": "Comment must not be empty"
}
```

### Verify UI

Trong giao diện chi tiết ảnh, khi người dùng đã đăng nhập, sẽ có ô nhập bình luận và nút gửi. Khi người dùng nhập bình luận và gửi, bình luận mới sẽ được hiển thị ngay lập tức mà không cần reload trang. Giao diện chưa có css hay tailwind nên khá thô sơ như sau:

![alt text](ui-comment.png)

## VI. Photo Uploading

### Mục tiêu

Cho phép người dùng đã đăng nhập tải ảnh lên và hiển thị ảnh mới trong giao diện.

### Backend

API mới:

POST `/photos/new`
- Nhận tệp ảnh (file upload) trong body của request (dạng `multipart/form-data`).
- Lưu tệp vào thư mục `public/images` với tên duy nhất (có thể dùng `uuid` hoặc `timestamp`).
- Tạo đối tượng Photo mới trong MongoDB: gồm tên tệp, thời gian tạo, ID của user đang đăng nhập (lấy từ JWT).
- Trả về thông tin ảnh mới (hoặc lỗi 400 nếu không có tệp).

Yêu cầu kỹ thuật:
- Cần cài đặt **middleware** để xử lý file upload (ví dụ: `multer`).
- Đảm bảo chỉ user đã đăng nhập mới upload được ảnh (JWT middleware).
- Không thay đổi schema hiện tại.

Cài thêm 2 package:
```sh
npm install multer uuid
```

### Frontend

- Khi user đã đăng nhập, hiển thị nút "Add Photo" (ví dụ ở **toolbar** hoặc trên **UserPhotos**).
- Khi bấm "Add Photo", cho phép chọn file ảnh và gửi lên backend qua API `/photos/new` (dạng `multipart/form-data`, kèm JWT).
- Sau khi upload thành công, hiển thị ảnh mới ngay trong danh sách UserPhotos hoặc thông báo thành công.

## VII. Registration and Passwords

**Mục tiêu:** Mở rộng LoginRegister để hỗ trợ đăng ký người dùng mới và đăng nhập bằng mật khẩu.

**Yêu cầu:**
- Frontend:
Cập nhật component LoginRegister:
    - Đăng nhập: Thêm trường nhập mật khẩu.
    - Đăng ký: Thêm các trường để nhập tất cả thuộc tính của đối tượng User (login_name, password, first_name, last_name, location, description, occupation).
    - Thêm trường xác nhận mật khẩu thứ hai để đảm bảo không gõ sai.
    - Mật khẩu không được hiển thị (dùng type="password").
    - Thêm nút "Register Me" để gửi yêu cầu đăng ký.
    - Hiển thị thông báo lỗi cụ thể nếu đăng ký thất bại hoặc thông báo thành công và xóa các trường nhập liệu nếu thành công.

- Backend:

    **Cập nhật schema:** Thêm trường password (kiểu chuỗi) vào schema User của Mongoose.

    **API mới:**
    
    - POST /user: Nhận body JSON chứa login_name, password, first_name, last_name, location, description, occupation.
    
    **Kiểm tra:**
    - login_name không được trùng lặp và phải được cung cấp.
    - first_name, last_name, password không được rỗng (các trường khác có thể rỗng).
    - Nếu hợp lệ, tạo người dùng mới trong cơ sở dữ liệu.
    - Trả về các thuộc tính cần thiết (ít nhất là login_name).
    - Trả về mã HTTP 400 với thông báo lỗi nếu thông tin không hợp lệ.

    **Cập nhật POST /admin/login:**
    - Kiểm tra cả login_name và password khi đăng nhập.
    - Trả về mã HTTP 400 nếu thông tin đăng nhập không hợp lệ.