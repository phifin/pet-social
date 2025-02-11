import axiosInstance from "./axiosInstance";

const productUrl = "Product";
export const fetchAllProduct = async () => {
  try {
    const response = await axiosInstance.get(productUrl);
    // console.log("products from TQ", response);
    return response.data;
  } catch (error) {
    console.log("Error fetching products list:", error);
  }
};

export const getDetailProduct = async (id) => {
  try {
    const response = await axiosInstance.get(`${productUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error fetch product details", error);
  }
};

export const getFavoriteList = async (userId) => {
  try {
    // const url = `${productUrl}/get-favorite?customerId=${userId}`;
    // console.log("Fetching favorite list from:", url);
    const response = await axiosInstance.get(
      `${productUrl}/get-favorite?customerId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching favor list", error);
  }
};

export const addProductToFavor = async ({ customerId, productId }) => {
  try {
    // console.log("📤 addProductToFavor called with:", { customerId, productId });
    const response = await axiosInstance.post(`${productUrl}/add-favorite`, {
      customerId: customerId,
      productId: productId,
    });
  } catch (error) {
    console.log("add product to favor error", error);
  }
};

export const getCart = async (userId) => {
  try {
    const resposne = await axiosInstance.get(
      `Cart/get-cart?customerId=${userId}`
    );
    return resposne.data;
  } catch (error) {
    console.log("error when getting cart", error);
  }
};

export const addCart = async ({ userId, productId, quantity }) => {
  try {
    const response = await axiosInstance.post(`Cart`, {
      customerId: userId,
      productId: productId,
      quantity: quantity,
    });
  } catch (error) {
    console.log("add cart error", error);
  }
};
