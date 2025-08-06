'use client';

import { useUser } from '@/contexts/UserContext';

export function UserSwitcher() {
  const { currentUser, users, login, logout } = useUser();

  if (!currentUser) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
        <h2 className="text-lg font-medium text-slate-700 mb-4">Choose User Account</h2>
        <div className="grid gap-3">
          {users.map((user) => (
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
            </button>
          ))}
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