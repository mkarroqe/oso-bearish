'use client';

import { useUser } from '@/contexts/UserContext';
import type { User } from '@/types/user';

export function UserSwitcher() {
  const { currentUser, users, login, logout } = useUser();

  if (!currentUser) {
    // Categorize users by their permissions
    const readers = users.filter(user => ['basic', 'premium'].includes(user.role));
    const writers = users.filter(user => ['analyst', 'admin'].includes(user.role));

    const UserButton = ({ user }: { user: User }) => {
      const getGroupBadge = () => {
        if (user.role !== 'analyst' || !user.groups?.length) return null;
        
        const groupNames = user.groups.map((group: string) => 
          group.charAt(0).toUpperCase() + group.slice(1)
        ).join(', ');
        
        return (
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-2 inline-block">
            {groupNames} Analyst
          </div>
        );
      };

      return (
        <button
          key={user.id}
          onClick={() => login(user.id)}
          className="text-left p-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <div className="font-medium text-slate-800">{user.firstName} {user.lastName}</div>
          <div className="text-sm text-slate-500">{user.email}</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
            {user.role}
          </div>
          {getGroupBadge()}
        </button>
      );
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
        <h2 className="text-lg font-medium text-slate-700 mb-6">who shall you be?</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Readers Column */}
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
              📖 Readers (View Only)
            </h3>
            <div className="grid gap-3">
              {readers.map((user) => <UserButton key={user.id} user={user} />)}
            </div>
          </div>

          {/* Writers Column */}
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
              📝 Writers (Can Modify)
            </h3>
            <div className="grid gap-3">
              {writers.map((user) => <UserButton key={user.id} user={user} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-slate-200/50 px-4 py-3 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
          <span className="text-slate-600 font-medium text-sm">
            {currentUser.firstName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium text-slate-800">{currentUser.firstName} {currentUser.lastName}</div>
          <div className="text-sm text-slate-500">
            {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Account
            {currentUser.role === 'analyst' && currentUser.groups?.length > 0 && (
              <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {currentUser.groups.map((group: string) => 
                  group.charAt(0).toUpperCase() + group.slice(1)
                ).join(', ')} Analyst
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={logout}
        className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
      >
        Switch User
      </button>
    </div>
  );
}