// app/dashboard/layout.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        {/* Navigation Panel */}
        <div className="w-1/4 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <ul>
            <li
              className={`p-2 rounded hover:bg-gray-600 ${
                pathname === '/dashboard/users' ? 'bg-gray-600' : 'bg-gray-700'
              }`}
            >
              <Link href="/dashboard/users" className="block">
                Users
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-8 bg-gray-100 overflow-y-auto">
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
}
