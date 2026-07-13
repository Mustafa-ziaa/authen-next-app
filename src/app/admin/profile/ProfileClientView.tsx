// src/app/admin/profile/ProfileClientView.tsx
'use client';

import React from 'react';
import { LogOut, User, Mail, Shield, Code, Activity, TrendingUp, Smartphone, Globe } from "lucide-react";

// إعدادات مكتبة المخططات البيانية Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProfileClientViewProps {
  initialUser: { id: string; name: string; email: string; image: string };
  sessionRawData: any;
  signoutAction: () => Promise<void>;
}

export default function ProfileClientView({ initialUser, sessionRawData, signoutAction }: ProfileClientViewProps) {
  
  // بيانات الـ Chart التجريبية المتوافقة مع التصميم
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Console Velocity',
        data: [35, 55, 42, 78, 62, 25, 44],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#3b82f6',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { display: false }, ticks: { display: false } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 space-y-6 text-slate-900 dark:text-white">
      
      {/*Decorative Top Banner */}
      <div className="relative h-32 w-full rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px] opacity-30" />
      </div>

      {/* Main Structural Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 -mt-16 relative z-10 px-2">
        
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
            
            <div className="relative h-24 w-24 mb-4">
              <img 
                src={initialUser.image} 
                alt={initialUser.name} 
                className="h-full w-full rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-md" 
              />
            </div>

            <h2 className="text-xl font-bold tracking-tight">{initialUser.name}</h2>
            <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1 justify-center">
              <Shield className="w-3.5 h-3.5" /> ID: {initialUser.id}
            </p>

            <form action={signoutAction} className="w-full mt-5">
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:text-white border border-red-100 hover:border-red-600 hover:bg-red-600 rounded-xl transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign out Account
              </button>
            </form>

            <hr className="w-full my-5 border-slate-100 dark:border-slate-800" />

            <div className="w-full space-y-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Role Authority</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">Standard User</span>
              </div>
            </div>
          </div>

          {/* Active Sessions Panel */}
          <div className="bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Authorization Session</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                <Smartphone className="h-4 w-4 text-blue-500" />
                <div className="text-xs min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">Current Workspace Device</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Active Session</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chart + Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Chart Component Panel */}
          <div className="bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interface Performance Velocity</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Secure Gateway
              </span>
            </div>
            <div className="w-full h-40">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          {/* Details Form Grid */}
          <div className="bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Meta Fields</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-xl">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Display Profile Name</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{initialUser.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Core Routing Email</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{initialUser.email}</p>
                </div>
              </div>
            </div>

            {/* Inspect Section */}
            <div className="pt-2">
              <details className="group border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/20 cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/40">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Code className="w-4 h-4 text-slate-400" />
                    <span>Inspect Auth Session Data</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-open:hidden">Expand Payload</span>
                  <span className="text-[10px] font-bold text-slate-400 hidden group-open:inline">Hide</span>
                </summary>
                <div className="p-4 bg-slate-900 border-t border-slate-800 overflow-x-auto max-h-60">
                  <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                    {JSON.stringify(sessionRawData, null, 2)}
                  </pre>
                </div>
              </details>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}