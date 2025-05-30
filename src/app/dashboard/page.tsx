'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
   };

  return (
    <div className="p-4">
      <h1>Welcome, {user?.email}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
     </div>
  );
}