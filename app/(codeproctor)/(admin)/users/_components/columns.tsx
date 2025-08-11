"use client";

import { user, userRole } from "@/types/types";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { userContext } from "../context";
import { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const columns: ColumnDef<user>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const context = useContext(userContext);
      if (!context) {
        throw new Error("useContext must be used within userContext.Provider");
      }
      const { getData } = context;
      const handleAssignRole = () => {
        setIsDialogOpen(true);
      };
      async function assignRole(row: user, newRole: string) {
        const res = await fetch(`/api/users/${row.id}/role`, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ newRole: newRole }),
        });
        setIsDialogOpen(false);
        getData();
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
              <DropdownMenuItem onClick={handleAssignRole}>
                Assign Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Role</DialogTitle>
                <DialogDescription>
                  Select a role for {row.original.name}
                </DialogDescription>
              </DialogHeader>
              <Select
                onValueChange={(value) => assignRole(row.original, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="learner">Learner</SelectItem>
                </SelectContent>
              </Select>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
