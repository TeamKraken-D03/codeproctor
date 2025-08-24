"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface Tag {
  id: string;
  name: string;
}

export interface CreateTestcase {
  name: string;
  input: string;
  output: string;
}

export interface TestcaseDTO {
  input: string;
  output: string;
}

export interface CreateProblem {
  problemid: string;
  title: string;
  description: string;
  created_by?: string; // Optional here as it will be set in the API
}

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problemid, setProblemid] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [testcaseName, setTestcaseName] = useState("");
  const [testcaseInput, setTestcaseInput] = useState("");
  const [testcaseOutput, setTestcaseOutput] = useState("");
  const [createdProblem, setCreatedProblem] = useState(false);
  const [testcases, setTestCases] = useState<TestcaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTestcase, setIsCreatingTestcase] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (problemid) {
      getTestCases();
    }
  }, [problemid]);

  async function fetchTags() {
    try {
      const res = await fetch("/api/problems/tags");
      if (res.ok) {
        const data = await res.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  }

  async function getTestCases() {
    if (!problemid) return;

    try {
      const res = await fetch(`/api/problems/${problemid}/testcases`);
      if (res.ok) {
        const data = await res.json();
        setTestCases(data);
      }
    } catch (error) {
      console.error("Failed to fetch test cases:", error);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setSelectedTag("");
    setProblemid("");
    setCreatedProblem(false);
    setTestCases([]);
  }

  function resetTestcaseForm() {
    setTestcaseName("");
    setTestcaseInput("");
    setTestcaseOutput("");
  }

  async function handleCreateProblem() {
    if (!title.trim()) {
      alert("Please enter a problem title");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a problem description");
      return;
    }

    setIsLoading(true);

    try {
      const newProblemId = crypto.randomUUID();

      const newProblem: CreateProblem = {
        problemid: newProblemId,
        title: title.trim(),
        description: description.trim(),
        // created_by will be populated from the session in the API
      };

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

      setProblemid(newProblemId);
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
    } finally {
      setIsLoading(false);
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
    if (
      !testcaseName.trim() ||
      !testcaseInput.trim() ||
      !testcaseOutput.trim()
    ) {
      alert("Please fill in all testcase fields");
      return;
    }

    setIsCreatingTestcase(true);

    try {
      const newTestCase: CreateTestcase = {
        name: testcaseName.trim(),
        input: testcaseInput.trim(),
        output: testcaseOutput.trim(),
      };

      const res = await fetch(`/api/problems/${problemid}/testcases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTestCase),
      });

      if (!res.ok) {
        throw new Error("Failed to create test case");
      }

      alert("Test case created successfully!");
      setIsDialogOpen(false);
      resetTestcaseForm();
      getTestCases();
    } catch (error) {
      console.error("Error creating test case:", error);
      alert("Failed to create test case");
    } finally {
      setIsCreatingTestcase(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Create Problem
        </h1>
        <p className="text-muted-foreground">
          Create a new coding problem for students to solve
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Problem Details</CardTitle>
            <CardDescription>
              Fill in the basic information for your problem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Problem Title</Label>
              <Input
                id="title"
                placeholder="Enter problem title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={createdProblem || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Problem Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createdProblem || isLoading}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag (Optional)</Label>
              <Select
                value={selectedTag}
                onValueChange={setSelectedTag}
                disabled={createdProblem || isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateProblem}
                disabled={createdProblem || isLoading}
                className="flex-1"
              >
                {isLoading ? "Creating..." : "Create Problem"}
              </Button>
              {createdProblem && (
                <Button onClick={resetForm} variant="outline">
                  Create New
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
            <CardDescription>
              {createdProblem
                ? "Add test cases to validate solutions"
                : "Create a problem first to add test cases"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!createdProblem ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Please create a problem first</p>
              </div>
            ) : (
              <>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Test Case
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Test Case</DialogTitle>
                      <DialogDescription>
                        Add input and expected output for this test case
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="testcase-name">Test Case Name</Label>
                        <Input
                          id="testcase-name"
                          placeholder="e.g., Test Case 1"
                          value={testcaseName}
                          onChange={(e) => setTestcaseName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testcase-input">Input</Label>
                        <Textarea
                          id="testcase-input"
                          placeholder="Enter the input for this test case"
                          value={testcaseInput}
                          onChange={(e) => setTestcaseInput(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testcase-output">Expected Output</Label>
                        <Textarea
                          id="testcase-output"
                          placeholder="Enter the expected output"
                          value={testcaseOutput}
                          onChange={(e) => setTestcaseOutput(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                      <Button
                        onClick={handleCreateTestcase}
                        disabled={isCreatingTestcase}
                        className="w-full"
                      >
                        {isCreatingTestcase
                          ? "Creating..."
                          : "Create Test Case"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="space-y-3">
                  {testcases.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No test cases added yet</p>
                    </div>
                  ) : (
                    testcases.map((tc, index) => (
                      <Card key={index} className="border-border/50">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">
                              Test Case {index + 1}
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-muted-foreground">
                                Input:
                              </div>
                              <div className="text-sm bg-muted p-2 rounded font-mono">
                                {tc.input}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-muted-foreground">
                                Output:
                              </div>
                              <div className="text-sm bg-muted p-2 rounded font-mono">
                                {tc.output}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
