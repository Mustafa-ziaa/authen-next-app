'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllTransection, getWalletTransection } from '@/app/actions/transection.action';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search, 
  SlidersHorizontal, 
  Wallet, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Loader2, 
  Calendar, 
  DollarSign,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

// Chart.js global library setups
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AllTransactionsAnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Interactive UI filter configurations
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'AMOUNT_DESC'>('NEWEST');

  useEffect(() => {
    async function loadGlobalLedger() {
      try {
        // Passing 'all' or empty string depending on how your action routes query parameters
        const res = await getAllTransection(); 
        if (res.success && res.transections) {
          setTransactions(res.transections);
        }
      } catch (err) {
        console.error("Failed loading total transactions landscape overview:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGlobalLedger();
  }, []);

  // --- Search and Matrix Filters pipeline ---
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesSearch = (tx.descrption || tx.description || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'OLDEST') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'AMOUNT_DESC') return b.amount - a.amount;
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, sortBy]);

  // --- Complete Analytics Computations ---
  const analytics = useMemo(() => {
    let income = 0;
    let expense = 0;
    const walletDistribution: { [key: string]: { income: number; expense: number; count: number } } = {};
    
    // Monthly aggregation array setup (Last 6 updates)
    const temporalData: { [key: string]: { income: number; expense: number } } = {};

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      const wId = tx.walletId || 'Unknown Wallet';

      // Global Summation metrics
      if (tx.type === 'INCOME') income += amt;
      else if (tx.type === 'EXPENSE') expense += amt;

      // Distribution mapping per individual dynamic wallet
      if (!walletDistribution[wId]) {
        walletDistribution[wId] = { income: 0, expense: 0, count: 0 };
      }
      walletDistribution[wId].count += 1;
      if (tx.type === 'INCOME') walletDistribution[wId].income += amt;
      else walletDistribution[wId].expense += amt;

      // Temporal Timeline mapping
      const dateLabel = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent';
      if (!temporalData[dateLabel]) {
        temporalData[dateLabel] = { income: 0, expense: 0 };
      }
      if (tx.type === 'INCOME') temporalData[dateLabel].income += amt;
      else temporalData[dateLabel].expense += amt;
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      netCashflow: income - expense,
      walletDistribution,
      temporalData
    };
  }, [transactions]);

  // --- Canvas Charts Configurations ---
  const pieChartData = {
    labels: ['Total Revenue Intake', 'Total Overhead Expense'],
    datasets: [
      {
        data: [analytics.totalIncome, analytics.totalExpense],
        backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.85)'],
        borderColor: ['#10b981', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(analytics.temporalData).slice(-7),
    datasets: [
      {
        label: 'Inflows',
        data: Object.values(analytics.temporalData).slice(-7).map(d => d.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Outflows',
        data: Object.values(analytics.temporalData).slice(-7).map(d => d.expense),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const barChartData = {
    labels: Object.keys(analytics.walletDistribution).map(id => `Wallet ...${id.slice(-4)}`),
    datasets: [
      {
        label: 'Expenses by Wallet Allocation',
        data: Object.values(analytics.walletDistribution).map(w => w.expense),
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderRadius: 6
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Compiling Analytical Canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 space-y-6">
      
      {/* Structural Hero Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Global Financial Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Cross-wallet transactional overview and canvas computation layout feeds.</p>
        </div>
      </div>

      {/* Global Meta-Metrics Aggregated Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Global Gross Income</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">${analytics.totalIncome.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 flex items-center justify-center shrink-0">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Expenditures</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">${analytics.totalExpense.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Net Cashflow Matrix</span>
            <span className={`text-lg font-bold ${analytics.netCashflow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${analytics.netCashflow.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Wallets Involved</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {Object.keys(analytics.walletDistribution).length} Accounts
            </span>
          </div>
        </div>
      </div>

      {/* Main Analysis Chart Canvas Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 self-start mb-4">
            <PieChart className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-500 uppercase">Volume Allocation Split</h3>
          </div>
          <div className="w-full max-w-[210px] aspect-square flex items-center justify-center">
            {transactions.length > 0 ? (
              <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            ) : (
              <p className="text-xs text-slate-400">No chart elements ready</p>
            )}
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm md:col-span-2 flex flex-col">
          <div className="flex items-center gap-1.5 mb-4">
            <LineChart className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-500 uppercase">Velocity Trendline Profile</h3>
          </div>
          <div className="w-full h-48">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm md:col-span-3 flex flex-col">
          <div className="flex items-center gap-1.5 mb-4">
            <BarChart3 className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-500 uppercase">Distribution Across Decentralized Wallets</h3>
          </div>
          <div className="w-full h-44">
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Interactive Operations Query & Filtering Row */}
      <div className="bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex items-center w-full sm:max-w-xs">
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search details description..." 
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-50 dark:bg-slate-950 rounded-xl p-1 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button onClick={() => setTypeFilter('ALL')} className={`px-2.5 py-1 rounded-lg transition-all ${typeFilter === 'ALL' ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600' : 'text-slate-500'}`}>All</button>
            <button onClick={() => setTypeFilter('INCOME')} className={`px-2.5 py-1 rounded-lg transition-all ${typeFilter === 'INCOME' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600' : 'text-slate-500'}`}>Income</button>
            <button onClick={() => setTypeFilter('EXPENSE')} className={`px-2.5 py-1 rounded-lg transition-all ${typeFilter === 'EXPENSE' ? 'bg-white dark:bg-slate-900 shadow-sm text-rose-600' : 'text-slate-500'}`}>Expenses</button>
          </div>

          <select 
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="text-xs font-semibold border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl p-2 outline-none focus:border-blue-500"
          >
            <option value="NEWEST">Sort: Newest First</option>
            <option value="OLDEST">Sort: Oldest First</option>
            <option value="AMOUNT_DESC">Sort: Higher Value Magnitude</option>
          </select>
        </div>
      </div>

      {/* Itemized Micro-Feeds List Grid Layout */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase px-1 tracking-wider">Itemized Logs Feed</div>
        
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800/60 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <AnimatePresence initial={false}>
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs font-medium text-slate-400">
                No indexed transactions match current filter configurations.
              </div>
            ) : (
              filteredTransactions.map((tx: any, idx: number) => (
                <motion.div
                  key={tx.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors"
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
                      {/* Typo exact schema match configuration */}
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tx.descrption || tx.description || 'No notes left'}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 mt-1 font-medium">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'}</span>
                        <span>•</span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500">ID: ...{tx.walletId?.slice(-6) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-2 sm:pt-0 border-slate-50">
                    <span className={`text-sm font-black tracking-tight ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    
                    {/* Action Route Interaction to direct link dynamically to wallet tracking code */}
                    <button
                      onClick={() => router.push(`/admin/wallets/${tx.walletId}/new-transection`)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/60 py-1.5 px-3 rounded-xl transition-all"
                    >
                      Inspect Wallet <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}