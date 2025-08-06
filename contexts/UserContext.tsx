'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { User, UserPermissions } from '@/types/user';
import { mockUsers, getUserPermissions } from '@/data/mock-users';

interface UserContextType {
  currentUser: User | null;
  permissions: UserPermissions;
  login: (userId: string) => void;
  logout: () => void;
  users: User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const permissions = currentUser ? getUserPermissions(currentUser.role) : {
    canViewAllStocks: false,
    canModifyStocks: false,
    canViewRecs: false,
    canModifyRecs: false
  };

  const login = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      permissions,
      login,
      logout,
      users: mockUsers
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}