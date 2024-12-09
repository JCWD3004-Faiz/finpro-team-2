import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axios from "axios";
import { useCheckAccess } from "../hooks/useCheckAccess";
import AccessDenied from "../components/AccessDenied";

axios.defaults.baseURL = "http://localhost:8000/";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const accessDenied = useCheckAccess(); 

  const noNavbarPaths = ["/auth/login-page", "/auth/register", "/admin"];
  

  const shouldHideLayout = noNavbarPaths.includes(router.pathname);

  return (
    <Provider store={store}>
      {!shouldHideLayout && <Navbar />} {/* Conditionally render Navbar */}
      
      {/* Conditionally render Component based on access or not */}
      {accessDenied ? <AccessDenied /> : <Component {...pageProps} />}
      
      {!shouldHideLayout && <Footer />} {/* Conditionally render Footer */}
    </Provider>
  );
}
