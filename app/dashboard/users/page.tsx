// app/dashboard/users/page.tsx

'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef, useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { fetchUsers, addUser, updateUser, deleteUser, User } from '../../lib/userApi';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialData: [],
  });

  const addMutation = useMutation({
    mutationFn: (newUser: Omit<User, 'id'>) => addUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedUser: User) => updateUser(updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditing(false);
      setCurrentUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
    }
  });

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
          <div className="flex space-x-2">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
    setCurrentUser(user);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdate = () => {
    if (currentUser) {
      updateMutation.mutate(currentUser);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 mb-4 rounded"
        onClick={handleAdd}
      >
        Add User
      </button>

      <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {isEditing && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={currentUser.first_name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, first_name: e.target.value })
                }
                placeholder="First Name"
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={currentUser.last_name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, last_name: e.target.value })
                }
                placeholder="Last Name"
              />
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                placeholder="Email"
              />
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={currentUser.alternate_email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, alternate_email: e.target.value })
                }
                placeholder="Alternate Email"
              />
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={currentUser.password}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, password: e.target.value })
                }
                placeholder="Password (hashed)"
              />
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={currentUser.age}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, age: parseInt(e.target.value) })
                }
                placeholder="Age"
                min={18}
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
