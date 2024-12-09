import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import store from "@/redux/store"; // Path to your Redux store
import Navbar from "../components/navbar";
import Footer from "../components/footer"
import axios from "axios";
import { useCheckAccess } from "../hooks/useCheckAccess";
import AccessDenied from "../components/AccessDenied";

axios.defaults.baseURL = "http://localhost:8000/";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const accessDenied = useCheckAccess(); // This will return the access status
  const noNavbarPaths = router.pathname.startsWith("/admin");

  return (
    <>
    <Provider store={store}>
      {!noNavbarPaths && <Navbar />}
      {accessDenied ? <AccessDenied /> : <Component {...pageProps} />}
      <Footer />
    </Provider>
    </>
  );
}
