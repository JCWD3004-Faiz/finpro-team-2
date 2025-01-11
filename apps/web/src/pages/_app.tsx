import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useCheckAccess } from "../hooks/useCheckAccess";
import AccessDenied from "../components/AccessDenied";
import LocationHeader from "../components/location-header";
import axios from "axios";
import { useEffect } from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_AXIOS_BASE_URL;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const accessDenied = useCheckAccess();

  const hideNavAdmin = router.pathname.startsWith("/admin");
  const hideNavAuth = router.pathname.startsWith("/auth");

  // Define paths where you want to show the LocationHeader
  const showLocationHeaderPaths = ["/", "/home"]; // Example paths to show the LocationHeader
  const shouldShowLocationHeader = showLocationHeaderPaths.includes(router.pathname);

  useEffect(() => {
    // This will allow us to log the current pathname, useful for debugging routing
    console.log("Current Path: ", router.pathname);
  }, [router.pathname]);

  return (
    <Provider store={store}>
      {/* Conditionally render LocationHeader */}
      {!hideNavAdmin && !hideNavAuth && <LocationHeader />}

      {/* Pass cart state and handlers to Navbar */}
      {!hideNavAdmin && !hideNavAuth && <Navbar />}

      {accessDenied ? <AccessDenied /> : <Component {...pageProps} />}

      {!hideNavAdmin && !hideNavAuth && <Footer />}
    </Provider>
  );
}
