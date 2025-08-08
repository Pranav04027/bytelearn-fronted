
import axios from "axios";

const API_BASE_URL = "/api/v1/likes"; // Base URL for likes APIs

export const getLikedVideos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/likedvideos`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const likeVideo = async (videoId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/likevideo/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const likeComment = async (commentId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/likecomment/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const likeTweet = async (tweetId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/liketweet/${tweetId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};