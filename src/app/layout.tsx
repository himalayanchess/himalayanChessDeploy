"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const theme = createTheme({
  components: {
    // Customizing the Button component
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Remove default uppercase transformation
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider theme={theme}>
          <SessionProvider>
            <ToastContainer />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
