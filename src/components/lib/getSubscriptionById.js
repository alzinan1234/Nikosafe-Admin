import axios from "axios";

export async function getSubscriptionById(id) {
  try {
    const response = await axios.get(
      `https://dreckks-backend.onrender.com/api/v1/subscription/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Unknown error";
  }
}