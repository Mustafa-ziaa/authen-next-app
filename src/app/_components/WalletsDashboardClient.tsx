'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, Plus, ArrowUpRight, TrendingUp, CreditCard, Sparkles } from 'lucide-react';

interface WalletItem {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface ClientProps {
  initialWallets: WalletItem[];
}

// Animation Variants for Parent Container Staggering
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

// Animation Variants for Individual Cards
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

export default function WalletsDashboardClient({ initialWallets }: ClientProps) {
  const totalBalance = initialWallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      
      {/* Top Heading Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              My Financial Wallets
            </h1>
            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor asset allocations and live currency balances across portfolios.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            href="/admin/wallets/new" 
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Wallet
          </Link>
        </motion.div>
      </div>

      {/* Net Worth Dashboard Overview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-sm group"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl transition-transform group-hover:scale-150 duration-700" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Net Assets</span>
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">USD Total</span>
        </div>
      </motion.div>

      {/* Wallets Dynamic Listing Grid */}
      <div>
        <h2 className="mb-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Active Accounts ({initialWallets.length})
        </h2>
        
        {initialWallets.length === 0 ? (
          /* Empty State Screen View */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="rounded-2xl bg-slate-50 p-4 text-slate-400 dark:bg-slate-950 animate-bounce">
              <Wallet className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">No active wallets found</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Get started by creating your initial wallet profile.</p>
            <Link href="/admin/wallets/new" className="mt-4 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
              Create your first wallet &rarr;
            </Link>
          </motion.div>
        ) : (
          /* Animated Grid Layout cards loop */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {initialWallets.map((wallet) => (
              <motion.div 
                key={wallet.id} 
                whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/50">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {wallet.name}
                      </h3>
                    </div>
                    <div className="rounded-lg p-1.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <Link href={`/admin/wallets/${wallet.id}/new-transection`}><ArrowUpRight className="h-4 w-4 text-blue-500" /></Link>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      {wallet.currency}
                    </span>
                  </div>
                </div>

                {/* Micro-interactive subtle visual underline anchor */}
                <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}