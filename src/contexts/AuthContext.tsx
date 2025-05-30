"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

type UserRole = 'consumer' | 'logistics' | 'seller';

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  isAuthenticated: boolean;
  setUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: UserRole) => {
    try {
      // Dummy signup response
      const dummyResponse = {
        token: `dummy_token_${Date.now()}`,
        user: {
          id: `user_${Date.now()}`,
          email,
          role
        }
      };

      localStorage.setItem('token', dummyResponse.token);
      setUser(dummyResponse.user);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // For now, we'll use the stored dummy data
      const token = localStorage.getItem('token');
      if (token) {
        const storedUser = {
          id: token.split('_')[2],
          email,
          role: 'consumer' as UserRole
        };
        setUser(storedUser);
      } else {
        throw new Error('No user found');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const setUserRole = async (role: UserRole) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) throw new Error('Not authenticated');

      const response = await axios.put('/api/user/role', 
        { role },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUser({ ...user, role: response.data.role });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      signup, 
      isAuthenticated: !!user,
      setUserRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}