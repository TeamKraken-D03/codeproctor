import { problem } from "@/types/types";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const createColumns = (
  refetchData: () => Promise<void>
): ColumnDef<problem>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Problem Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[300px] truncate" title={description}>
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "creator_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const creatorName = row.getValue("creator_name") as string;
      return creatorName || "Unknown";
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
      const router = useRouter();

      const handleDelete = () => {
        setIsDeleteDialogOpen(true);
      };

      const handleView = () => {
        router.push(`/problems/${row.original.id}`);
      };

      async function deleteProblem(problemId: string) {
        try {
          const res = await fetch(`/api/problems/${problemId}`, {
            method: "DELETE",
          });
          
          if (res.ok) {
            setIsDeleteDialogOpen(false);
            await refetchData();
          } else {
            console.error("Failed to delete problem");
          }
        } catch (error) {
          console.error("Error deleting problem:", error);
        }
      }

      async function handleEdit() {
        router.push(`/problems/${row.original.id}/edit`);
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.id)}
              >
                Copy problem ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleView}>
                View Problem
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Problem</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{row.original.title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteProblem(row.original.id)}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
