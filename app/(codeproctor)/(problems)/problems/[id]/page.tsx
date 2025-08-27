"use client";

import { problem } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Editor from "@monaco-editor/react";
import { ChevronDown } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function Page() {
  const { id } = useParams();
  const [problem, setProblem] = useState<problem>({} as problem);
  const [language, setLanguage] = useState<string>("javascript");

  // Language mapping for Monaco Editor
  const getMonacoLanguage = (lang: string): string => {
    switch (lang) {
      case "cpp": return "cpp";
      case "c": return "c";
      case "python": return "python";
      case "java": return "java";
      case "javascript": return "javascript";
      default: return "javascript";
    }
  };

  // Language-specific default code templates
  const getDefaultCode = (lang: string): string => {
    switch (lang) {
      case "python":
        return `# Python Solution
def solution():
    # Write your solution here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`;
      
      case "javascript":
        return `// JavaScript Solution
function solution() {
    // Write your solution here
    
}`;
      
      case "java":
        return `// Java Solution
public class Main {
    public static void main(String[] args) {
        Main sol = new Main();
        // Test your solution
        System.out.println(sol.solve());
    }
    
    public int solve() {
        // Write your solution here
        return 0;
    }
}`;
      
      case "cpp":
        return `// C++ Solution
#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    int solve() {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    // Test your solution
    cout << sol.solve() << endl;
    return 0;
}`;
      
      case "c":
        return `// C Solution
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int solve() {
    // Write your solution here
    return 0;
}

int main() {
    // Test your solution
    printf("%d\\n", solve());
    return 0;
}`;
      
      default:
        return "// Write your solution here...";
    }
  };

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

  // Debug language changes
  useEffect(() => {
    console.log("Language changed to:", language);
    console.log("Default code for", language, ":", getDefaultCode(language).substring(0, 50) + "...");
  }, [language]);

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
                  {capitalizeFirstLetter(problem.title) || "Loading..."}
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
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("Setting language to python");
                      setLanguage("python");
                    }}
                  >
                    Python
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("Setting language to javascript");
                      setLanguage("javascript");
                    }}
                  >
                    JavaScript
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("Setting language to java");
                      setLanguage("java");
                    }}
                  >
                    Java
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("Setting language to cpp");
                      setLanguage("cpp");
                    }}
                  >
                    C++
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("Setting language to c");
                      setLanguage("c");
                    }}
                  >
                    C
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="default">Run</Button>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden flex-1">
            <Editor
              key={language} // Force re-render when language changes
              height="80vh"
              language={getMonacoLanguage(language)}
              defaultValue={getDefaultCode(language)}
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
