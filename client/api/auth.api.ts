import axios from 'axios';
import type { LoginData, LoginResponse } from '@utils/LoginUtils';

const AUTH_URL = import.meta.env.VITE_API_URL;

export const loginRequest = async (data: LoginData): Promise<LoginResponse> => {
  try {
    console.log('🔧 URL del API:', `${AUTH_URL}/auth/login`); // ← CAMBIADO
    console.log('📤 Datos enviados:', data);
    
    const response = await axios.post(`${AUTH_URL}/auth/login`, data, { // ← CAMBIADO
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log('✅ Respuesta del servidor:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error en loginRequest:', error);
    
    if (error.response) {
      console.error('📡 Response data:', error.response.data);
      console.error('📡 Response status:', error.response.status);
      throw error;
    } else if (error.request) {
      console.error('🌐 No response received');
      throw new Error('No se pudo conectar con el servidor.');
    } else {
      console.error('⚙️ Request setup error:', error.message);
      throw error;
    }
  }
};