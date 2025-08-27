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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import Editor from "@monaco-editor/react";
import { ChevronDown, Loader2 } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function Page() {
  const { id } = useParams();
  const [problem, setProblem] = useState<problem>({} as problem);
  const [language, setLanguage] = useState<string>("javascript");
  const [switchState, setSwitchState] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [languageCode, setLanguageCode] = useState<number>(63);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_JUDGE0_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_JUDGE0_API_URL;

    if (apiKey && apiUrl) {
      const url = `${apiUrl}/submissions?base64_encoded=false&wait=true`;

      const options = {
        method: "POST",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id: languageCode,
          source_code: code,
          stdin: "",
        }),
      };
      try {
        const response = await fetch(url, options);
        const output = await response.json();
        setIsLoading(false);
        setOutput(
          output.stdout || output.stderr || output.compile_output || "No output"
        );
      } catch (e) {
        console.error("Error running code:", e);
        setOutput("Error running code");
      }
    }
  }

  async function handleSwitchChange(checked: boolean) {
    setSwitchState(checked);

    const res = await fetch(`/api/problems/${id}/completed`, {
      method: "POST",
      body: JSON.stringify({ isCompleted: checked ? "solved" : "unsolved" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.error("Failed to mark problem as completed");
    }
  }

  // Language mapping for Monaco Editor
  const getMonacoLanguage = (lang: string): string => {
    switch (lang) {
      case "cpp":
        return "cpp";
      case "c":
        return "c";
      case "python":
        return "python";
      case "java":
        return "java";
      case "javascript":
        return "javascript";
      default:
        return "javascript";
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
        return `// cpp Solution
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
    async function fetchProblemStatus() {
      const res = await fetch(`/api/problems/${id}/completed`);
      if (res.ok) {
        const data = await res.json();
        setSwitchState(data.isCompleted === "solved");
      }
    }
    fetchProblemStatus();
    fetchProblem();
  }, [id]);

  // Debug language changes
  useEffect(() => {
    console.log("Language changed to:", language);
    console.log(
      "Default code for",
      language,
      ":",
      getDefaultCode(language).substring(0, 50) + "..."
    );
  }, [language]);

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="flex flex-1 gap-2 min-h-0">
        <div className="w-1/2 flex flex-col">
          <div className="rounded-lg border bg-card shadow-sm p-6 flex-1 overflow-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold text-foreground">
                  {capitalizeFirstLetter(problem.title) || "Loading..."}
                </h2>
                <div className="flex items-center gap-2">
                  {switchState ? (
                    <span>Unmark completed</span>
                  ) : (
                    <span>Mark completed</span>
                  )}
                  <Switch
                    checked={switchState}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
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
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-30">
                    {language} <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setLanguage("python"), setLanguageCode(71);
                    }}
                  >
                    python
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setLanguage("javascript"), setLanguageCode(63);
                    }}
                  >
                    javascript
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setLanguage("java"), setLanguageCode(62);
                    }}
                  >
                    java
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setLanguage("cpp"), setLanguageCode(54);
                    }}
                  >
                    cpp
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setLanguage("c"), setLanguageCode(50);
                    }}
                  >
                    C
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="default" onClick={handleClick}>
                Run
              </Button>
            </div>
          </div>

          <div></div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="rounded-lg border overflow-hidden flex-1">
              <Editor
                height="60vh"
                language={language}
                theme="vs-dark"
                value={code || getDefaultCode(language)}
                options={{
                  padding: { top: 20, bottom: 20 },
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: true,
                  automaticLayout: true,
                }}
                onChange={(value) => setCode(value || "")}
              />
            </div>

            {/* Output Card */}
            <Card className="p-4 flex-1 max-h-[25vh] overflow-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Output
                  </h3>
                </div>

                <div className="bg-muted rounded-md p-3 font-mono text-sm">
                  {isLoading && (
                    <Loader2 className="w-4 animate-spin text-primary" />
                  )}
                  {!isLoading && (
                    <div className="text-muted-foreground">
                      {!output &&
                        `Click "Run" to execute your code and see the output here...`}
                      {output && <pre>{output}</pre>}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
