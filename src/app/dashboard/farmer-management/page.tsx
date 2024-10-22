import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import MainDash from "@/components/Dashboard/main-dashboard";
import FarmerManagement from "@/components/Dashboard/farmer-management";

export const metadata: Metadata = {
  title:
    "CCAMS Dashboard",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <>
      <MainLayout>
        <FarmerManagement />
      </MainLayout>
    </>
  );
}
