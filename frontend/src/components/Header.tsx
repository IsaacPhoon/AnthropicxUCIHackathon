"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout, loading } = useAuth();

  // Don't show login/signup buttons on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link href={isAuthenticated ? "/dashboard" : "/"}>
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl">🎯</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              InterviewIQ
            </h1>
          </motion.div>
        </Link>

        {/* Right side - Auth buttons */}
        <div className="flex items-center gap-4">
          {loading ? (
            // Loading skeleton
            <div className="w-24 h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ) : isAuthenticated ? (
            // Logged in state
            <motion.button
              onClick={logout}
              className="px-5 py-2.5 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </motion.button>
          ) : !isAuthPage ? (
            // Not logged in and not on auth page
            <>
              <Link href="/login">
                <motion.button
                  className="px-5 py-2.5 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  className="px-6 py-2.5 text-base font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};
