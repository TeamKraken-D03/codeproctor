import { problem } from "@/types/types";
import { columns } from "./_components/problems-columns";
import { DataTable } from "@/components/ui/data-table";

// Dummy problems data
const dummyProblems: problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    isSolved: true
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    isSolved: false
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    isSolved: true
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    isSolved: false
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    isSolved: true
  },
  {
    id: 6,
    title: "ZigZag Conversion",
    difficulty: "Medium",
    isSolved: false
  },
  {
    id: 7,
    title: "Reverse Integer",
    difficulty: "Easy",
    isSolved: true
  },
  {
    id: 8,
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    isSolved: false
  },
  {
    id: 9,
    title: "Palindrome Number",
    difficulty: "Easy",
    isSolved: true
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    isSolved: false
  }
];

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Problems</h1>
      <DataTable columns={columns} data={dummyProblems} />
    </div>
  );
}