
import axios from "axios";

const API_BASE_URL = "/api/v1/comments"; // Base URL for comment APIs

export const getVideoComments = async (videoId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getvideocomments/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addComment = async (videoId, commentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/comment/${videoId}`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};