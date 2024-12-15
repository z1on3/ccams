import ProgramDetails from '@/components/Dashboard/program-details';
import MainLayout from '@/components/Layouts/MainLayout';

export default function ProgramDetailsPage({ params }: { params: { id: string } }) {
  return (
    <>
    <MainLayout>
        
 
      <ProgramDetails programId={params.id} />
    
    </MainLayout>
    </>
  );
} 