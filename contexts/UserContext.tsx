'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserPermissions } from '@/types/user';
import { mockUsers } from '@/data/mock-users';
import { getUserPermissionsFromServer } from '@/lib/client-auth';

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
  const [permissions, setPermissions] = useState<UserPermissions>({
    canViewAllStocks: false,
    canModifyStocks: false,
    canViewRecs: false,
    canModifyRecs: false
  });

  useEffect(() => {
    if (currentUser) {
      // Fetch permissions from server using Oso
      getUserPermissionsFromServer(currentUser.id).then(setPermissions);
    } else {
      // Reset to default permissions when logged out
      setPermissions({
        canViewAllStocks: false,
        canModifyStocks: false,
        canViewRecs: false,
        canModifyRecs: false
      });
    }
  }, [currentUser]);

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