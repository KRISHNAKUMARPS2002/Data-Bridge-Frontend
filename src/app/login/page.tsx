"use client";

import { Suspense } from "react";
import LoginPage from "./LoginComponent"; // Move LoginPage to a separate file

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
