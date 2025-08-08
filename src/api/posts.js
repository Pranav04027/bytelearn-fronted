
import axios from "axios";

const API_BASE_URL = "/api/v1/tweets"; // Base URL for tweet/post APIs

export const getUserTweets = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/usertweets/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createTweet = async (tweetData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createtweet`, tweetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTweet = async (tweetId, tweetData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/updatetweet/${tweetId}`, tweetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteTweet = async (tweetId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deletetweet/${tweetId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};