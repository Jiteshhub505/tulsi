import axios from "axios";

const getproductdetails = async (id: string) => {
  const response = await axios.get(`/api/getproduct/${id}`);
  if (response.data.success) {
    return response.data.product;
  } else {
    return response.data.error;
  }
};

export default getproductdetails;
