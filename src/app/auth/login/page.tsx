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
