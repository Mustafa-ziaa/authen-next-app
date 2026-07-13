'use client'

import { Mail, Lock, LoaderCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import z from "zod";
import { useState } from "react";
import { loginAction, type loginData } from "@/app/actions/auth.action";
import { Message } from "@/app/_components/message";
import { signIn } from "next-auth/react";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [invalid, setInvalid] = useState(false); 
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    const data: loginData = { email, password };
    const response = await loginAction(data);
    setShowMessage(true);
    setLoading(false);
    
    if (!response.success) {
      setInvalid(true);
      setMessage(response.message as string);
    } else {
      setInvalid(false);
      setMessage(response.message as string);
      setEmail('');
      setPassword('');
    }

    setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950 px-4 py-12 transition-colors duration-300">
      
      {/* Geometric background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-xl shadow-slate-100/40 dark:shadow-none overflow-hidden transition-all duration-300 relative z-10">
        <div className="p-8 sm:p-10">
          
          {/* Header / Brand Identity */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 transition-transform hover:scale-105 duration-300">
              <img 
                className="w-10 h-10 object-cover rounded-xl mix-blend-screen" 
                src="https://img.magnific.com/ucretsiz-vektor/kus-renkli-gradyan-tasarim-vektoru_343694-2506.jpg?semt=ais_hybrid&w=740&q=80" 
                alt="Logo" 
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1.5">Enter your operational credentials to initialize session</p>
          </div>

          {/* Form */}
          <form onSubmit={loginHandler} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="email">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  className="w-full text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl py-3 pl-11 pr-4 outline-none placeholder-slate-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-xs font-medium" 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="name@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="password">Password</label>
                <Link href="#" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  className="w-full text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl py-3 pl-11 pr-4 outline-none placeholder-slate-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-xs font-medium" 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Response Notification Message wrapper */}
            {showMessage && (
              <div className="pt-1">
                <Message message={message} successfully={!invalid} showMessage={showMessage}/>
              </div>
            )}

            {/* Submit Control */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 font-semibold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all duration-200 cursor-pointer active:scale-[0.98] mt-2 group"
            >
              {loading ? (
                <LoaderCircle className="animate-spin w-4 h-4" />
              ) : (
                <span className="flex items-center gap-1.5">
                  Authenticate Core <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Micro Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Or Authorized Network</span>
          </div>

          {/* Identity Federation Providers */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => signIn("google")} 
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <FcGoogle size={16}/>
              <span>Google</span>
            </button>

            <button 
              onClick={() => signIn("github")} 
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <FaGithub className="text-slate-900 dark:text-white" size={16}/>
              <span>GitHub</span>
            </button>
          </div>

          {/* Footer Router Node */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8 font-medium">
            New to platform?{' '}
            <Link href="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 transition-all">
              Create workspace
            </Link>
          </p>
          
        </div>
      </div>
    </div>
  );
}