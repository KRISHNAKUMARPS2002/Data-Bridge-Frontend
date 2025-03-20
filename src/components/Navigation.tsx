"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [logoutAlert, setLogoutAlert] = useState(false);

  return (
    <div className="relative">
      <nav className="bg-gradient-to-r from-[#4D55CC] to-[#AA60C8] shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-[#fff]">
            Data Bridge
          </Link>
          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-white bg-[#ffffff22] backdrop-blur-sm py-3 px-10 rounded hover:bg-green-600 transition-colors mr-6"
              >
                Dashboard
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center">
              {/* User Email */}
              <div className="flex items-center mr-6 bg-[#ffffff22] px-8 py-2 rounded-full">
                <span className="font-medium text-gray-700 mr-2 text-xl bg-[#fff] rounded-full p-1">
                  <FaUserCircle />
                </span>
                <span className="text-[#fff]">{user.email}</span>
              </div>

              {/* DB ID */}
              <div className="flex items-center mr-6 px-8 py-2 rounded-3xl bg-[#ffffff22]">
                <span className="font-medium text-[#fff] mr-2 ">DB ID:</span>
                <span className="text-base text-[#ffff] font-bold px-2.5 py-1 rounded">
                  {user.db_id}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => setLogoutAlert(!logoutAlert)}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              {/* Login & Register Links */}
              <Link
                href="/login"
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
      {logoutAlert && (
        <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center w-full h-full z-50 bg-[#0000004e] backdrop-blur-sm">
          <div className="max-w-[400px] flex flex-col justify-center items-center w-full h-[200px] bg-[#ffffff7e] backdrop-blur-3xl rounded-3xl relative z-[999]">
            <div className="mb-3">Are you sure want to logout ?</div>
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() => setLogoutAlert(!logoutAlert)}
                className="px-6 py-2 rounded-lg bg-[#4D55CC] cursor-pointer font-semibold text-[#fff]"
              >
                No
              </button>
              <button
                onClick={logout}
                className="px-6 py-2 rounded-lg bg-[#ff0000] cursor-pointer font-semibold text-[#fff]"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
