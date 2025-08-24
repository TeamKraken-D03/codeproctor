"use client";
import { DataTable } from "@/components/data-table";
import { createDepartmentColumns } from "./columns";
import { department } from "@/types/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function DepartmentsPage() {
  const [data, setData] = useState<department[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState<department | null>(null);
  const [editLoading, setEditLoading] = useState(false);

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

      const departments = await fetch(`/api/departments?${params.toString()}`);

      if (!departments.ok) {
        throw new Error("Failed to fetch departments");
      }
      
      const res = await departments.json();
      setData(res.data);
      setTotalRows(res.total);
      setTotalPages(res.totalPages);
      console.log(res);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  async function refetchData(): Promise<void> {
    await getData();
  }

  async function handleCreateDepartment(): Promise<void> {
    if (!newDepartmentName.trim()) {
      alert("Please enter a department name");
      return;
    }

    setCreateLoading(true);
    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newDepartmentName.trim() }),
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        setNewDepartmentName("");
        await refetchData();
      } else {
        const error = await response.json();
        alert(`Failed to create department: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating department:", error);
      alert("Failed to create department");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleEditDepartment(): Promise<void> {
    if (!editDepartment?.name.trim()) {
      alert("Please enter a department name");
      return;
    }

    setEditLoading(true);
    try {
      const response = await fetch("/api/departments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editDepartment.id,
          name: editDepartment.name.trim(),
        }),
      });

      if (response.ok) {
        setIsEditDialogOpen(false);
        setEditDepartment(null);
        await refetchData();
      } else {
        const error = await response.json();
        alert(`Failed to update department: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Failed to update department");
    } finally {
      setEditLoading(false);
    }
  }

  function openEditDialog(department: department): void {
    setEditDepartment({ ...department });
    setIsEditDialogOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Department Management
        </h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>
                Add a new department to the system. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter department name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setNewDepartmentName("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleCreateDepartment}
                disabled={createLoading}
              >
                {createLoading ? "Creating..." : "Create Department"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable
          columns={createDepartmentColumns(refetchData, openEditDialog)}
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

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editDepartment?.name || ""}
                onChange={(e) =>
                  setEditDepartment(prev =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="col-span-3"
                placeholder="Enter department name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditDepartment(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleEditDepartment}
              disabled={editLoading}
            >
              {editLoading ? "Updating..." : "Update Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
