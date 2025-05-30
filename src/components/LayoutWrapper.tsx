"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbarAndFooter =
    !pathname.startsWith("/auth") && !pathname.startsWith("/user");

  return (
    <>
      {showNavbarAndFooter && <Navbar />}
      <main>{children}</main>
      {showNavbarAndFooter && <Footer />}
    </>
  );
}
