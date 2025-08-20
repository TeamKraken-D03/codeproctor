"use client";
import { DataTable } from "@/components/data-table";
import { createSemesterColumns } from "./columns";
import { semester } from "@/types/types";
import { useEffect, useState } from "react";

export default function SemestersPage() {
  const [data, setData] = useState<semester[]>([]);
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

      const semesters = await fetch(`/api/semesters?${params.toString()}`);

      if (!semesters.ok) {
        throw new Error("Failed to fetch semesters");
      }
      
      const res = await semesters.json();
      setData(res.data);
      setTotalRows(res.total);
      setTotalPages(res.totalPages);
      console.log(res);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  async function refetchData(): Promise<void> {
    await getData();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Semester Management
      </h1>
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable
          columns={createSemesterColumns(refetchData)}
          data={data}
          searchColumn="name"
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
