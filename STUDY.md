## Tổng quan về MongoDB và Mongoose
**MongoDB là gì?**
 MongoDB là một cơ sở dữ liệu NoSQL dạng tài liệu (document-oriented), lưu trữ dữ liệu dưới dạng JSON-like (gọi là BSON - Binary JSON). Nó không yêu cầu cấu trúc bảng cố định như SQL, phù hợp cho các ứng dụng linh hoạt với dữ liệu thay đổi thường xuyên.

**Đặc điểm chính:**
- Dữ liệu được tổ chức thành collections (tương tự bảng trong SQL) chứa các documents (tương tự hàng).
- Hỗ trợ truy vấn mạnh mẽ, index, và phân mảnh (sharding) cho hiệu suất cao.
- Phù hợp với ứng dụng thời gian thực, phân tán, hoặc có lượng dữ liệu lớn.

**Mongoose là gì?**
Mongoose là một ODM (Object Data Modeling) thư viện cho MongoDB, giúp tương tác với MongoDB trong Node.js bằng cách định nghĩa schema, xác thực dữ liệu, và đơn giản hóa các thao tác CRUD.

**Đặc điểm chính:**
- Cung cấp schema để định nghĩa cấu trúc dữ liệu.
- Hỗ trợ middleware (pre/post hooks) và validation.
- Dễ dàng tích hợp với Express.js.

Ứng dụng trong dự án: Quản lý schema cho User và Photo, thực hiện các truy vấn phức tạp như đếm ảnh/bình luận trong API của bạn.

## Cách cài đặt
**Cài đặt MongoDB**

- Cài đặt MongoDB Community Server:
    - Truy cập trang chính thức MongoDB.
    - Chọn phiên bản phù hợp với hệ điều hành (Windows, macOS, Linux).
    - Theo hướng dẫn cài đặt:
    Windows: Chạy file .msi, chọn cài đặt như dịch vụ và tạo thư mục dữ liệu (mặc định là C:\data\db).
    macOS/Linux: Sử dụng brew install mongodb-community (macOS với Homebrew) hoặc tải gói cài đặt.
    - Sau cài đặt, khởi động MongoDB:
    Windows: Dùng Command Prompt: mongod.
    macOS/Linux: sudo service mongod start hoặc chạy trực tiếp mongod.
    - Kiểm tra cài đặt:
    Mở terminal, gõ mongo để vào shell MongoDB. Nếu thành công, bạn sẽ thấy giao diện lệnh MongoDB.
- Cài đặt MongoDB Compass (tùy chọn):
Tải MongoDB Compass để quản lý dữ liệu qua giao diện GUI.
- Cài đặt Mongoose trong dự án Node.js
    - Khởi tạo dự án:
    Nếu chưa có, tạo thư mục dự án: mkdir my-project && cd my-project.
    - Khởi tạo Node.js: npm init -y.
    - Cài đặt các gói cần thiết:
    - Cài Express, Mongoose, và Dotenv:
    npm install express mongoose dotenv

- Cấu hình file .env:
    - Tạo file .env trong thư mục dự án:
    
        MONGODB_URI=mongodb://localhost:27017 myDatabase 
        PORT=3001
    - Thêm .env vào .gitignore để bảo mật.

## Kết nối MongoDB với Mongoose

Tạo file dbConnection.js
    
        const mongoose = require('mongoose');

        const connectDB = async () => {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            });
            console.log('MongoDB connected successfully');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        }
        };

        module.exports = connectDB;
    
Sử dụng trong file chính (như app.js/server.js)

        require('dotenv').config();
        const connectDB = require('./dbConnection');
        connectDB();

## Cách sử dụng cơ bản

**Tạo SChema:**

    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    location: String,
    description: String,
    occupation: String,
    });

    module.exports = mongoose.model('User', userSchema);

## Hướng dẫn tổng quát về Async/Await và Try/Catch

**Async/Await là gì?**

- Async: Là từ khóa khai báo một hàm bất đồng bộ, trả về một Promise.
- Await: Chỉ được sử dụng bên trong hàm async, giúp tạm dừng thực thi cho đến khi Promise được giải quyết (resolved) hoặc từ chối (rejected).
- Mục đích: Làm cho mã bất đồng bộ dễ đọc hơn so với sử dụng .then() và .catch().

**Try/Catch là gì?**

- Try: Khối mã mà bạn muốn thực thi, nơi có thể xảy ra lỗi.
- Catch: Xử lý lỗi nếu có bất kỳ ngoại lệ nào xảy ra trong khối try.
- Mục đích: Đảm bảo ứng dụng không crash khi có lỗi, đồng thời cung cấp phản hồi phù hợp.

**Một số lưu ý khi sử dụng Async/Await và Try/Catch**

- Chỉ sử dụng await trong hàm async
- Xử lý lỗi trong catch:
    - Luôn trả về phản hồi phù hợp cho client (như res.status(500)), tránh để ứng dụng crash.
    - Ghi log lỗi để dễ debug (như console.error trong mã của bạn).
- Sử dụng Promise.all khi cần xử lý nhiều tác vụ bất đồng bộ song song