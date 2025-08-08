
import axios from "axios";

const API_BASE_URL = "/api/v1/subscriptions"; // Base URL for subscription APIs

export const getSubscribedChannels = async (subscriberId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subscribed-channels/${subscriberId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const toggleSubscription = async (channelId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/togglesubscription/${channelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};