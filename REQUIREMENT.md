# Yêu cầu

Make sure you have set up a MongoDB Atlas account and database. Once the MongoDB database is ready you can load the photo app data set by running the command:
```sh
node ./db/dbLoad.js
```
This program loads the fake model data from previous projects (i.e. `modelData/models.js`) into the database.

We use the MongooseJS Object Definition Language (ODL) to define a schema to store the photo app data in MongoDB. The schema definition files are in the directory db:

- `db/userModel.js` - Defines the User collection containing the objects describing each user.
- `db/photoModel.js` - Defines the Photos collection containing the objects describing each photo. It also defines the objects we use to store the comments made on the photo.
- `db/schemaInfo.js` - Defines the SchemaInfo collection containing the object describing the schema version.

## Problem 1: Build a backend app to use the database

API:
- `/user/list` : Trả về danh sách người dùng cho nav sidebar(danh sách user ở thanh bên) với dữ liệu trả về chỉ là các thuộc tính cần thiết: _id, first_name, last_name.
- `/user/:id` : Trả về thông tin chi tiết của người dùng với dữ liệu trả về: _id, first_name, last_name, location, description, occupation. Nếu id không hợp lệ: Trả về HTTP status 400 + thông báo lỗi.
- `/photosOfUser/:id` : Trả về tất cả ảnh và cmt của một người dùng với dữ liệu trả về: Photos (_id, user_id, comments, file_name, date_time) , Commments trong mỗi photo (comment, date_time, _id, user chỉ gồm _id,first_name,last_name). Nếu id không hợp lệ: Trả về HTTP status 400 + thông báo lỗi.

Gợi ý:
- Truy vấn các ảnh có `user_id` khớp với `id` được cung cấp.
- Sử dụng **populate** của Mongoose để lấy trường user trong bình luận, chỉ chọn `_id`, `first_name`, và `last_name`.
- Thực hiện các truy vấn cơ sở dữ liệu đồng thời bằng `async/await` hoặc `Promise.all` để tối ưu hóa hiệu suất.
- Kiểm tra tính hợp lệ của id.
- Tạo một đối tượng JavaScript mới cho phản hồi để phù hợp với định dạng API được yêu cầu.

Ghi chú chung:
- Mô hình Mongoose so với mô hình API: Mô hình Mongoose bị ràng buộc bởi schema cơ sở dữ liệu và có thể bao gồm các trường không cần thiết cho frontend (ví dụ: mật khẩu). Sử dụng select để giới hạn các trường hoặc tạo các đối tượng JavaScript mới để khớp với mô hình API. Tránh sửa đổi trực tiếp các đối tượng Mongoose vì các thay đổi không phù hợp với schema sẽ bị loại bỏ.
- Xử lý lỗi: Kiểm tra tham số id (ví dụ: sử dụng mongoose.Types.ObjectId.isValid). Trả về mã HTTP 400 với thông báo lỗi rõ ràng cho các đầu vào không hợp lệ.
- Xử lý đồng thời: Sử dụng các truy vấn Mongoose bất đồng bộ (ví dụ: Promise.all) để lấy ảnh và bình luận đồng thời trong endpoint `/photosOfUser/:id`.
- Schema cơ sở dữ liệu: Không được phép thay đổi schema cơ sở dữ liệu; làm việc với schema hiện có.

## Problem 2: Frontend Data Fetching

**Mục tiêu:**

Chuyển đổi ứng dụng frontend để lấy dữ liệu mô hình từ backend thông qua các API đã xây dựng.

**Yêu cầu:**

**Triển khai hàm fetchModel:**
* Vị trí: Triển khai trong lib/fetchModelData.js.
* Chức năng: Hàm này sẽ gửi yêu cầu HTTP đến các endpoint backend (`/user/list`, `/user/:id`, `/photosOfUser/:id`) để lấy dữ liệu cần thiết cho các giao diện frontend.
* Ghi chú triển khai:
Sử dụng fetch API hoặc thư viện như Axios để gửi các yêu cầu GET.
Xử lý phản hồi JSON từ backend và trả về dữ liệu ở định dạng phù hợp với frontend.
* Xử lý lỗi (ví dụ: kiểm tra mã trạng thái HTTP 400 và thông báo lỗi).

**Cập nhật các thành phần frontend:**
* Các file cần sửa đổi:
    * `/components/UserDetail/index.jsx`: Sử dụng fetchModel để lấy dữ liệu chi tiết của người dùng từ endpoint `/user/:id`.
    * `/components/UserList/index.jsx`: Sử dụng fetchModel để lấy danh sách người dùng từ endpoint `/user/list`.
    * `/components/UserPhotos/index.jsx`: Sử dụng fetchModel để lấy danh sách ảnh và bình luận từ endpoint `/photosOfUser/:id`.
* Ghi chú triển khai:
Thay thế các phương thức lấy dữ liệu tĩnh hoặc giả lập trước đó bằng các lời gọi fetchModel. Đảm bảo dữ liệu trả về từ backend được xử lý đúng để hiển thị trên giao diện.
