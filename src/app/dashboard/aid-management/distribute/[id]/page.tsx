import { Metadata } from "next";
import MainLayout from "@/components/Layouts/MainLayout";
import AidDistribution from "@/components/Dashboard/aid-distribution";

export const metadata: Metadata = {
  title: "CCAMS Aid Distribution",
  description: "Aid Distribution Management for CCAMS",
};

export default function Page({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <AidDistribution programId={params.id} />
    </MainLayout>
  );
} 