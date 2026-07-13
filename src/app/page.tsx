'use client'
import { Mail, Lock, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import z from "zod";
import { useState } from "react";
import { loginAction, type loginData } from "@/app/actions/auth.action";
import { Message } from "@/app/_components/message";

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
    e.preventDefault(); // Prevents default form action behavior if needed
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
    <div className="w-full max-w-md mx-auto my-12 bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-100/50 overflow-hidden transition-all duration-300">
      <div className="p-8 sm:p-10">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner overflow-hidden mb-4">
            <img className="w-12 h-12 object-cover rounded-xl" src="https://img.magnific.com/ucretsiz-vektor/kus-renkli-gradyan-tasarim-vektoru_343694-2506.jpg?semt=ais_hybrid&w=740&q=80" alt="Logo" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1">Please enter your details to sign in</p>
        </div>

        {/* Form */}
        <form onSubmit={loginHandler} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700" htmlFor="email">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input 
                className="w-full text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-11 pr-4 outline-none placeholder-zinc-400 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all duration-200 text-sm" 
                type="email" 
                id="email" 
                name="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input 
                className="w-full text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-11 pr-4 outline-none placeholder-zinc-400 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all duration-200 text-sm" 
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

          {/* Response Notification Component */}
          <Message message={message} successfully={!invalid} showMessage={showMessage}/>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center items-center text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 rounded-xl py-3 font-medium text-sm shadow-md shadow-zinc-900/10 transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            {loading ? <LoaderCircle className="animate-spin w-5 h-5" /> : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-zinc-400 font-medium">Or continue with</span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-xl py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 cursor-pointer">
            <FcGoogle size={18}/>
            <span>Google</span>
          </button>

          <button className="flex items-center justify-center gap-2 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-xl py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 cursor-pointer">
            <FaGithub className="text-zinc-900" size={18}/>
            <span>GitHub</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-zinc-500 mt-8">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-zinc-900 hover:underline underline-offset-4 transition-all">
            Sign up
          </Link>
        </p>
        
      </div>
    </div>
  );
}