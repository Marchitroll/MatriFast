import { useContext } from 'react';
import { AuthContext } from './AuthContextObject';

export const useAuth = () => useContext(AuthContext);
export default useAuth;
