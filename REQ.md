# Yêu cầu TH3
Make sure you have set up a MongoDB Atlas account and database.
Once the MongoDB database is ready you can load the photo app data set by running the
command: node ./db/dbLoad.js
This program loads the fake model data from previous projects (i.e. modelData/models.js) into the database. 

We use the MongooseJS Object Definition Language (ODL) to define a schema to store the photo app data in MongoDB. The schema definition files are in the directory db:
* db/userModel.js - Defines the User collection containing the objects describing each user.
* db/photoModel.js - Defines the Photos collection containing the objects describing each photo. It also defines the objects we use to store the comments made on the photo.
* db/schemaInfo.js - Defines the SchemaInfo collection containing the object describing the schema version.

1. Tạo file .env lên atlas cop link vô
2. chạy file dbLoad.js rồi xem log trong bash và data trong atlas đã có chưa 
3. tạo file dbConnection.js kết nối với db qua file .env(nhớ cài dotenv để đọc file)
4. chạy server và xem dòng log trong bash hiển thị kết nối thành công với mongo db.

## Problem 1: Build a backend app to use the database

API:
* /user/list : Trả về danh sách người dùng cho nav sidebar(danh sách user ở thanh bên) với dữ liệu trả về chỉ là các thuộc tính cần thiết: _id, first_name, last_name.
* /user/:id : Trả về thông tin chi tiết của người dùng với dữ liệu trả về: _id, first_name, last_name, location, description, occupation.

    Nếu id không hợp lệ: Trả về HTTP status 400 + thông báo lỗi.
* /photosOfUser/:id : Trả về tất cả ảnh và cmt của một người dùng với dữ liệu trả về: Photos (_id, user_id, comments, file_name, date_time) , Commments trong mỗi photo (comment, date_time, _id, user chỉ gồm _id,first_name,last_name)

    Nếu id không hợp lệ: Trả về HTTP status 400 + thông báo lỗi.
    
    Gợi ý: 
    * Truy vấn các ảnh có user_id khớp với id được cung cấp.
    * Sử dụng populate của Mongoose để lấy trường user trong bình luận, chỉ chọn _id, first_name, và last_name.
    * Thực hiện các truy vấn cơ sở dữ liệu đồng thời bằng async/await hoặc Promise.all để tối ưu hóa hiệu suất.
    * Kiểm tra tính hợp lệ của id.
    * Tạo một đối tượng JavaScript mới cho phản hồi để phù hợp với định dạng API được yêu cầu.

### Ghi chú chung
- Mô hình Mongoose so với mô hình API:
Mô hình Mongoose bị ràng buộc bởi schema cơ sở dữ liệu và có thể bao gồm các trường không cần thiết cho frontend (ví dụ: mật khẩu).
Sử dụng select để giới hạn các trường hoặc tạo các đối tượng JavaScript mới để khớp với mô hình API.
Tránh sửa đổi trực tiếp các đối tượng Mongoose vì các thay đổi không phù hợp với schema sẽ bị loại bỏ.
- Xử lý lỗi:
Kiểm tra tham số id (ví dụ: sử dụng mongoose.Types.ObjectId.isValid). Trả về mã HTTP 400 với thông báo lỗi rõ ràng cho các đầu vào không hợp lệ.
- Xử lý đồng thời:
Sử dụng các truy vấn Mongoose bất đồng bộ (ví dụ: Promise.all) để lấy ảnh và bình luận đồng thời trong endpoint /photosOfUser/:id.
- Schema cơ sở dữ liệu:
Không được phép thay đổi schema cơ sở dữ liệu; làm việc với schema hiện có.

## Problem 2: Frontend Data Fetching

**Mục tiêu:**

Chuyển đổi ứng dụng frontend để lấy dữ liệu mô hình từ backend thông qua các API đã xây dựng.

**Yêu cầu:**

**Triển khai hàm fetchModel:**
* Vị trí: Triển khai trong lib/fetchModelData.js.
* Chức năng: Hàm này sẽ gửi yêu cầu HTTP đến các endpoint backend (/user/list, /user/:id, /photosOfUser/:id) để lấy dữ liệu cần thiết cho các giao diện frontend.
* Ghi chú triển khai:
Sử dụng fetch API hoặc thư viện như Axios để gửi các yêu cầu GET.
Xử lý phản hồi JSON từ backend và trả về dữ liệu ở định dạng phù hợp với frontend.
* Xử lý lỗi (ví dụ: kiểm tra mã trạng thái HTTP 400 và thông báo lỗi).

**Cập nhật các thành phần frontend:**
* Các file cần sửa đổi:
    * /components/UserDetail/index.jsx: Sử dụng fetchModel để lấy dữ liệu chi tiết của người dùng từ endpoint /user/:id.
    * /components/UserList/index.jsx: Sử dụng fetchModel để lấy danh sách người dùng từ endpoint /user/list.
    * /components/UserPhotos/index.jsx: Sử dụng fetchModel để lấy danh sách ảnh và bình luận từ endpoint /photosOfUser/:id.
* Ghi chú triển khai:
Thay thế các phương thức lấy dữ liệu tĩnh hoặc giả lập trước đó bằng các lời gọi fetchModel. Đảm bảo dữ liệu trả về từ backend được xử lý đúng để hiển thị trên giao diện.

