'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import UploadModal from '@/components/upload/UploadModal';
import { StoreProvider, useStore } from '@/lib/context/StoreContext';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isUploadOpen, setIsUploadOpen, addDocument } = useStore();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={addDocument}
      />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </StoreProvider>
  );
}
