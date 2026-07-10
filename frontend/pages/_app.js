import "../styles/globals.css";
import "../i18n";
import Navbar from "../components/Navbar";
import { SearchProvider } from "../context/SearchContext";

export default function App({ Component, pageProps }) {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </SearchProvider>
  );
}