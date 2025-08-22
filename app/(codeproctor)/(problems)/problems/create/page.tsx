"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProblem } from "@/repository/problem.repository";
import test from "node:test";
import { useEffect, useState } from "react";

export interface tag {
  id: string;
  name: string;
}

export interface createTestcase {
  name: string;
  input: string;
  output: string;
}

export interface testcaseDTO {
  input: string;
  output: string;
}

/*
1. problem title
2. problem description
3. tag
4. add testcase
5. display all testcases already assigned
*/
export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problemid, setProblemid] = useState("");
  const [tags, setTags] = useState<tag[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [testcaseName, setTestcaseName] = useState("");
  const [testcaseInput, setTestcaseInput] = useState("");
  const [testcaseOutput, setTestcaseOutput] = useState("");
  const [createdProblem, setCreatedProblem] = useState(false);
  const [testcases, setTestCases] = useState<testcaseDTO[]>([]);

  // Function to reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedTag("");
    setProblemid("");
    setCreatedProblem(false);
    setTestcaseName("");
    setTestcaseInput("");
    setTestcaseOutput("");
  };
  async function getTestCases() {
    if (problemid) {
      const res = await fetch(`/api/problems/${problemid}/testcases`);
      const data = await res.json();
      setTestCases(data);
    }
  }
  useEffect(() => {
    async function fetchTags() {
      const res = await fetch("/api/problems/tags");
      const data = await res.json();
      setTags(data);
    }
    fetchTags();

    getTestCases();
  }, []);

  async function handleClick() {
    try {
      // Validate inputs
      if (!title.trim()) {
        alert("Please enter a problem title");
        return;
      }

      if (!description.trim()) {
        alert("Please enter a problem description");
        return;
      }

      const newProblemId = crypto.randomUUID();
      setProblemid(newProblemId);

      const newProblem: createProblem = {
        problemid: newProblemId,
        title: title.trim(),
        description: description.trim(),
      };

      // First create the problem
      const problemRes = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProblem),
      });

      if (!problemRes.ok) {
        const errorData = await problemRes.json();
        throw new Error(
          errorData.error ||
            `Failed to create problem: ${problemRes.statusText}`
        );
      }
      setCreatedProblem(true);

      if (selectedTag) {
        await assignTagToProblem(newProblemId);
      }

      alert("Problem created successfully!");
    } catch (error) {
      console.error("Error creating problem:", error);
      alert(
        `Failed to create problem: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async function assignTagToProblem(problemId: string) {
    try {
      const res = await fetch(`/api/problems/${problemId}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagId: selectedTag }),
      });

      if (!res.ok) {
        throw new Error(`Failed to assign tag: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error assigning tag:", error);
      throw error;
    }
  }

  async function handleCreateTestcase() {
    const newTestCase: createTestcase = {
      name: testcaseName,
      input: testcaseInput,
      output: testcaseOutput,
    };

    const res = await fetch(`/api/problems/${problemid}/testcases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTestCase),
    });

    if (!res.ok) {
      console.error("Error creating test case:", res.statusText);
      return;
    }

    alert("Test case created successfully!");
    getTestCases();

    // Clear testcase form after creation
    setTestcaseName("");
    setTestcaseInput("");
    setTestcaseOutput("");
  }

  return (
    <div>
      Create a problem
      <Input
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={createdProblem}
      />
      <Input
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={createdProblem}
      />
      <Select
        value={selectedTag}
        onValueChange={setSelectedTag}
        disabled={createdProblem}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {tags.map((tag, index) => (
              <SelectItem key={index} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={handleClick} disabled={createdProblem}>
        Create Problem
      </Button>
      {createdProblem && (
        <Button onClick={resetForm} variant="outline" className="ml-2">
          Create New Problem
        </Button>
      )}
      <Dialog>
        <DialogTrigger>
          <Button disabled={!createdProblem}>Create Testcase</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Testcase</DialogTitle>
            <DialogDescription>
              Please enter the details for the new testcase.
              <Input
                placeholder="testcase name"
                value={testcaseName}
                onChange={(e) => setTestcaseName(e.target.value)}
              />
              <Textarea
                placeholder="Input"
                value={testcaseInput}
                onChange={(e) => setTestcaseInput(e.target.value)}
              />
              <Textarea
                placeholder="Output"
                value={testcaseOutput}
                onChange={(e) => setTestcaseOutput(e.target.value)}
              />
              <Button onClick={handleCreateTestcase}>Create Testcase</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div>
        {createdProblem && (
          <div>
            <h2>Testcases for Problem ID: {problemid}</h2>
            {testcases.length === 0 ? (
              <p>No testcases assigned yet.</p>
            ) : (
              <ul>
                {testcases.map((tc, index) => (
                  <li key={index}>
                    <strong>Input:</strong> {tc.input} <br />
                    <strong>Output:</strong> {tc.output}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
