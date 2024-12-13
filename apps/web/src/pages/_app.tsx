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
import LocationHeader from "../components/location-header"; // Import LocationHeader component

axios.defaults.baseURL = "http://localhost:8000/";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const accessDenied = useCheckAccess(); 
  
  const hideNavAdmin = router.pathname.startsWith("/admin");
  const hideNavAuth = router.pathname.startsWith("/auth")
  
  // Define paths where you want to show the LocationHeader
  const showLocationHeaderPaths = ["/", "/home"]; // Example paths to show the LocationHeader
  const shouldShowLocationHeader = showLocationHeaderPaths.includes(router.pathname);

  return (
    <Provider store={store}>
      {/* Conditionally render LocationHeader */}
      {shouldShowLocationHeader && <LocationHeader />}  {/* Conditionally render LocationHeader */}
      
      {!hideNavAdmin && !hideNavAuth && <Navbar />} {/* Conditionally render Navbar */}
      
      {/* Conditionally render Component based on access or not */}
      {accessDenied ? <AccessDenied /> : <Component {...pageProps} />}
      
      {!hideNavAdmin && !hideNavAuth && <Footer />} {/* Conditionally render Footer */}
    </Provider>
  );
}