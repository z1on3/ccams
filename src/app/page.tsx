import { Metadata } from "next";
import React from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import MainDash from "@/components/Dashboard/main-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <>
      <MainLayout>
        <MainDash />
      </MainLayout>
    </>
  );
}
