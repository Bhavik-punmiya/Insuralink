'use client'
import "./globals.css";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { AuthContextProvider } from "./context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>          
          {children}
          <Toaster
          position="top-center"
          reverseOrder={false}
                    />
        </AuthContextProvider>
      </body>
    </html>
  );
}
