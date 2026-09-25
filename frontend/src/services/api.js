import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Courses API
export const getCourses = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.level) params.append('level', filters.level);
  if (filters.search) params.append('search', filters.search);
  
  const response = await axios.get(`${API_BASE_URL}/courses?${params}`);
  return response.data;
};

export const getCourse = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
  return response.data;
};

export const enrollInCourse = async (id) => {
  const response = await axios.post(`${API_BASE_URL}/courses/${id}/enroll`);
  return response.data;
};

export const completeLesson = async (courseId, lessonId) => {
  const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/complete`);
  return response.data;
};

// Puzzles API
export const getPuzzles = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.theme) params.append('theme', filters.theme);
  
  const response = await axios.get(`${API_BASE_URL}/puzzles?${params}`);
  return response.data;
};

export const getPuzzle = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/puzzles/${id}`);
  return response.data;
};

export const solvePuzzle = async (id, solutionData) => {
  const response = await axios.post(`${API_BASE_URL}/puzzles/${id}/solve`, solutionData);
  return response.data;
};

export const getDuePuzzles = async () => {
  const response = await axios.get(`${API_BASE_URL}/puzzles/review/due`);
  return response.data;
};

// Users API
export const getUserProfile = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/users/${id}`);
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData);
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/leaderboard/top`);
  return response.data;
};

// Repertoire API
export const getRepertoires = async () => {
  const response = await axios.get(`${API_BASE_URL}/repertoire`);
  return response.data;
};

export const createRepertoire = async (name, color) => {
  const response = await axios.post(`${API_BASE_URL}/repertoire`, { name, color });
  return response.data;
};

export const addOpening = async (repertoireId, openingData) => {
  const response = await axios.post(`${API_BASE_URL}/repertoire/${repertoireId}/openings`, openingData);
  return response.data;
};

export const updateOpening = async (repertoireId, openingId, openingData) => {
  const response = await axios.put(`${API_BASE_URL}/repertoire/${repertoireId}/openings/${openingId}`, openingData);
  return response.data;
};

export const deleteOpening = async (repertoireId, openingId) => {
  const response = await axios.delete(`${API_BASE_URL}/repertoire/${repertoireId}/openings/${openingId}`);
  return response.data;
};
