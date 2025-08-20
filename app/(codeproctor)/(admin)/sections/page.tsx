"use client";
import { DataTable } from "@/components/data-table";
import { createSectionColumns } from "./columns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { department, semester } from "@/types/types";
import { createSectionType } from "@/repository/section.repository";

export default function Page() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [departments, setDepartments] = useState<department[]>([]);
  const [semesters, setSemesters] = useState<semester[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  useEffect(() => {
    getData();
  }, [pagination, sorting, globalFilter]);

  async function getData(): Promise<void> {
    setLoading(true);
    try {
      const sortBy = sorting.length > 0 ? sorting[0].id : "section_name";
      const sortOrder = sorting.length > 0 && sorting[0].desc ? "desc" : "asc";
      
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        pageSize: pagination.pageSize.toString(),
        search: globalFilter,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/sections?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }
      
      const res = await response.json();
      setSections(res.data);
      setTotalRows(res.total);
      setTotalPages(res.totalPages);
      console.log(res);
    } catch (error) {
      console.error("Error fetching sections:", error);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDialogOpen() {
    try {
      setOpenDialog(true);

      const [departmentData, semesterData] = await Promise.all([
        fetch("/api/departments").then((res) => res.json()),
        fetch("/api/semesters").then((res) => res.json()),
      ]);

      setDepartments(departmentData);
      setSemesters(semesterData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function handleCreateSection() {
    setOpenDialog(false);
    console.log(selectedDepartment, selectedSemester, selectedSection);

    const newSection: createSectionType = {
      name: selectedSection,
      semesterid: selectedSemester,
      departmentid: selectedDepartment,
    };

    const response = await fetch("/api/sections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSection),
    });

    if (response.ok) {
      refetchData();
    } else {
      console.error("Error creating section");
    }
  }

  async function refetchData(): Promise<void> {
    await getData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Section Management
        </h1>
        <Button variant="default" onClick={handleDialogOpen}>
          Create Section
        </Button>
      </div>
      <div className="rounded-lg border bg-card shadow-sm p-4">
        <DataTable
          columns={createSectionColumns(refetchData)}
          data={sections}
          searchColumn="section_name"
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
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Section</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Select onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Select onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Select onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={handleCreateSection}>
              Create Section
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