### Extra Credit: Social Network Features

**Count Bubbles trong Navigation Bar**

- Vị trí: Bên cạnh tên người dùng trong side navigation
2 loại bubble:
    - Green Bubble: Số lượng photos của user
    - Red Bubble: Số lượng comments mà user đã viết

**Comments View Component (Mới): ???**

Trigger: Click vào red comment count bubble
Nội dung hiển thị: Tất cả comments của user đó

Mỗi comment bao gồm:Thumbnail của photo được comment, Text của comment

Tương tác: Click vào comment hoặc photo → chuyển đến photo detail view
View phụ thuộc vào việc đã implement stepper extra credit ở lab 2 hay chưa

# Final Project - Photo App Complete Requirements

## Problem 1: Simple Login

**Mục tiêu:** Thêm tính năng đăng nhập người dùng vào ứng dụng, hiển thị thông tin người dùng đã đăng nhập và từ chối truy cập nếu chưa đăng nhập.

**Yêu cầu:**
- Frontend:

    - Giao diện khi đã đăng nhập:
Thanh công cụ (toolbar) hiển thị thông báo "Hi firstname" (với firstname là tên của người dùng đã đăng nhập). Thêm nút "Logout" để đăng xuất.
    - Giao diện khi chưa đăng nhập:
Thanh công cụ hiển thị "Please Login".
Giao diện chính chuyển sang component LoginRegister.
Mọi nỗ lực điều hướng đến các giao diện khác (ví dụ: deep links) sẽ chuyển hướng về LoginRegister nếu chưa đăng nhập.
Danh sách người dùng bên trái (user list) không được hiển thị nếu chưa đăng nhập.
    - Xử lý đăng nhập:
Khi đăng nhập thành công, hiển thị giao diện chi tiết người dùng (User Detail).
Nếu đăng nhập thất bại (ví dụ: không tìm thấy login_name), hiển thị thông báo lỗi và cho phép thử lại.
- Backend:

    **Cập nhật schema:**
Thêm trường login_name (kiểu chuỗi) vào schema User của Mongoose.

    **API mới:**
    - POST /admin/login:
Nhận body JSON chứa login_name.
Kiểm tra xem login_name có tồn tại trong cơ sở dữ liệu không.
Nếu hợp lệ, lưu thông tin người dùng vào session Express (hoặc tạo JWT token nếu dùng xác thực dựa trên token). Trả về các thuộc tính cần thiết của người dùng (ít nhất là _id, tránh trả về toàn bộ đối tượng người dùng).
Trả về mã HTTP 400 nếu đăng nhập thất bại (ví dụ: login_name không hợp lệ).
    - POST /admin/logout:
Nhận body JSON rỗng.
Xóa thông tin session (hoặc xóa token JWT phía client nếu dùng token).
Trả về mã HTTP 400 nếu người dùng chưa đăng nhập.
    - Cập nhật các endpoint hiện có:
Tất cả các endpoint (trừ /admin/login và /admin/logout), trả về mã HTTP 401 (Unauthorized) nếu người dùng chưa đăng nhập (kiểm tra session hoặc token).

## Problem 2: New Comments

**Mục tiêu:** Cho phép người dùng đã đăng nhập thêm bình luận vào ảnh và cập nhật giao diện ngay lập tức.

**Yêu cầu:**
- Frontend:
    - Trong giao diện chi tiết ảnh (photo detail view), thêm khả năng cho người dùng đã đăng nhập nhập bình luận.
    - Thiết kế giao diện (ví dụ: hộp thoại bật lên, trường nhập liệu) sao cho dễ sử dụng và rõ ràng ảnh nào đang được bình luận.
    - Cập nhật giao diện ngay sau khi thêm bình luận để hiển thị bình luận mới.
- Backend:
    
    **API mới:**
    - POST /commentsOfPhoto/:photo_id:
Nhận body JSON chứa thuộc tính comment (nội dung bình luận).
Tạo đối tượng bình luận mới(Bao gồm:ID của người dùng đang đăng nhập,Thời gian tạo bình luận).
Từ chối bình luận rỗng với mã HTTP 400.
Lưu bình luận vào cơ sở dữ liệu và trả về thông tin cần thiết.

## Problem 3: Photo Uploading

**Mục tiêu:** Cho phép người dùng đã đăng nhập tải ảnh lên và hiển thị ảnh mới trong giao diện.

**Yêu cầu:**
- Frontend:
Khi người dùng đã đăng nhập, thêm nút "Add Photo" vào thanh công cụ.
Cho phép tải tệp ảnh lên và hiển thị ảnh mới trong giao diện danh sách ảnh của người dùng (User Photos) hoặc hiển thị thông báo thành công.
- Backend:
    
    **API mới:**
    - POST /photos/new:
Nhận tệp ảnh trong body của yêu cầu.
Lưu tệp vào thư mục images với tên duy nhất (tự tạo).
Tạo đối tượng Photo mới(Tên tệp,Thời gian tạo, ID của người dùng đang đăng nhập).
Trả về mã HTTP 400 nếu không có tệp trong yêu cầu.

## Problem 4: Registration and Passwords

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
