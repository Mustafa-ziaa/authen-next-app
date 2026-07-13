'use client';

import React, { useState } from 'react';
import { Bell, Search, Menu, ChevronDown, User, Settings, LogOut, X, CreditCard,PlusCircle,Wallet, LayoutDashboard, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link'; 

interface HeaderProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Added mobile menu open state

  const mobileNavItems = [
    { label: 'My Wallets', icon: Wallet, route: '/admin' },
    { label: 'My Transactions', icon: History, route: '/admin/transactions' },
    { label: 'Add New Wallet', icon: PlusCircle, route: '/admin/wallets/new' },
    { label: 'Add New Transaction', icon: PlusCircle, route: '#' },
    { label: 'setting', icon: Settings, route: '#' }
  ];
  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:px-6">
        
        {/* Left Area */}
        <div className="flex items-center gap-4">
          {/* Menu burger button fixed with state toggle click interaction */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
          >
            <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          
          <div className="hidden flex-col md:flex">
            <h1 className="text-sm font-semibold text-slate-900 dark:text-white">Overview</h1>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full max-w-xs md:max-w-md px-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full rounded-xl border border-slate-200 bg-black py-1.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:black focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/50"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Dynamic User Profile Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {user.image ? (
                <img src={user.image} alt={user.name} className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-950 z-20">
                  <div className="px-3 py-2 text-xs border-b border-slate-100 dark:border-slate-900 mb-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                    <p className="text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">
                    <Link className='flex w-full items-center gap-2' href="/admin/profile"><User className="h-4 w-4" /> Account Details</Link>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">
                    <Settings className="h-4 w-4" /> Settings
                  </button>
                  <hr className="my-1 border-slate-100 dark:border-slate-900" />
                  <button onClick={async ()=> await signOut()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark background backdrop click protector shield */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />

            {/* Sliding navigation drawer sheet */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col bg-white p-5 border-r border-slate-100 shadow-xl dark:bg-slate-950 dark:border-slate-900 lg:hidden"
            >
              {/* Header inside mobile drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-900">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                    A
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Admin Hub</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Dynamic Route Nav Links List mapping layout inside drawer */}
              <nav className="mt-5 space-y-1.5 flex-1">
                {mobileNavItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push(item.route);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-all"
                    >
                      <IconComponent className="h-4 w-4 text-slate-400 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Bottom footer card container profile helper */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center gap-2.5">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="h-8 w-8 rounded-lg object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}