import { Suspense } from "react";
import AdoptClient from "./AdoptClient";

export default function AdoptPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdoptClient />
    </Suspense>
  );
}
