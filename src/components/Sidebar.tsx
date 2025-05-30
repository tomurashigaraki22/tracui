"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BiBarChart,
  BiChevronDown,
  BiChevronRight,
  BiLogOut,
  BiPackage,
  BiShoppingBag,
} from "react-icons/bi";
import { BsTruck } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { usePathname } from "next/navigation";
import { CgLock } from "react-icons/cg";
import { FaUserSecret } from "react-icons/fa6";
import Link from "next/link";
import { IconType } from "react-icons";
import Image from "next/image";

interface SidebarProps {
  role: string | null;
}

interface NavItem {
  label: string;
  path: string;
  icon: IconType; // Changed to only accept IconType
  children?: { label: string; path: string }[];
}
console.log("I am king");

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  // Navigation items for each role
  const getNavItems = (role: string | null): NavItem[] => {
    switch (role) {
      case "seller":
        return [
          {
            label: "Overview",
            path: "/user/seller/dashboard",
            icon: BiBarChart,
          },
          {
            label: "Products",
            path: "/user/seller/products",
            icon: BiPackage,
            children: [
              { label: "Active Products", path: "/seller/products/active" },
              { label: "Add Products", path: "/seller/products/archived" },
            ],
          },
          {
            label: "Shipments",
            path: "/user/seller/shipments",
            icon: BsTruck,
          },
        ];

      case "logistics":
        return [
          {
            label: "Overview",
            path: "/user/logistics/dashboard",
            icon: BiBarChart,
          },
          {
            label: "Active Shipments",
            path: "/user/logistics/active-shipments",
            icon: BsTruck,
          },
          {
            label: "Verify & Handoff",
            path: "/user/logistics/verify",
            icon: BiPackage,
          },
          {
            label: "History",
            path: "/user/logistics/history",
            icon: CgLock,
          },
        ];

      case "consumer":
        return [
          {
            label: "Overview",
            path: "/user/consumer/dashboard",
            icon: BiBarChart,
          },
          {
            label: "My Products",
            path: "/user/consumer/products",
            icon: BiShoppingBag,
          },
          {
            label: "Order History",
            path: "/user/consumer/history",
            icon: CgLock,
          },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems(role);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="bg-black h-screen w-64 border-r border-neutral-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center">
        <Image src="/FooterLogo.png" width={150} height={150} alt="Tracui" />
      </div>

      {/* Navigation */}
      <nav className="text-white flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                {!item.children ? (
                  <Link
                    href={item.path}
                    className={`font-semibold flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-white text-black"
                        : "text-white hover:bg-gray-400 hover:text-black"
                    }`}
                  >
                    <span className="mr-3">
                      <Icon size={20} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleGroup(item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "bg-white text-black"
                          : "text-white hover:bg-gray-400 hover:text-black"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">
                          <Icon size={20} />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {expandedGroups.includes(item.label) ? (
                        <BiChevronDown size={16} />
                      ) : (
                        <BiChevronRight size={16} />
                      )}
                    </button>

                    {/* Submenu */}
                    <AnimatePresence>
                      {expandedGroups.includes(item.label) && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-8"
                        >
                          {item.children.map((subItem) => (
                            <li key={subItem.label}>
                              <Link
                                href={subItem.path}
                                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                  isActive(subItem.path)
                                    ? "bg-primary-50 text-primary-600"
                                    : "text-white hover:bg-gray-400 hover:text-black"
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section with logout */}
      <div className="p-4 border-t border-neutral-200">
        <Link
          href="/login"
          className="flex items-center px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <BiLogOut size={20} className="mr-3" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
