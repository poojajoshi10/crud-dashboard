// app/dashboard/users/page.tsx

'use client';

import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef, useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { fetchUsers, addUser, updateUser, deleteUser, User } from '../../lib/userApi';

export default function UsersPage() {
  const queryClient = useQueryClient();

  // Fetch users using React Query
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialData: [], // Provide an initial empty array to avoid type errors
  });

  // Define mutations for add, update, and delete operations
  const addMutation = useMutation({
    mutationFn: (newUser: Omit<User, 'id'>) => addUser(newUser),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedUser: User) => updateUser(updatedUser),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  // Define table columns using Tanstack Table
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      { accessorKey: 'first_name', header: 'First Name' },
      { accessorKey: 'last_name', header: 'Last Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'alternate_email', header: 'Alternate Email' },
      { accessorKey: 'password', header: 'Password (hashed)' },
      { accessorKey: 'age', header: 'Age' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="space-x-2">
            <button
              className="bg-yellow-500 text-white px-2 py-1"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Create the table instance using Tanstack Table
  const table = useReactTable({
    data: users, // This is guaranteed to be an array
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handlers for CRUD operations
  const handleAdd = () => {
    const newUser: Omit<User, 'id'> = {
      first_name: 'New',
      last_name: 'User',
      email: 'new.user@example.com',
      alternate_email: 'new.user.alt@example.com',
      password: 'hashed_password',
      age: 22,
    };
    addMutation.mutate(newUser);
  };

  const handleEdit = (user: User) => {
    const updatedUser = { ...user, first_name: 'Updated' };
    updateMutation.mutate(updatedUser);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <button className="bg-blue-500 text-white p-2 mb-4" onClick={handleAdd}>
        Add User
      </button>
      <table className="min-w-full bg-white border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 border">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
