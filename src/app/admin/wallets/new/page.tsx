// app/admin/wallets/new/page.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addWallet, addWalletType } from '@/app/actions/wallet.action'; // Adjust path to your action file
import { Wallet, DollarSign, Globe, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function NewWalletPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    
    const data: addWalletType = {
      name: formData.get('name') as string,
      balance: Number(formData.get('balance')),
      currency: formData.get('currency') as string,
    };

    // Execute server action cleanly using transitions
    startTransition(async () => {
      try {
        const result = await addWallet(data);
        setStatus({ success: result.success, message: result.message });
        
        if (result.success) {
          // Reset form fields safely on success
          (e.target as HTMLFormElement).reset();
          // Optinal: redirect back to wallets or summary page after 1.5 seconds
          setTimeout(() => router.push('/admin'), 1500);
        }
      } catch (err) {
        setStatus({ success: false, message: 'An unexpected error occurred. Please try again.' });
      }
    });
  };

  return (
    <div className="mx-auto max-w-xl py-6">
      {/* Page Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Wallet</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Set up a new personal wallet asset tracking balances across currencies.</p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Status Banners */}
          {status && (
            <div className={`flex items-start gap-3 rounded-xl p-3 text-sm font-medium border
              ${status.success 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50' 
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50'
              }`}
            >
              {status.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          {/* Wallet Name input */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Wallet Name
            </label>
            <div className="relative flex items-center">
              <Wallet className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g., Chase Checkings, Crypto Node"
                className="w-full rounded-xl border border-slate-200 bg-black py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-black focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/50"
              />
            </div>
          </div>

          {/* Balance & Currency (Grid Layout) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* Initial Balance */}
            <div className="space-y-1.5">
              <label htmlFor="balance" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Starting Balance
              </label>
              <div className="relative flex items-center">
                <DollarSign className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="balance"
                  name="balance"
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-black py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-black focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/50"
                />
              </div>
            </div>

            {/* Currency Select */}
            <div className="space-y-1.5">
              <label htmlFor="currency" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Currency Base
              </label>
              <div className="relative flex items-center">
                <Globe className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  id="currency"
                  name="currency"
                  required
                  defaultValue="USD"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-black py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-black focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-black dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/50"
                >
                  <option className='bg-black' value="USD">USD ($)</option>
                  <option className='bg-black' value="EUR">EUR (€)</option>
                  <option className='bg-black' value="GBP">GBP (£)</option>
                  <option className='bg-black' value="IQD">IQD (ع.د)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Submit Action Control */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-blue-600/10 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Wallet...
              </>
            ) : (
              'Create Wallet'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}