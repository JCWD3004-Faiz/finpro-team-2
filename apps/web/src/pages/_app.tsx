import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import axios from "axios";
import {useCheckAccess} from "../hooks/useCheckAccess";
import AccessDenied from "../components/AccessDenied";

axios.defaults.baseURL = "http://localhost:8000/";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const accessDenied = useCheckAccess();
  const noNavbarPaths = router.pathname.startsWith("/admin");

  return (
    <>
      {!noNavbarPaths && <Navbar />} 
      {accessDenied ? <AccessDenied /> : <Component {...pageProps} />}
    </>
  );
}
