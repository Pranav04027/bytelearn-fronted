
import axios from "axios";

const API_BASE_URL = "/api/v1/quizzes"; // Base URL for quizzes APIs

export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, quizData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getQuizByVideoId = async (videoId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const submitQuiz = async (videoId, submissionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${videoId}/submit`, submissionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};