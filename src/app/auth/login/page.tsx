import Link from "next/link";
import React from "react";
import { BsGoogle } from "react-icons/bs";
import { CgGoogle } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";
import { GrGoogle } from "react-icons/gr";

const page: React.FC = () => {
  return (
    <div className="px-[5%] lg:px-[10%] max-w-2xl mx-auto">
      <div className="border borfer-white rounded-lg bg-black shadow-2xl py-8 px-5">
        <div className="text-center">
          <h3 className="text-base font-bold">Welcome Back!</h3>
          <p className="text-xs">Let&apos;s pick up where you left off.</p>
        </div>
        {/* <div>
          <div className="flex flex-col gap-2 mt-5">
            <label htmlFor="Email" className="text-sm">
              Email
            </label>

            <input
              type="text"
              placeholder="E.g “Johndoe@gmail.com” or “johndoe_25”"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] transition-all"
            />
          </div>
          <div className="flex flex-col gap-2 mt-5">
            <label htmlFor="Email" className="text-sm">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] transition-all"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mt-5">
              <input type="checkbox" name="" id="" className="b" />
              <label htmlFor="" className="text-xs ml-2">
                Remember me
              </label>
            </div>
          </div>
        </div> */}
        <Link
          href="/"
          className="bg-white rounded-lg flex items-center justify-center gap-2 text-black font-semibold py-2 mt-5 hover:bg-gray-200 transition-all"
        >
          <FcGoogle size={20} />
          <p className="text-sm">Sign In with google</p>
        </Link>{" "}
      </div>
    </div>
  );
};

export default page;
