"use client";
import { DataTable } from "@/components/data-table";
import { createSemesterColumns } from "./columns";
import { semester } from "@/types/types";
import { useEffect, useState } from "react";

export default function SemestersPage(){

    const [data, setData] = useState<semester[]>([]);

    useEffect(() => {
      getData();
    }, [])

    async function getData(): Promise<semester[]>{
      const semesters = await fetch("/api/semesters", {method: "GET"});
      const res = await semesters.json();
      setData(res);
      return res;
    }

    async function refetchData() {
      getData();
    }



    return <div>
          <h1 className="text-3xl font-bold mb-6">Semester Management</h1>
          <div className="rounded-lg shadow">
            <DataTable columns={createSemesterColumns(refetchData)} data={data} searchColumn="name"/>
          </div>
        </div>
}