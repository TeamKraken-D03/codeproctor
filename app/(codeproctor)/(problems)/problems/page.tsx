"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground flex justify-between">
        <div>Problems Page</div>
        <Button onClick={() => router.push("/problems/create")}>Create Problem</Button>
      </h1>
      <div className="rounded-lg border bg-card shadow-sm p-4">
        <p className="text-muted-foreground">
          Problems page content coming soon...
        </p>
      </div>
    </div>
  );
}
