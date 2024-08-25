// lib/userApi.ts

export type User = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    alternate_email: string;
    password: string;
    age: number;
  };
  
  // Fetch users from the API
  export async function fetchUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    return response.json();
  }
  
  // Add a new user
  export async function addUser(newUser: Omit<User, 'id'>): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    return response.json();
  }
  
  // Update an existing user
  export async function updateUser(updatedUser: User): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });
    return response.json();
  }
  
  // Delete a user
  export async function deleteUser(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`/api/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    return response.json();
  }
  