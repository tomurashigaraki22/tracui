"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BiPackage, BiShoppingBag } from "react-icons/bi";
import { BsTruck } from "react-icons/bs";
// import { Package, Truck, ShoppingBag } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";

const RoleSelection = () => {
  //   const { setRole, user } = useAuth();
  const navigate = useRouter();

  const handleRoleSelect = (role: "seller" | "logistics" | "consumer") => {
    // setRole(role);
    navigate.push(`/${role}/dashboard`);
  };

  const roles = [
    {
      id: "seller",
      title: "Seller",
      description: "Manage products, set thresholds, view shipping status",
      icon: <BiPackage size={24} className="text-primary-500" />,
      color: "bg-primary-50 border-primary-100",
      buttonClass: "bg-primary-500 hover:bg-primary-600",
    },
    {
      id: "logistics",
      title: "Logistics",
      description: "Verify packages, manage shipments, track product data",
      icon: <BsTruck size={24} className="text-secondary-500" />,
      color: "bg-secondary-50 border-secondary-100",
      buttonClass: "bg-secondary-500 hover:bg-secondary-600",
    },
    {
      id: "consumer",
      title: "Consumer",
      description:
        "Track incoming shipments, view product history, sign for deliveries",
      icon: <BiShoppingBag size={24} className="text-accent-500" />,
      color: "bg-accent-50 border-accent-100",
      buttonClass: "bg-accent-500 hover:bg-accent-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Select Your Role
          </h1>
          <p className="text-neutral-600">
            Choose your role in the supply chain to access relevant features
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              onClick={() =>
                handleRoleSelect(role.id as "seller" | "logistics" | "consumer")
              }
              variants={itemVariants}
              className={`card card-hover cursor-pointer p-6 ${role.color}`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-4">{role.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{role.title}</h2>
              <p className="text-neutral-600 text-sm mb-6">
                {role.description}
              </p>
              {/* <button
                onClick={() =>
                  handleRoleSelect(
                    role.id as "seller" | "logistics" | "consumer"
                  )
                }
                className={`btn text-black w-full ${role.buttonClass}`}
              >
                Continue as {role.title}
              </button> */}
            </motion.div>
          ))}
        </motion.div>

        {/* {user && (
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-600">
              Logged in as <span className="font-medium">{user.email}</span>
            </p>
            <button
              onClick={() => navigate.push("/login")}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-2"
            >
              Switch Account
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default RoleSelection;
