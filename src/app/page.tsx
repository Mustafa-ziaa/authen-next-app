'use client'
import { Mail,Lock,LoaderCircle } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import z from "zod"
import { useState } from "react";
import {loginAction, loginData} from "@/app/actions/auth.action"
import {Message} from "@/app/_components/message"

 export  const loginSchema = z.object({
      email: z.email(),
      password: z.string().min(6)
    })

export default function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword ] = useState('')

  const [message, setMessage] = useState('')
  const [invilde, setInvilde] = useState(false) 
  const [showMEssage, setShowMEssage] = useState(false)
  const [loading, setLoading] = useState(false);

  const loginHandler = async () =>{
    setLoading(true)
    const data: loginData = {email,password}
    const response = await loginAction(data)
    setShowMEssage(true);
    setLoading(false)
    
    if (!response.success){
      setInvilde(true)
      setMessage(response.message as string)
    } else{
      setInvilde(false)
      setMessage(response.message as string)
      setEmail('')
      setPassword('')
    }

    setTimeout(() => {
      setShowMEssage(false)
    }, 5000);
      
  }

  
  return (
  <div className="flex flex-col justify-between items-center lg:w-2xl h-max border-2 border-gray-200 rounded-2xl m-auto bg-white p-3 overflow-hidden md:w-[400px] sm:w-[300px] transition-all duration-300">
    <img className="w-32 h-32 rounded-full" src="https://img.magnific.com/ucretsiz-vektor/kus-renkli-gradyan-tasarim-vektoru_343694-2506.jpg?semt=ais_hybrid&w=740&q=80" alt="" />
    <h1 className="text-black m-auto p-1 lg:text-3xl font-bold md:text-lg sm:text-sm transition-all duration-300">Login To Your Account</h1>
    <div className="flex flex-col justify-between items-center p-2 m-auto w-full px-8">

      <form action={loginHandler} className="flex flex-col justify-between items-center m-auto w-full">
        <div className="flex flex-col p-1 m-auto justify-center items-start w-full relative group">
        <label className="text-black p-1 text-lg font-bold" htmlFor="email">Email</label>
        <Mail className="absolute text-blue-300 right-4 top-1/2 translate-y-1.5"/>
        <input className="text-black border-4 border-blue-300 rounded-2xl w-full p-2 pr-10 outline-none focus:rounded-none transition-all duration-300" type="email" id="email" name="email" placeholder="example@gmail.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col p-1 m-auto justify-center items-start w-full relative">
        <label className="text-black p-1 text-lg font-bold" htmlFor="password">Password</label>
        <Lock className="absolute text-blue-300 right-4 top-1/2 translate-y-1.5"/>
        <input className="text-black border-4 border-blue-300 rounded-2xl w-full p-2 pr-10  outline-none focus:rounded-none transition-all duration-300" type="password" id="password" name="password" placeholder="*******" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Message message={message} successfully={invilde} showMessage={showMEssage}/>

      <button type="submit" className="flex justify-center items-center text-white bg-blue-400 rounded-2xl px-3 py-2 m-auto w-full mt-6 cursor-pointer hover:bg-blue-200 hover:text-gray-400 transition-all duration-300" disabled={loading}>{loading? <span><LoaderCircle className="animate-spin"/></span> : 'Login'}</button>

      </form>
      
    <div className="flex flex-row justify-center items-center g-2 w-full m-auto mt-7 mb-1 px-3">
      <hr className="border border-blue-400 w-full" /><span className="text-blue-400 px-5">OR</span><hr className="border border-blue-400 w-full" />
    </div>

      <div className="flex flex-row justify-between items-center w-full gap-3 m-auto mt-5">
        <button className="flex flex-row border group hover:bg-blue-300 hover:rounded-none transition-all duration-300 border-blue-400 items-center rounded-2xl p-2 gap-2 shadow-sm shadow-gray-300 cursor-pointer bg-amber-50 w-full">
          <FcGoogle className="text-black group-hover:text-white" size={22}/>
          <p className="text-center text-blue-400 group-hover:text-white transition-all duration-300 lg:text-lg md:text-[12px] sm:text-[8px]">Continue With Google</p>
        </button>

        <button className="flex flex-row border group hover:bg-blue-300 hover:rounded-none transition-all duration-300 border-blue-400 items-center rounded-2xl p-2 gap-2 shadow-sm shadow-gray-300 cursor-pointer bg-amber-50 w-full">
          <FaGithub className="text-black group-hover:text-white" size={22}/>
          <p className="text-center text-blue-400 group-hover:text-white transition-all duration-300 lg:text-lg md:text-[12px] sm:text-[8px]">Continue With Github</p>
        </button>
      </div>
      <h1 className="m-auto mt-3 text-sm text-gray-500 p-5">if you dont have <span className="text-blue-400"><Link href="/register">register</Link></span> account now</h1>
      
    </div>
    
  </div>
  );
}
