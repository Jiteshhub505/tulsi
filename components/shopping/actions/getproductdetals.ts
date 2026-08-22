import axios from "axios";

const getproductdetails = async (id: string) => {
  const response = await axios.get(`/api/getproduct/${id}?t=${Date.now()}`, {
    headers: { "Cache-Control": "no-cache, no-store" },
  });
  if (response.data.success) {
    return response.data.product;
  } else {
    return response.data.error;
  }
};

export default getproductdetails;
