import Header from '@/components/dashboard/header/header';
import Sidebar from '@/components/dashboard/sidebar/sidebar';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const AdminDashboardLayout = async ({ children }: { children: ReactNode }) => {
  // block access if not admin
  const user = await currentUser();
  if (!user?.privateMetadata || user?.privateMetadata.role !== 'ADMIN')
    redirect('/');
  return (
    <div className='w-full h-full'>
      <Sidebar isAdmin />
      <div className='w-full ml-[300px]'>
        <Header />
        <div className='w-full mt-[75px] p-4'>{children}</div>
      </div>
    </div>
  );
};
export default AdminDashboardLayout;
