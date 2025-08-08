
import axios from "axios";

const API_BASE_URL = "/api/v1/playlists"; // Base URL for playlist APIs

export const getMyPlaylists = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/my-playlists`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserPlaylists = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/p/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const editPlaylist = async (playlistId, videoId, data) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/p/${playlistId}/v/${videoId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};