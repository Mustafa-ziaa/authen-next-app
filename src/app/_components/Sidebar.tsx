'use client'; // Added to use client-side hooks like usePathname

import React from 'react';
import Link from 'next/link'; 
import { usePathname } from 'next/navigation'; // Imported to trace the active navigation route
import { Settings, Wallet, History, PlusCircle, Layers } from 'lucide-react';

interface SidebarProps {
  user: { name: string; email: string; image: string };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname(); // Get current active route

  const menuItems = [
    { label: 'My Wallets', icon: Wallet, href: '/admin', variant: 'nav' },
    { label: 'My Transactions', icon: History, href: '/admin/transactions', variant: 'nav' },
    { label: 'Settings', icon: Settings, href: '#', variant: 'nav' },
    { label: 'Add New Wallet', icon: PlusCircle, href: '/admin/wallets/new', variant: 'action' },
    { label: 'Add New Transaction', icon: PlusCircle, href: '#', variant: 'action' },
  ];

  return (
    <aside className="hidden lg:flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-200 dark:border-slate-800">
        <Layers className="h-6 w-6 text-blue-600" />
        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">FinAdmin</span>
      </div>

      <div className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isAction = item.variant === 'action';
          
          // Check if current route matches exactly
          const isActive = pathname === item.href; 

          return (
            <Link
              key={index}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all text-left
                ${isAction 
                  ? isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 mt-4' // Active custom state for action buttons
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/70 mt-4' 
                  : isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10' // Active state: Blue background and white text
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                }`}
            >
              <Icon className={`h-5 w-5 
                ${isAction 
                  ? isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400' 
                  : isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                }`} 
              />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* User profile section */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
         <div className="flex items-center gap-3 rounded-xl p-2">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name} 
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md shadow-blue-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex flex-col min-w-0 flex-1">
            <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
              {user.name}
            </span>
            <span className="truncate text-xs text-slate-400 dark:text-slate-500">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}