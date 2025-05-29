import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const routes = [
    { name: "Home", link: "#Hero" },
    { name: "How It Works", link: "#howitworks" },
    { name: "Track Products", link: "#trackproducts" },
  ];
  return (
    <nav className="px-[5%] lg:px-[10%] bg-black">
      <div className="2xl:container mx-auto flex justify-between items-center py-3">
        <div>
          <Image src="/Logo.png" width={150} height={150} alt="Logo"></Image>
        </div>
        <div className="flex text-white items-center gap-4">
          {routes.map((link, index) => (
            <Link
              href={link.link}
              key={index}
              className="font-semibold text-lg p-3"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-3">
          <Link
            href="/signup"
            className="py-1 px-5 bg-[#00FFD1] rounded font-semibold"
          >
            Sign Up
          </Link>
          <Link
            href="/signup"
            className="py-1 px-5 bg-[#343434] rounded text-white font-semibold"
          >
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
