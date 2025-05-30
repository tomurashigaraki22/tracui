"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";

interface CodeResponse {
  access_token: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        // Get user info from Google
        const userInfo = await axios.get<CodeResponse>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        // Store the response in localStorage or state management
        const userData = {
          access_token: tokenResponse.access_token,
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
        };

        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(userData));

        // Navigate to role selection
        router.push("/roleselection");
      } catch (err) {
        console.error("Login Failed:", err);
        setError("Failed to login. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.log("Login Failed:", error);
      setError("Google login failed. Please try again.");
      setLoading(false);
    },
  });

  if (loading) {
    return (
      <div className="py-8 flex-1">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="lg:max-w-[60%] mx-auto">
        <div className="text-center">
          <h3 className="text-base font-bold text-white">Welcome Back!</h3>
          <p className="text-xs text-gray-400">
            Let&apos;s pick up where you left off.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <button
          onClick={() => login()}
          disabled={loading}
          className="w-full cursor-pointer bg-white rounded-lg flex items-center justify-center gap-2 text-black font-semibold py-2 mt-5 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle size={20} />
          <p className="text-sm">Sign In with Google</p>
        </button>
      </div>
    </>
  );
}
