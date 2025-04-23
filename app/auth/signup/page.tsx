'use client';
import React, { useState } from "react";
import Link from "next/link";
import ChalkHeading from "@/components/ChalkHeading";
import ChalkButton from "@/components/ChalkButton";
import { Mail, Lock, User, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.post(BACKEND_URL+"/signup", {name, email, password});
      router.push("/auth/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Could not create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative">
      {/* Subtle chalk dust effect */}
      <div className="chalk-dust-container fixed inset-0 opacity-15 pointer-events-none z-0"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-2xl font-semibold tracking-tight text-slate-800">
              <span className="font-chalk">Sketch</span>
              <span className="font-sans font-medium">Board</span>
            </div>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 mb-8 transform hover:translate-y-[-4px] transition-transform duration-300">
          <ChalkHeading className="text-3xl mb-6 text-center text-slate-800 font-bold tracking-tight">
            Create Your Account
          </ChalkHeading>
          
          {error && (
            <div className="mb-6 p-4 border border-red-100 rounded-md bg-red-50">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="font-medium text-slate-700 flex items-center gap-2">
                <User size={18} className="text-slate-500" />
                <span>Full Name</span>
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="font-medium text-slate-700 flex items-center gap-2">
                <Mail size={18} className="text-slate-500" />
                <span>Email Address</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="font-medium text-slate-700 flex items-center gap-2">
                <Lock size={18} className="text-slate-500" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Choose a strong password"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <ChalkButton 
                type="submit" 
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Creating account...</span>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Create Account</span>
                  </>
                )}
              </ChalkButton>
            </div>
          </form>
        </div>
        
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Already have an account?
          </p>
          <Link href="/auth/login">
            <ChalkButton 
              variant="outline" 
              className="px-8 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors duration-200 rounded-lg"
            >
              Sign In
            </ChalkButton>
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            By signing up, you agree to our 
            <a href="#" className="text-blue-600 hover:text-blue-800 mx-1">Terms of Service</a>
            and
            <a href="#" className="text-blue-600 hover:text-blue-800 mx-1">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;