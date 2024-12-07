import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

export const useCheckAccess = () => {
  const user = useAuth();
  const router = useRouter();
  const role = user?.role ?? '';

  const checkAccess = () => {
    if ((role === "SUPER_ADMIN" && router.pathname.startsWith("/admin-store")) ||
        (role === "STORE_ADMIN" && router.pathname.startsWith("/admin-super"))) {
      return true;
    }

    if ((role === "USER" || !role) && 
        (router.pathname.startsWith("/admin-super") || router.pathname.startsWith("/admin-store"))) {
      return true;
    }

    return false;
  };

  return checkAccess();
};
