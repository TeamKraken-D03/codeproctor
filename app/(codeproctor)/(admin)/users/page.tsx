"use client";
import { user } from "@/types/types";
import { createColumns } from "./columns";
import { DataTable } from "../../../../components/data-table";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [data, setData] = useState<user[]>([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData(): Promise<user[]> {

    try {
      const users = await fetch(`/api/users`);

      if (!users.ok) {
        throw new Error("Failed to fetch users");
      }
      const res = await users.json();
      setData(res);
      console.log(res);
      return res;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  const refetchData = async (): Promise<void> => {
    await getData();
  };

  const columns = createColumns(refetchData);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="rounded-lg shadow">
        <DataTable columns={columns} data={data} searchColumn="email"/>
      </div>
    </div>
  );
}
