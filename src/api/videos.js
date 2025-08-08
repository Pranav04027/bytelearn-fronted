
import axios from "./axios.js";

export const getAllVideos = async () => {
  try {
    const response = await axios.get(`/videos/getallvideos`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVideoById = async (videoId) => {
  try {
    const response = await axios.get(`/videos/v/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const uploadVideo = async (formData) => {
  try {
    const response = await axios.post(`/videos/uploadvideo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};