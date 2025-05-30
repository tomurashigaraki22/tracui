import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const page: React.FC = () => {
  return (
    <div className="px-[5%] lg:px-[10%]  max-w-2xl mx-auto">
      <div className="border border-white/10 rounded-2xl bg-black/80 backdrop-blur-xl shadow-2xl py-12 px-8">
        <div className="text-center space-y-3 mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-[#00FFD1] to-white bg-clip-text text-transparent">Welcome Back!</h3>
          <p className="text-sm text-gray-400">Let's pick up where you left off.</p>
        </div>

        <div className="space-y-6">
          {/* <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FFD1] focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FFD1] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-[#00FFD1] focus:ring-[#00FFD1]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Remember me
              </label>
            </div>
            <Link href="/auth/forgot-password" className="text-sm text-[#00FFD1] hover:text-[#00FFD1]/80 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button className="w-full bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/80 text-black font-semibold py-3 rounded-xl hover:opacity-90 transition-all">
            Sign In
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">Or continue with</span>
            </div>
          </div> */}

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 transition-all"
          >
            <FcGoogle size={20} />
            <span className="text-sm font-medium">Sign in with Google</span>
          </Link>

         
        </div>
      </div>
    </div>
  );
};

export default page;
