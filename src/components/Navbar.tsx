"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaX } from "react-icons/fa6";

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState<boolean>(false);
  const routes = [
    { name: "Home", link: "#Hero" },
    { name: "How It Works", link: "#howitworks" },
    { name: "Track Products", link: "#trackproducts" },
  ];
  return (
    <nav className="px-[5%] lg:px-[10%] bg-black z-10">
      <div className="2xl:container mx-auto flex justify-between items-center py-5">
        <div>
          <Image src="/Logo.png" width={150} height={150} alt="Logo"></Image>
        </div>
        <div
          className={`${
            isNavOpen ? "top-16" : "-top-[100%]"
          } flex flex-col absolute lg:flex-row justify-between items-center gap-5 bg-black w-full lg:w-fit  lg:top-0 border left-0  lg:relative pb-20 lg:pb-0 transition-all duration-300 z-10`}
        >
          <div className="flex flex-col lg:flex-row text-white items-center gap-4 w-full">
            {routes.map((link, index) => (
              <Link
                href={link.link}
                key={index}
                className={`${
                  index === 0 ? "mt-5 lg:mt-0" : ""
                } font-semibold text-lg p-3 text-left lg:text-center border-b lg:border-0 w-full lg:w-fit`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col lg:flex-row gap-3 px-[5%] w-full lg:w-fit lg:px-0 mt-20 lg:mt-0">
            <Link
              onClick={() => setNavOpen(false)}
              href="/auth/signup"
              className="text-nowrap text-lg lg:text-base py-3 lg:py-1 px-5 bg-[#00FFD1] rounded font-semibold border"
            >
              Sign Up
            </Link>
            <Link
              onClick={() => setNavOpen(false)}
              href="/auth/login"
              className="text-nowrap text-lg lg:text-base py-3 lg:py-1 px-5 bg-[#343434] rounded text-white font-semibold"
            >
              Log In
            </Link>
          </div>
        </div>
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setNavOpen(!isNavOpen)}
            className="cursor-pointer"
          >
            {isNavOpen ? (
              <FaX color="white" size={25} />
            ) : (
              <FaBars color="white" size={30} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
