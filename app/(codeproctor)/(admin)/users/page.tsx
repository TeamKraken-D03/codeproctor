"use client";
import { user } from "@/types/types";
import { createColumns } from "./columns";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";

export default function UsersPage() {
  const [data, setData] = useState<user[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    getData();
  }, [pagination, sorting, globalFilter]);

  async function getData(): Promise<void> {
    setLoading(true);
    try {
      const sortBy = sorting.length > 0 ? sorting[0].id : "id";
      const sortOrder = sorting.length > 0 && sorting[0].desc ? "desc" : "asc";
      
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        pageSize: pagination.pageSize.toString(),
        search: globalFilter,
        sortBy,
        sortOrder,
      });

      const users = await fetch(`/api/users?${params.toString()}`);

      if (!users.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const res = await users.json();
      setData(res.data);
      setTotalRows(res.total);
      setTotalPages(res.totalPages);
      console.log(res);
    } catch (error) {
      console.error("Error fetching users:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  const refetchData = async (): Promise<void> => {
    await getData();
  };

  const columns = createColumns(refetchData);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        User Management
      </h1>
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable 
          columns={columns} 
          data={data} 
          searchColumn="email"
          manualPagination={true}
          manualSorting={true}
          manualFiltering={true}
          pageCount={totalPages}
          rowCount={totalRows}
          state={{
            pagination,
            sorting,
            globalFilter,
          }}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onGlobalFilterChange={setGlobalFilter}
          loading={loading}
        />
      </div>
    </div>
  );
}
