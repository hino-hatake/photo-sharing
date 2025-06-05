import axios from "axios";

// khi lỗi token hoặc hết hạn, chủ động logout (xóa khỏi localStorage) và chuyển về trang login
const handleAuthError = (err) => {
  if (
    err?.response?.data?.error === "Invalid or expired token" ||
    err?.response?.data?.error === "No token, unauthorized"
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // hoặc có thể gọi callback logout nếu muốn
  }
};

/**
 * fetchModel(endpoint: string): Promise<any>
 * Gửi GET request tới backend, trả về dữ liệu JSON hoặc throw lỗi nếu có lỗi.
 * endpoint: VD '/user/list', '/user/:id', '/photosOfUser/:id'
 */
const fetchModel = async (endpoint) => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(endpoint, { headers });
    return res.data;
  } catch (err) {
    handleAuthError(err);
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error("Lỗi kết nối hoặc không xác định");
  }
};

/**
 * postModel(endpoint: string, data: object): Promise<any>
 * Gửi POST request tới backend, trả về dữ liệu JSON hoặc throw lỗi nếu có lỗi.
 * endpoint: VD '/commentsOfPhoto/:photo_id'
 * data: object body gửi lên
 */
const postModel = async (endpoint, data) => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post(endpoint, data, { headers });
    return res.data;
  } catch (err) {
    handleAuthError(err);
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error("Lỗi kết nối hoặc không xác định");
  }
};

export { fetchModel, postModel };
export default fetchModel;
