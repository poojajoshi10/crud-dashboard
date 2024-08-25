// lib/userApi.ts
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    alternate_email: string;
    password: string;
    age: number;
  }
  
  const API_URL = '/api/users';
  
  export async function fetchUsers(): Promise<User[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }
  
  export async function addUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to add user');
    }
    return response.json();
  }
  
  export async function updateUser(user: User): Promise<User> {
    const response = await fetch(`${API_URL}/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return response.json();
  }
  
  export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }
  