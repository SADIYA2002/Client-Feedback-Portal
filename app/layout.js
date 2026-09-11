import "./globals.css";
import { Inter } from "next/font/google";
import { FeedbackProvider } from "./context/FeedbackContext";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Client Feedback & Product Roadmap System",
  description: "Enterprise B2B Client Voice, Requirements & Product Roadmap Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-slate-100 text-slate-900 antialiased overflow-x-clip`}>
        <FeedbackProvider>
          {children}
        </FeedbackProvider>
      </body>
    </html>
  );
}
