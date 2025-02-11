import axiosInstance from "./axiosInstance";

const productUrl = "Product";
export const fetchAllProduct = async () => {
  try {
    const response = await axiosInstance.get(productUrl);
    return response;
  } catch (error) {
    console.log("Error fetching products list:", error);
  }
};

export const getDetailProduct = async (id) => {
  try {
    const response = await axiosInstance.get(`${productUrl}/${id}`);
    return response;
  } catch (error) {
    console.log("Error fetch product details", error);
  }
};
