import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  role: string;
  is_verified: boolean;
}

interface User {
  id: number;
  role: string;
  is_verified: boolean;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const access_token = Cookies.get("access_token");

      if (access_token) {
        try {
          const decoded = jwtDecode<DecodedToken>(access_token);
          setUser({
            id: decoded.id,
            role: decoded.role,
            is_verified: decoded.is_verified
          });
        } catch (error) {
          setUser(null); // In case of token decoding failure, reset user to null
        }
      } else {
        setUser(null); // If no access token, reset user to null
      }
    }
  }, []); // Empty dependency array ensures this only runs once after mount

  return user; // Return the user or null
};

export default useAuth;
