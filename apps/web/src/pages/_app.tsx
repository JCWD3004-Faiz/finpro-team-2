import "@/styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/"


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
