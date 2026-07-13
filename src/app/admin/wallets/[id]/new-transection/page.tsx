'use client';

import React, { useState, useTransition, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { addTransection, getWalletTransection, addTransectiontType } from '@/app/actions/transection.action'; 
import { getWalletById } from "@/app/actions/wallet.action";
import { ArrowLeft, DollarSign, FileText, ArrowDownCircle, ArrowUpCircle, Loader2, AlertCircle, CheckCircle2, BarChart3, PieChart, Activity, CreditCard, History, Calendar } from 'lucide-react';

// ChartJS elements canvas registrations
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WalletTransactionAndAnalyticsPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const walletId = resolvedParams.id;

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedType, setSelectedType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  
  // Wallet states & corresponding Transaction data matrices
  const [wallet, setWallet] = useState<any>(null);
  const [pastTransactions, setPastTransactions] = useState<any[]>([]);
  const [txMessage, setTxMessage] = useState<string>('');
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Core routine loading database records securely through actions
  const loadPageContent = async () => {
    try {
      // 1. Fetch target wallet profile details
      const walletRes = await getWalletById(walletId);
      if (walletRes.success && walletRes.wallet) {
        setWallet(walletRes.wallet);
      }

      // 2. Fetch comprehensive transaction history logs
      const txRes = await getWalletTransection(walletId);
      setTxMessage(txRes.message);
      
      if (txRes.success && txRes.transections) {
        setPastTransactions(txRes.transections);
      } else {
        setPastTransactions([]);
      }
    } catch (err) {
      console.error("Error loading wallet details inside analytics canvas view:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadPageContent();
  }, [walletId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const data: addTransectiontType = {
      amount: Number(formData.get('amount')),
      descrption: formData.get('descrption') as string, // Matches schema field typo exactly
      type: selectedType,
      walletId: walletId,
      userId: 'session-id-fallback' 
    };

    startTransition(async () => {
      try {
        const result = await addTransection(data);
        setStatus({ success: result.success, message: result.message });
        
        if (result.success) {
          (e.target as HTMLFormElement).reset();
          // Instantly refresh analytical computations, layout totals, and feeds
          loadPageContent();
        }
      } catch (err) {
        setStatus({ success: false, message: 'Something went wrong. Please try again.' });
      }
    });
  };

  // --- Real-time Analytics Computations ---
  const totalIncome = pastTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = pastTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const pieData = {
    labels: ['Income In', 'Expense Out'],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.85)'],
        borderColor: ['#10b981', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: pastTransactions.slice(-6).map((_, i) => `Tx #${i + 1}`),
    datasets: [
      {
        label: 'Transaction Magnitude',
        data: pastTransactions.slice(-6).map(t => t.amount),
        backgroundColor: pastTransactions.slice(-6).map(t => t.type === 'INCOME' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'),
        borderRadius: 8
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl py-4 space-y-6 px-2">
      
      {/* Header and Back Link Navigation Row */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => router.push('/admin')} 
          className="flex w-fit items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Wallet Ledger & Analytics</h1>
      </div>

      {/* Profile Header Block Details */}
      {wallet && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:border-slate-800 dark:from-slate-900/60 dark:to-slate-900/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/10">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Active Account</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{wallet.name}</h2>
            </div>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Current Available Ledger Balance</span>
            <div className="flex items-baseline gap-1.5 sm:justify-end mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                {wallet.currency}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Structural Splitting Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Column Group Left: Interactive Flow Logger Form Control */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-fit"
        >
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">Log New Flow</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {status && (
              <div className={`flex items-start gap-3 rounded-xl p-3 text-sm font-medium border ${status.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20'}`}>
                {status.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                <span>{status.message}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType('EXPENSE')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${selectedType === 'EXPENSE' ? 'border-rose-200 bg-rose-50/50 text-rose-700 ring-2 ring-rose-500/10' : 'border-slate-200 text-slate-600'}`}
              >
                <ArrowUpCircle className="h-4 w-4" /> Expense
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('INCOME')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${selectedType === 'INCOME' ? 'border-emerald-200 bg-emerald-50/50 text-emerald-700 ring-2 ring-emerald-500/10' : 'border-slate-200 text-slate-600'}`}
              >
                <ArrowDownCircle className="h-4 w-4" /> Income
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="amount" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Value Amount</label>
              <div className="relative flex items-center">
                <DollarSign className="absolute left-3 h-4 w-4 text-slate-400" />
                <input id="amount" name="amount" type="number" step="any" required placeholder="0.00" className="w-full rounded-xl border border-slate-200 bg-black py-2 pl-9 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-black dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="descrption" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Description Notes</label>
              <div className="relative flex items-start">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <textarea id="descrption" name="descrption" required rows={2} placeholder="Itemized descriptive details..." className="w-full rounded-xl border border-slate-200 bg-black py-2 pl-9 pr-4 text-sm text-white outline-none focus:border-blue-500 focus:bg-black dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
              </div>
            </div>

            <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all disabled:opacity-50">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log Transaction'}
            </button>
          </form>
        </motion.div>

        {/* Column Group Right: Visual Analytic Canvas Charts and Transaction Archive Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Quick Value Counter Metrics row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Total Income Intake</span>
              <span className="text-xl font-bold text-emerald-600 mt-1 block">${totalIncome.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Total Expense Payout</span>
              <span className="text-xl font-bold text-rose-600 mt-1 block">${totalExpense.toLocaleString()}</span>
            </div>
          </div>

          {/* Conditional Loader / Interactive Matrix Modules Layout */}
          {loadingData ? (
            <div className="h-64 flex items-center justify-center bg-white border rounded-2xl dark:bg-slate-900 dark:border-slate-800">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : pastTransactions.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center bg-white border border-dashed rounded-2xl text-slate-400 dark:bg-slate-900 dark:border-slate-800 p-6 text-center">
              <Activity className="h-8 w-8 mb-2 text-slate-300" />
              {/* Displays server empty status fallback text message perfectly */}
              <p className="text-sm font-medium">{txMessage || "No metrics dashboard available yet"}</p>
              <p className="text-xs text-slate-400 mt-0.5">Data canvas visual graphs initialize once your first transactional entries populate.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Analytics Dynamic Graphs Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm flex flex-col items-center">
                  <div className="flex items-center gap-1.5 self-start mb-2">
                    <PieChart className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase">Volume Distribution</h3>
                  </div>
                  <div className="w-full max-w-[200px] aspect-square">
                    <Pie data={pieData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BarChart3 className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase">Recent Flows Magnitude</h3>
                  </div>
                  <div className="w-full h-full min-h-[180px]">
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                  </div>
                </div>
              </div>

              {/* Transactions History Feed Block Container */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 px-1">
                  <History className="h-4 w-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">All Wallet Transactions</h3>
                </div>

                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800/60 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                  <AnimatePresence initial={false}>
                    {pastTransactions.map((tx: any, idx: number) => (
                      <motion.div
                        key={tx.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center justify-between p-4 hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border 
                            ${tx.type === 'INCOME' 
                              ? 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-950 dark:bg-emerald-950/30' 
                              : 'border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-950 dark:bg-rose-950/30'
                            }`}
                          >
                            {tx.type === 'INCOME' ? <ArrowDownCircle className="h-4 w-4" /> : <ArrowUpCircle className="h-4 w-4" />}
                          </div>
                          <div>
                            {/* Matches matching schema field typo 'descrption' exactly */}
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{tx.descrption}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              <span>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right pl-4">
                          <span className={`text-sm font-bold tracking-tight ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}