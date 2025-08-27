"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Editor from "@monaco-editor/react";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function editor() {
  const [language, setLanguage] = useState<string>("javascript");
  const [languageCode, setLanguageCode] = useState(63); // Node.js JavaScript (default)
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Language mapping for Monaco Editor
  const getMonacoLanguage = (lang: string): string => {
    switch (lang) {
      case "c++": return "cpp";
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
      
      case "c++":
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

  const [code, setCode] = useState<string>(getDefaultCode("javascript"));

  // Update code when language changes
  useEffect(() => {
    setCode(getDefaultCode(language));
  }, [language]);

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

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="mb-4">
                {language} <ChevronDown />{" "}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setLanguage("python");
                  setLanguageCode(71); // Python 3
                }}
              >
                Python
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setLanguage("javascript");
                  setLanguageCode(63); // Node.js JavaScript
                }}
              >
                JavaScript
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setLanguage("java");
                  setLanguageCode(62); // Java 13
                }}
              >
                Java
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setLanguage("c++");
                  setLanguageCode(54); // C++ (GCC 9.2.0)
                }}
              >
                C++
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setLanguage("c");
                  setLanguageCode(50); // C (GCC 9.2.0)
                }}
              >
                C
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="ml-4" variant={"outline"} onClick={handleClick}>
            Run
          </Button>
        </div>
      </div>
      <div className="flex h-screen gap-4">
        <div className="w-1/2">
          <Editor
            key={language} // Force re-render when language changes
            height="80vh"
            language={getMonacoLanguage(language)}
            value={code}
            theme="vs-dark"
            options={{
              padding: { top: 20, bottom: 20 },
              fontSize: 16,
              minimap: { enabled: false },
            }}
            onChange={(value) => setCode(value || "")}
          />
        </div>
        <Card className="w-1/2 p-4 h-[80vh]">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>Loading...</p> : <p>{output}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
