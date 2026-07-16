import axios from "axios";

export const updateCategories = async (ticketId: string, status: string) => {
  try {
    return await axios.put(
      `/api/admin/tickets/update/categories/?status=${status}&ticketId=${ticketId}`
    );
  } catch (error) {
    console.log("Error updating categories ticket", error);
    return error;
  }
};
