import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Hook para validar si un token ya ha sido utilizado.
 * @param {string} token - El token a verificar.
 * @returns {Object} - Un objeto con el estado del token y una función para verificarlo manualmente.
 */
const useTokenValidation = (token) => {
  const [isTokenUsed, setIsTokenUsed] = useState(false);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/docs/verify-token/${token}`);

      if (response.status === 200 && response.data.used) {
        setIsTokenUsed(true);
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const validateBeforeSubmit = () => {
    if (isTokenUsed) {
      throw new Error("Este token ya ha sido utilizado.");
    }
  };

  return { isTokenUsed, validateBeforeSubmit, verifyToken };
};

export default useTokenValidation;
