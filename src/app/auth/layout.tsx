import Link from "next/link";
import Image from "next/image";
import React from "react";
import type { ReactNode } from "react";
import { BiArrowBack } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa6";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen px-[5%] lg:px-[10%] py-20 bg-gradient-to-bl from-[#00FFD1] via-black to-[#00FFD1]">
      <div className="">
        <Link
          href="/"
          className="text-white font-semibold text-sm flex items-center gap-1 py-2"
        >
          <FaAngleLeft size={20} />
          Home Page
        </Link>
      </div>
      <div className="flex justify-center mb-10 mt-20">
        <Image src="/FooterLogo.png" alt="Logo" width={150} height={100} />
      </div>
      <div className="text-white">{children}</div>
    </div>
  );
}
