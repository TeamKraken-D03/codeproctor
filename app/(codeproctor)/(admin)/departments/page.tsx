"use client";
import { DataTable } from "@/components/data-table";
import { createDepartmentColumns } from "./columns";
import { department } from "@/types/types";
import { useEffect, useState } from "react";

export default function DepartmentsPage() {
  const [data, setData] = useState<department[]>([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData(): Promise<department[]> {
    const departments = await fetch("/api/departments", { method: "GET" });
    const res = await departments.json();
    setData(res);
    return res;
  }

  async function refetchData() {
    getData();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Department Management</h1>
      <div className="rounded-lg shadow">
        <DataTable
          columns={createDepartmentColumns(refetchData)}
          data={data}
          searchColumn="name"
        />
      </div>
    </div>
  );
}
