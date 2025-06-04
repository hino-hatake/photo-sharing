import axios from "axios";

/**
 * fetchModel(endpoint: string): Promise<any>
 * Gửi GET request tới backend, trả về dữ liệu JSON hoặc throw lỗi nếu có lỗi.
 * endpoint: VD '/user/list', '/user/:id', '/photosOfUser/:id'
 */
const fetchModel = async (endpoint) => {
  try {
    const res = await axios.get(endpoint);
    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error("Lỗi kết nối hoặc không xác định");
  }
};

export default fetchModel;
