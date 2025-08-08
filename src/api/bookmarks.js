
import axios from "axios";

const API_BASE_URL = "/api/v1/bookmarks"; // Base URL for bookmarks APIs

export const getMyBookmarks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mybookmarks`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addBookmark = async (videoId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addBookmark/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeBookmark = async (videoId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/removeBookmark/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};