import "./global.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import { SearchProvider } from "@/context/SearchContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SearchProvider>
            <Navbar />
            {children}
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}