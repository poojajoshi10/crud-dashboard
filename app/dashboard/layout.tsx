// app/dashboard/layout.tsx

import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className="w-4/5 p-4">{children}</main>
      <nav className="w-1/5 bg-gray-200 p-4">
        <ul>
          <li>
            <Link href="/dashboard/users" className="text-blue-600 hover:underline">
              Users
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
