 // app/api/users/route.ts

import { NextResponse } from 'next/server';

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  alternate_email: string;
  password: string;
  age: number;
};

let users: User[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    alternate_email: 'john.alt@example.com',
    password: 'hashed_password_1',
    age: 30,
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    alternate_email: 'jane.alt@example.com',
    password: 'hashed_password_2',
    age: 25,
  },
];

// GET: Fetch all users
export async function GET() {
  return NextResponse.json(users);
}

// POST: Add a new user
export async function POST(request: Request) {
  const newUser: Omit<User, 'id'> = await request.json();
  const user = { ...newUser, id: (users.length + 1).toString() };
  users.push(user);
  return NextResponse.json(user);
}

// PUT: Update a user
export async function PUT(request: Request) {
  const updatedUser: User = await request.json();
  users = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
  return NextResponse.json(updatedUser);
}

// DELETE: Remove a user
export async function DELETE(request: Request) {
  const { id }: { id: string } = await request.json();
  users = users.filter((user) => user.id !== id);
  return NextResponse.json({ success: true });
}
