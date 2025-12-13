import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook to easily access auth context data in any component
export const useAuth = () => {
  return useContext(AuthContext);
};