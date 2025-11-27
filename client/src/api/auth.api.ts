import axios from 'axios';
import type { LoginData, LoginResponse } from '@utils/LoginUtils';

const AUTH_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/auth';

export const loginRequest = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post(`${AUTH_URL}/login`, data);
  return response.data;
};