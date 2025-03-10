import { jwtDecode } from 'jwt-decode'; // Updated import to use named export


interface DecodedToken {
  id: string;
  role: string;
  // Add other properties as needed
}

export const getUserRoleFromToken = (token: string): string => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return '';
  }
};

export const getUserIdFromToken = (token: string): string => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return '';
  }
};

