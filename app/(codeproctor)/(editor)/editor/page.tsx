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
import { useState } from "react";

export default function editor() {
  const [language, setLanguage] = useState<string>("javascript");
  const [languageCode, setLanguageCode] = useState(102);
  const [output, setOutput] = useState<string>("");
  const [code, setCode] = useState<string>("// Write your code here\n");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
                  setLanguageCode(109);
                }}
              >
                python
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setLanguage("c++");
                  setLanguageCode(54);
                }}
              >
                c++
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setLanguage("javascript");
                  setLanguageCode(78);
                }}
              >
                javascript
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setLanguage("c");
                  setLanguageCode(54);
                }}
              >
                c
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
            height="80vh"
            language={language}
            defaultValue={code}
            defaultLanguage="javascript"
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
