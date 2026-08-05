import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { SearchProvider } from "../context/SearchContext";

export default function App({ Component, pageProps }) {
  return (
    <SearchProvider>
        <Navbar />
        <Component {...pageProps} />
    </SearchProvider>
  );
}