"use client";
import { DataTable } from "@/components/data-table";
import { createSectionColumns } from "./columns";
import { useState } from "react";

export default function Page() {
  const [sections, setSections] = useState([]);

  async function getData() {
    setSections([]);
  }

  async function refetchData() {
    await getData();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Section Management
      </h1>
      <div className="rounded-lg border bg-card shadow-sm p-4">
        <DataTable
          columns={createSectionColumns(refetchData)}
          data={sections}
          searchColumn="name"
        />
      </div>
    </div>
  );
}
