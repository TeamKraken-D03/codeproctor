"use client";

import { problem } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<problem>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "title",
    header: "Problem",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty"
  },
  {
    accessorKey: "isSolved",
    header: "Solved",
    cell: ({getValue}) => {
        const isSolved = getValue() as boolean;
        return isSolved ? "Yes" : "No";
    }
  }
]