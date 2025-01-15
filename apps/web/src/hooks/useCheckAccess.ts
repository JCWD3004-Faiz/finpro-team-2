import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";

export const storeId = Cookies.get("storeId");

export const useCheckAccess = () => {
  const user = useAuth();
  const router = useRouter();
  const role = user?.role ?? '';
  const is_verified = user?.is_verified

  const checkAccess = () => {
    if ((role === "SUPER_ADMIN" && !router.pathname.startsWith("/admin-super")) ||
        (role === "STORE_ADMIN" && !router.pathname.startsWith("/admin-store"))) {
      return true;
    }
    if ((role === "STORE_ADMIN" && is_verified === false) && (router.pathname.startsWith("/admin-store/"))) {
      return true;
    }
    if ((role === "USER" || !role) && (router.pathname.startsWith("/admin"))) {
      return true;
    }
    if (!user && router.pathname.startsWith("/user")) {
      return true;
    }
    return false;
  };

  return checkAccess();
};
