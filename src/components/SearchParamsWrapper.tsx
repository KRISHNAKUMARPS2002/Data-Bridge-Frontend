"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchParamsWrapper({
  children,
}: {
  children: (params: URLSearchParams) => React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children(useSearchParams())}
    </Suspense>
  );
}
