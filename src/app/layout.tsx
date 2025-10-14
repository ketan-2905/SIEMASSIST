import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { ReportDataProvider } from "@/context/ReportDataContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // customize weights as needed
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // customize as needed
});

export const metadata: Metadata = {
  title: "Conversational SIEM Assistant",
  description: "Use natural language to investigate security events and generate automated threat reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${montserrat.variable} antialiased`}>
          {" "}
          <ReportDataProvider>{children}</ReportDataProvider>
      </body>
    </html>
  );
}
