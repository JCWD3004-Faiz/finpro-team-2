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

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const accessDenied = useCheckAccess();

  const hideNavAdmin = router.pathname.startsWith("/admin");
  const hideNavAuth = router.pathname.startsWith("/auth");

  // Define paths where you want to show the LocationHeader
  const showLocationHeaderPaths = ["/", "/home"]; // Example paths to show the LocationHeader
  const shouldShowLocationHeader = showLocationHeaderPaths.includes(router.pathname);

  return (
    <Provider store={store}>
      {/* Conditionally render LocationHeader */}
      {shouldShowLocationHeader && <LocationHeader />}

      {/* Pass cart state and handlers to Navbar */}
      {!hideNavAdmin && !hideNavAuth && <Navbar />}

      {accessDenied ? <AccessDenied /> : <Component {...pageProps} />}

      {!hideNavAdmin && !hideNavAuth && <Footer />}
    </Provider>
  );
}
