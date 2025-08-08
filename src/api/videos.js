
import axios from "axios";

const API_BASE_URL = "/api/v1/videos"; // Base URL for video APIs

export const getAllVideos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getallvideos`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVideoById = async (videoId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const uploadVideo = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/uploadvideo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};