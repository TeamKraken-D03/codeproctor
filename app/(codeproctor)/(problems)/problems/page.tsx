"use client";
import { problem } from "@/types/types";
import { createColumns } from "./columns";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProblemsPage() {
  const [data, setData] = useState<problem[]>([]);
  const router = useRouter();

  useEffect(() => {
    getData();
  }, []);

  async function getData(): Promise<problem[]> {
    try {
      const problems = await fetch(`/api/problems`);

      if (!problems.ok) {
        throw new Error("Failed to fetch problems");
      }
      const res = await problems.json();
      setData(res);
      console.log(res);
      return res;
    } catch (error) {
      console.error("Error fetching problems:", error);
      return [];
    }
  }

  const refetchData = async (): Promise<void> => {
    await getData();
  };

  const columns = createColumns(refetchData);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground flex justify-between">
        <div>Problems Page</div>
        <Button onClick={() => router.push("/problems/create")}>
          Create Problem
        </Button>
      </h1>
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={data} searchColumn="title" />
      </div>
    </div>
  );
}
