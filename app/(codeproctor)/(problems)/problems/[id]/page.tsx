"use client";

import { problem } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Editor from "@monaco-editor/react";
import { ChevronDown } from "lucide-react";

export default function Page() {
  const { id } = useParams();
  const [problem, setProblem] = useState<problem>({} as problem);
  const [language, setLanguage] = useState<string>("javascript");

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch(`/api/problems/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProblem(data);
      }
    };
    fetchProblem();
  }, [id]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 gap-6 min-h-0">
        <div className="w-1/2 flex flex-col">
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            Problem Solver
          </h1>
          <div className="rounded-lg border bg-card shadow-sm p-6 flex-1 overflow-auto">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {problem.title || "Loading..."}
                </h2>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Description
                </h3>
                <div className="text-muted-foreground whitespace-pre-wrap">
                  {problem.description || "Loading problem description..."}
                </div>
              </div>

              {problem.created_by && (
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Created By
                  </h3>
                  <p className="text-muted-foreground">{problem.created_by}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-foreground">
              Editor
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {language} <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem
                    checked={language === "python"}
                    onCheckedChange={() => setLanguage("python")}
                  >
                    Python
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={language === "javascript"}
                    onCheckedChange={() => setLanguage("javascript")}
                  >
                    JavaScript
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={language === "java"}
                    onCheckedChange={() => setLanguage("java")}
                  >
                    Java
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={language === "cpp"}
                    onCheckedChange={() => setLanguage("cpp")}
                  >
                    C++
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={language === "c"}
                    onCheckedChange={() => setLanguage("c")}
                  >
                    C
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="default">Run</Button>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden flex-1">
            <Editor
              height="80vh"
              language={language}
              defaultValue="// Write your solution here..."
              theme="vs-dark"
              options={{
                padding: { top: 20, bottom: 20 },
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
