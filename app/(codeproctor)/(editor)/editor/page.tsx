"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Editor from "@monaco-editor/react";
import { ArrowBigDownIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function editor() {
  const [language, setLanuage] = useState<string>("c++");
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Online Compiler
        </h1>
        <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="mb-4">
              {language} <ChevronDown />{" "}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem onClick={() => setLanuage("python")}>
              python
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => setLanuage("c++")}>
              c++
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => setLanuage("javascript")}>
              javascript
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => setLanuage("c")}>
              c
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="ml-4" variant={"outline"}>
          Run
        </Button>
        </div>
      </div>
      <Editor
        height="80vh"
        language={language}
        defaultValue="// some comment"
        theme="vs-dark"
        options={
          {
            padding: {top:20, bottom:20},
            fontSize: 16,
            minimap: {enabled: false}
          }
        }
      />
    </div>
  );
}
