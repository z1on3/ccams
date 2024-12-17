import { Metadata } from "next";
import React from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import AidManagement from "@/components/Dashboard/aid-management";

export const metadata: Metadata = {
  title: "CCAMS Aid Management",
  description: "Aid Management Dashboard for CCAMS",
};

export default function Page() {
  return (
    <MainLayout>
      <AidManagement />
    </MainLayout>
  );
} 