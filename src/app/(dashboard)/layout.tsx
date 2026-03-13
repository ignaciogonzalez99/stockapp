'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileSidebar } from '@/components/MobileSidebar';
import { TopBar } from '@/components/TopBar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <MobileSidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar onMenuClick={() => setIsMobileSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
