import React from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import clsx from "clsx";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth",
  description: "Generated by create next app",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="end">
      <body className={clsx("bg-dark-1", inter.className)}>{children}</body>
    </html>
  );
};

export default RootLayout;